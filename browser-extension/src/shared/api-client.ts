// Shared API client for the Veridex browser extension
// Handles communication with the Veridex backend

import storage from './storage';

const DEFAULT_API_BASE = 'http://localhost:5000';

export interface AnalysisResult {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'TRUSTWORTHY' | 'QUESTIONABLE' | 'LIKELY_FAKE';
  confidence: number;
  explanation: string;
  signals: string[];
}

export interface AnalyzeRequest {
  content: string;
  type: 'message' | 'link' | 'news' | 'document' | 'image';
}

export const api = {
  getApiBase: async (): Promise<string> => {
    const data = await storage.get();
    return (data.backendUrl || DEFAULT_API_BASE).replace(/\/$/, '');
  },

  analyze: async (request: AnalyzeRequest): Promise<AnalysisResult> => {
    const baseUrl = await api.getApiBase();
    const data = await storage.get();
    
    // Try /api/analyze endpoint first, fall back to /analyze
    const endpoints = [`${baseUrl}/api/analyze`, `${baseUrl}/analyze`];
    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(data.apiKey ? { 'x-api-key': data.apiKey } : {}),
          },
          body: JSON.stringify(request),
        });

        const resData = await response.json().catch(() => ({}));

        if (response.ok && resData.result) {
          return resData.result as AnalysisResult;
        }

        if (response.status === 404) {
          continue; // Try next endpoint
        }

        throw new Error(resData.error || `HTTP ${response.status}`);
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error('Could not reach Veridex server');
  },

  health: async (): Promise<boolean> => {
    try {
      const baseUrl = await api.getApiBase();
      const response = await fetch(`${baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};