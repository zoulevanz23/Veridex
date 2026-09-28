import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateAnalyze } from '../middleware/validate';
import { analyzeUrlHeuristics, extractUrlFromInput } from '../services/heuristics.service';
import { checkDomainReputation } from '../services/reputation.service';
import { callGemini } from '../services/gemini.service';
import { callGroq } from '../services/groq.service';
import { logger } from '../utils/logger';
import { env } from '../config/env';

const router = Router();

export const analysisLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many analysis requests, please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', async (req, res) => {
  console.log('Analyze route called', { body: req.body });
  res.json({
    result: {
      verdict: 'SAFE',
      confidence: 85,
      explanation: 'Test response - route is working',
      signals: ['Test signal'],
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
