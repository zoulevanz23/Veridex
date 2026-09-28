import { env } from '../config/env';

type Verdict = 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'TRUSTWORTHY' | 'QUESTIONABLE' | 'LIKELY_FAKE';

export interface StructuredResult {
  verdict: Verdict;
  confidence: number;
  explanation: string;
  signals: string[];
  rawText?: string;
}

const SYSTEM_INSTRUCTION_TEXT = `You are Veridex — a security-focused fact-checking assistant.
Analyze the user INPUT for phishing, scam, misinformation, or manipulation risks.
CRITICAL: You must respond with ONLY a valid JSON object. Do NOT use markdown code blocks. Do NOT include any text before or after the JSON.
Your entire response must be exactly this JSON format:
{"verdict":"SAFE|SUSPICIOUS|SCAM|TRUSTWORTHY|QUESTIONABLE|LIKELY_FAKE","confidence":0-100,"explanation":"string","signals":["string",...]}
Rules:
- One verdict only. SAFE/TRUSTWORTHY = benign, SUSPICIOUS/QUESTIONABLE = uncertain, SCAM/LIKELY_FAKE = malicious.
- confidence integer 0-100 calibrated to evidence, not style.
- explanation concise (2-4 sentences), actionable.
- signals: 2-6 short bullet phrases.
- NO markdown, NO code blocks, NO extra text. Just the JSON object.`;

const SYSTEM_INSTRUCTION_IMAGE = `You are Veridex — a security-focused multimodal fact-checking assistant.
Analyze the user INPUT IMAGE for AI-generated content, manipulation, deepfakes, or synthetic media risks.
CRITICAL: You must respond with ONLY a valid JSON object. Do NOT use markdown code blocks. Do NOT include any text before or after the JSON.
Your entire response must be exactly this JSON format:
{"verdict":"SAFE|SUSPICIOUS|SCAM|TRUSTWORTHY|QUESTIONABLE|LIKELY_FAKE","confidence":0-100,"explanation":"string","signals":["string",...]}
Rules:
- One verdict only. SAFE/TRUSTWORTHY = appears real/human-made, SUSPICIOUS/QUESTIONABLE = uncertain if AI-generated, SCAM/LIKELY_FAKE = likely AI-generated/synthetic.
- confidence integer 0-100 calibrated to evidence of AI generation markers.
- explanation concise (2-4 sentences), actionable. Mention specific AI generation markers if detected (e.g., artifacts, inconsistent lighting, strange textures, watermark patterns).
- signals: 2-6 short bullet phrases. Reference specific visual markers (e.g., "uncanny eyes", "inconsistent pupils", "watermark artifacts", "smoothing patterns").
- NO markdown, NO code blocks, NO extra text. Just the JSON object.
- If the image is clearly NOT AI-generated, favor SAFE or TRUSTWORTHY.
- If the image may be AI-generated but context is ambiguous, favor SUSPICIOUS or QUESTIONABLE.
- Always provide at least one signal pointing to why the verdict was reached.`;

function getSystemInstruction(contentType: string) {
  if (contentType === 'image') return SYSTEM_INSTRUCTION_IMAGE;
  return SYSTEM_INSTRUCTION_TEXT;
}

// parse structured JSON from Groq response
function parseStructured(text: string): StructuredResult | null {
  try {
    // Try to extract JSON from markdown code blocks first
    let jsonText = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    } else {
      // Try to find first JSON object
      const m = text.match(/\{[\s\S]*\}/);
      if (m) jsonText = m[0];
    }
    
    const obj = JSON.parse(jsonText.trim());
    if (typeof obj.verdict === 'string' && typeof obj.confidence === 'number' && typeof obj.explanation === 'string' && Array.isArray(obj.signals)) {
      const allowed: Verdict[] = ['SAFE','SUSPICIOUS','SCAM','TRUSTWORTHY','QUESTIONABLE','LIKELY_FAKE'];
      const v = String(obj.verdict).toUpperCase() as Verdict;
      if (!allowed.includes(v)) return null;
      return {
        verdict: v,
        confidence: Math.max(0, Math.min(100, Math.round(obj.confidence))),
        explanation: String(obj.explanation).slice(0, 800),
        signals: (obj.signals as string[]).map(String).slice(0, 8),
        rawText: text.trim().slice(0, 4000),
      };
    }
  } catch (e) {
    console.error({ parseError: String(e), textPreview: text.slice(0, 200) }, 'JSON parse failed');
  }
  return null;
}

function fallbackFromText(text: string): StructuredResult {
  const lower = text.toLowerCase();
  let verdict: Verdict = 'SUSPICIOUS';
  if (lower.includes('scam') || lower.includes('phishing')) verdict='SCAM';
  else if (lower.includes('suspicious') || lower.includes('warning')) verdict='SUSPICIOUS';
  else if (lower.includes('trustworthy') || lower.includes('safe')) verdict='SAFE';
  return { verdict, confidence: 55, explanation: text.slice(0,500), signals: ['Keyword-based assessment'], rawText: text.trim().slice(0,4000) };
}

export async function callGroq(content: string, contentType: 'message'|'link'|'news'|'document'|'image'): Promise<StructuredResult> {
  const key = (env.GROQ_API_KEY || '').trim();
  if (!key || key === '') {
    const err: any = new Error('Unable to verify content right now. The AI service is not properly configured. Please contact support.');
    err.status = 503;
    throw err;
  }

  const model = env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const contextLabel = contentType === 'image' ? 'Image' : contentType === 'link' ? 'URL/Link' : contentType === 'news' ? 'News/Article' : contentType === 'document' ? 'Document' : 'Message/Email';

  let messages: any[] = [];
  
  if (contentType === 'image') {
    let mimeType = 'image/jpeg';
    let b64 = content;
    if (content.startsWith('data:')) {
      const m = content.match(/^data:([^;]+);base64,(.+)$/);
      if (m) { mimeType = m[1]; b64 = m[2]; }
    }
    messages = [
      { role: 'system', content: getSystemInstruction(contentType) },
      { role: 'user', content: [
        { type: 'text', text: 'Analyze this image for AI generation.' },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${b64}` } }
      ]}
    ];
  } else {
    messages = [
      { role: 'system', content: getSystemInstruction(contentType) },
      { role: 'user', content: `Context: ${contextLabel}\nINPUT:\n${content}` }
    ];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  
  try {
    console.log({ model, contentType }, 'groq try');
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 768,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    if (resp.ok) {
      const data: any = await resp.json();
      const text: string | undefined = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('The verification service returned an empty response. Please try again.');
      const parsed = parseStructured(text);
      if (parsed) { console.log({ model }, 'groq ok'); return parsed; }
      // fallback from unstructured
      return fallbackFromText(text);
    }
    
    const t = await resp.text();
    console.error({ model, status: resp.status }, t.slice(0, 120));
    
    if (resp.status === 429) {
      const e: any = new Error('Too many requests. Please wait a moment and try again.');
      e.status = 429;
      throw e;
    }
    
    const e: any = new Error(env.NODE_ENV !== 'production' ? t.slice(0, 400) : 'Verification service temporarily unavailable. Please try again.');
    e.status = 500;
    throw e;
  } catch (e: any) {
    clearTimeout(timeout);
    if (e.status === 429) throw e;
    if (e.name === 'AbortError') {
      const err: any = new Error('Request timeout. Please try again.');
      err.status = 504;
      throw err;
    }
    if (e.status) throw e;
    const err: any = new Error('Network error. Please check your connection.');
    err.status = 500;
    throw err;
  }
}
