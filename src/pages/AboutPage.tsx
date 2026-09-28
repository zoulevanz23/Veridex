export default function AboutPage() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Editorial header */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 48px' }}>
          <p className="font-serif-display" style={{ color: 'var(--ink-soft)', fontSize: 15, maxWidth: '68ch', margin: '0 0 16px' }}>
            About Veridex.
          </p>
          <h1 className="font-serif-display" style={{ color: 'var(--ink)', fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.15, maxWidth: '24ch', margin: 0 }}>
            A quiet second opinion for anything you're not sure about.
          </h1>
          <p className="font-serif-display" style={{ color: 'var(--ink)', fontSize: 18, lineHeight: 1.6, maxWidth: '68ch', marginTop: 18 }}>
            Veridex is a tool that checks what you paste, tells you what it found, and gets out of the way. No account, no feed, no notifications.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            The problem
          </h2>
          <div style={{ maxWidth: '68ch' }}>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)' }}>
              A message arrives — a delivery notice, an invoice, an "urgent" email from your bank. It could be real. It could be a scam. Either way, there are about ten seconds to decide what to do with it.
            </p>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', marginTop: 18 }}>
              Searching the text on Google is unreliable. Asking a friend takes time. Forwarding it to a family group chat creates noise. Veridex is a faster and quieter way to read a message the way a fraud examiner would, without making a big deal out of it.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            How it actually works
          </h2>
          <div style={{ maxWidth: '68ch' }}>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)' }}>
              When you paste something, Veridex runs two passes. The first is a set of transparent heuristics — pattern checks for urgency language, credential requests, link shorteners, and mismatched sender domains. These signals are visible in the output; they're not hidden inside a black box.
            </p>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', marginTop: 18 }}>
              The second pass sends the full content to a structured AI check. The model reads the context, applies a narrow prompt, and returns a JSON object: a verdict, a confidence score, a plain-language explanation, and the specific signals it relied on.
            </p>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', marginTop: 18 }}>
              For images, the same pipeline runs through a multimodal model that can inspect pixels — checking for AI generation markers, deepfake artifacts, or manipulation patterns.
            </p>
          </div>
        </div>
      </section>

      {/* What it won't do */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            What it won't do
          </h2>
          <div style={{ maxWidth: '68ch' }}>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)' }}>
              Veridex won't tell you what to do. It gives you a read on the content, but the decision is yours. A "Safe" verdict doesn't mean you should send your bank details — it means the content doesn't match known scam patterns.
            </p>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', marginTop: 18 }}>
              It won't store your content, remember what you checked, or build a profile of you. There's no account system, no database of past checks, no analytics. Once you navigate away, the content is gone.
            </p>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', marginTop: 18 }}>
              And it won't catch everything. If a scam is new enough or sophisticated enough, it might slip through. That's why the output includes confidence scores and the specific signals found — so the final call stays in your hands.
            </p>
          </div>
        </div>
      </section>

      {/* The stack */}
      <section className="paper-grain" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '56px 24px' }}>
          <h2 className="font-instrument font-semibold mb-8" style={{ fontSize: 22, color: 'var(--ink)' }}>
            Under the hood
          </h2>
          <div style={{ maxWidth: '68ch' }}>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)' }}>
              The frontend is React with TypeScript, built with Vite. The backend is a Node.js server that routes requests to either Google Gemini or Groq, depending on configuration. The browser extension is a Manifest V3 service worker that injects a small content script — no frameworks, no build step, just plain JavaScript.
            </p>
            <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', marginTop: 18 }}>
              The heuristics are hand-written regex and scoring rules. The AI prompts are tuned to return strict JSON — no markdown, no conversational filler. Rate limiting is per-IP and generous enough for normal use.
            </p>
          </div>
        </div>
      </section>

      {/* Close */}
      <section style={{ background: 'var(--surface)' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1120, padding: '48px 24px' }}>
          <p className="font-serif-display m-0" style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink)', maxWidth: '68ch' }}>
            Veridex is an open tool. The heuristics, prompts, and source are available in the repository — if a false verdict slips through, file an issue and it gets a genuine look.
          </p>
          <p className="font-serif-display m-0" style={{ fontSize: 15, color: 'var(--ink-soft)', maxWidth: '68ch', marginTop: 16 }}>
            Trust the signals, not the score.
          </p>
        </div>
      </section>
    </div>
  )
}