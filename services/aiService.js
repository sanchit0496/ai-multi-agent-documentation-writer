import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";

import { config } from "../config/env.js";
import { logger } from "../utils/logger.js";

const modelCache = new Map();

/**
 * Returns a cached LangChain model instance.
 */
const getModel = (modelName, temperature) => {
  const key = `${modelName}-${temperature}`;

  if (!modelCache.has(key)) {
    modelCache.set(
      key,
      new ChatGoogleGenerativeAI({
        apiKey: config.GEMINI_API_KEY,
        model: modelName,
        temperature,
        // SDE2 Flex: LangChain handles exponential backoff natively!
        maxRetries: config.MAX_RETRIES, 
      }),
    );
  }

  return modelCache.get(key);
};

/**
 * Generates a completion from the LLM.
 *
 * @param {string} systemPrompt
 * @param {string} userContext
 * @param {object} options
 * @returns {Promise<string>}
 */
export const generateCompletion = async (
  systemPrompt,
  userContext,
  options = {},
) => {
  const modelName = options.model || config.MODEL_NAME;
  const temperature = options.temperature ?? 0.7;

  try {
    const startTime = Date.now();
    const model = getModel(modelName, temperature);
    
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userContext),
    ];

    // THIS IS THE SWEET SPOT FOR LCEL
    // We dynamically pick the parser based on the agent's request
    const parser = options.jsonOutput 
      ? new JsonOutputParser() 
      : new StringOutputParser();

    // Pipe the model output directly into the parser
    const chain = model.pipe(parser);
    
    // Invoke the chain
    let result = await chain.invoke(messages);

    // Backwards compatibility: Your agents expect a string to JSON.parse() later.
    // If we used the JsonOutputParser, we stringify it before returning so 
    // you don't have to rewrite all your agents today.
    if (options.jsonOutput) {
      result = JSON.stringify(result);
    }

    const executionTime = Date.now() - startTime;

    logger.info(
      "AIService",
      `Completion successful via ${modelName}`,
      { executionTimeMs: executionTime },
    );

    return result;

  } catch (error) {
    // We only log here because LangChain handles the 429/503 retries internally
    logger.error(
      "AIService",
      `Service failed completely after retries: ${error.message}`,
    );
    throw new Error(
      `AIService failed. Last error: ${error.message}`,
    );
  }
};