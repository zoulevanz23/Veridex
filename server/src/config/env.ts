import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1000).max(65535).default(5000),
  GEMINI_API_KEY: z.string().min(10, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  AI_PROVIDER: z.enum(['gemini', 'groq']).default('gemini'),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('mixtral-8x7b-32768'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().optional(),
  ENABLE_REPUTATION_CHECKS: z.enum(['0', '1']).default('0'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  REDIS_URL: z.string().optional(),

  // User Accounts (Phase 1)
  DATABASE_URL: z.string().optional().default('postgresql://user:pass@localhost:5432/db'),
  NEXTAUTH_SECRET: z.string().optional().default('development-secret-key'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(4).default(14),
});

type Env = z.infer<typeof envSchema>;

let parsed: Env;
try {
  parsed = envSchema.parse(process.env);
} catch (e: any) {
  if (e.errors) {
    console.error('❌ Invalid environment variables:');
    for (const err of e.errors) console.error(`  - ${err.path.join('.')}: ${err.message}`);
  } else {
    console.error('Env parse error', e.message);
  }
  // Allow boot in dev without GEMINI_API_KEY for health checks; service will return 503
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY missing — /analyze will return 503 until configured');
    parsed = envSchema.parse({ ...process.env, GEMINI_API_KEY: 'placeholder-missing-key' });
  } else {
    throw e;
  }
}

export const env = parsed;
export const isProd = env.NODE_ENV === 'production';
export const allowedOrigins = (env.ALLOWED_ORIGINS || env.FRONTEND_URL)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);