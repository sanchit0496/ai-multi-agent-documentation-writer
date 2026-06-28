// config/env.js
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required"),
  // Defaulting to the free-tier friendly Flash model
  MODEL_NAME: z.string().default('gemini-2.5-flash'),
  MAX_RETRIES: z.coerce.number().default(4), // Bumped up slightly for the free tier
  LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;