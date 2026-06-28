import { generateCompletion } from "../services/aiService.js";
import { seoSystemPrompt } from "../prompts/seoPrompt.js";
import { logger } from "../utils/logger.js";

/**
 * Pure function to execute the SEO optimization phase.
 * Extracts SEO metadata from the reviewed article without modifying
 * the article itself.
 *
 * @param {object} state - The immutable global pipeline state object.
 * @param {string} state.topic - The core subject matter.
 * @param {string} state.finalDraft - The reviewed article.
 * @returns {Promise<object>} - A new state object containing the populated `seoData` property.
 */
export const executeSEOPhase = async (state) => {
  logger.info("SEOPhase", "Starting SEO optimization.");

  if (!state.finalDraft) {
    throw new Error(
      'SEOPhase Error: Missing required upstream data "state.finalDraft"',
    );
  }

  try {
    // Only pass the information required for SEO generation.
    const userContext = JSON.stringify(
      {
        topic: state.topic,

        article: state.finalDraft,
      },
      null,
      2,
    );

    // Generate structured SEO metadata.
    const responseText = await generateCompletion(
      seoSystemPrompt,

      userContext,

      {
        jsonOutput: true,
        temperature: 0.3,
      },
    );

    const seoData = JSON.parse(responseText);

    logger.info("SEOPhase", "SEO optimization completed.", {
      keywords: seoData.keywords?.length || 0,
      tags: seoData.tags?.length || 0,
    });

    // Return a fresh immutable state object.
    return {
      ...state,

      seoData,
    };
  } catch (error) {
    logger.error("SEOPhase", "Failed to generate SEO metadata.", error);

    throw new Error(`SEOPhase Critical Failure: ${error.message}`);
  }
};
