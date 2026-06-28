// services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

/**
 * Generates a completion from the LLM.
 * @param {string} systemPrompt - The strict instructions for the agent.
 * @param {string} userContext - The current state or data to process.
 * @param {object} options - Optional overrides (e.g., jsonOutput, temperature).
 * @returns {Promise<string>} - The LLM's response text.
 */
export const generateCompletion = async (systemPrompt, userContext, options = {}) => {
  let attempts = 0;
  const maxRetries = config.MAX_RETRIES;
  const modelName = options.model || config.MODEL_NAME;

  while (attempts < maxRetries) {
    try {
      const startTime = Date.now();
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });

      const generationConfig = { temperature: options.temperature ?? 0.7 };
      if (options.jsonOutput) {
        generationConfig.responseMimeType = "application/json";
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userContext }] }],
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();
      const executionTime = Date.now() - startTime;
      const tokens = response.usageMetadata?.totalTokenCount || 0;

      logger.info('AIService', `Completion successful via ${modelName}`, { executionTimeMs: executionTime, tokens });
      return text;

    } catch (error) {
      attempts++;
      const isRateLimit = error.message?.includes('429') || error.status === 429 || error.message?.includes('503');
      logger.error('AIService', `Attempt ${attempts} failed: ${error.message}`);
      
      if (attempts >= maxRetries) {
        throw new Error(`AIService failed after ${maxRetries} attempts. Last error: ${error.message}`);
      }
      
      const baseDelay = isRateLimit ? 5000 : 2000; 
      const backoff = Math.pow(2, attempts) * baseDelay;
      logger.info('AIService', `Backing off for ${backoff / 1000} seconds before retrying...`);
      await new Promise(res => setTimeout(res, backoff));
    }
  }
};