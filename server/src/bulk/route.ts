import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { analyzeUrlHeuristics, extractUrlFromInput } from '../services/heuristics.service';
import { checkDomainReputation } from '../services/reputation.service';
import { callGemini } from '../services/gemini.service';
import { callGroq } from '../services/groq.service';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const bulkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many bulk analysis requests, please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export interface BulkItem {
  id?: string;
  content: string;
  type?: 'message' | 'link' | 'news' | 'document' | 'image';
}

export function createBulkRoutes(): Router {
  const router = Router();

  router.post('/', bulkLimiter, async (req: Request, res: Response) => {
    try {
      const items: BulkItem[] = req.body.items || (Array.isArray(req.body) ? req.body : []);

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Payload must contain a non-empty "items" array.' });
      }

      if (items.length > 10) {
        return res.status(400).json({ error: 'Maximum 10 items allowed per bulk analysis request.' });
      }

      const results = await Promise.all(
        items.map(async (item, index) => {
          const type = item.type || 'message';
          const content = item.content || '';

          if (!content.trim()) {
            return {
              id: item.id || `item_${index}`,
              error: 'Empty content provided.',
            };
          }

          let preSignals: string[] = [];
          let preRiskScore = 0;

          if (type === 'link') {
            const candidate = extractUrlFromInput(content) || content.trim();
            const { signals, riskScore } = analyzeUrlHeuristics(candidate);
            preSignals = signals;
            preRiskScore = riskScore;
            try {
              const { signals: repSignals, riskDelta } = await checkDomainReputation(candidate);
              preSignals = [...preSignals, ...repSignals];
              preRiskScore += riskDelta;
            } catch {}
          }

          try {
            const aiResult = type === 'image'
              ? await callGemini(content, type)
              : env.AI_PROVIDER === 'groq'
                ? await callGroq(content, type)
                : await callGemini(content, type);

            let verdict = aiResult.verdict;
            if (preRiskScore >= 20 && (verdict === 'SAFE' || verdict === 'TRUSTWORTHY')) {
              verdict = 'SUSPICIOUS';
            }

            const mergedSignals = [...preSignals, ...aiResult.signals].slice(0, 12);

            return {
              id: item.id || `item_${index}`,
              result: {
                verdict,
                confidence: Math.max(0, Math.min(100, aiResult.confidence)),
                explanation: aiResult.explanation,
                signals: mergedSignals.length ? mergedSignals : aiResult.signals,
                rawText: aiResult.rawText,
              },
            };
          } catch (err: any) {
            logger.error({ err, itemIndex: index }, 'Bulk item analysis failed');
            return {
              id: item.id || `item_${index}`,
              error: err.message || 'Failed to analyze item.',
            };
          }
        })
      );

      return res.json({
        results,
        count: results.length,
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      logger.error({ err: e }, 'Bulk route handler error');
      return res.status(500).json({ error: 'Internal server error during bulk analysis processing.' });
    }
  });

  return router;
}

export default createBulkRoutes;
