// agents/writerAgent.js

import { generateCompletion } from "../services/aiService.js";
import { writerSystemPrompt } from "../prompts/writerPrompt.js";
import { logger } from "../utils/logger.js";

/**
 * Pure function to execute the article writing phase.
 * Transforms the planning strategy, technical research, and article outline
 * into a complete production-quality Markdown article.
 *
 * @param {object} state - The immutable global pipeline state object.
 * @param {string} state.topic - The core subject matter.
 * @param {object} state.strategy - The output from the Planner Phase.
 * @param {object} state.researchData - The output from the Research Phase.
 * @param {object} state.outline - The output from the Outline Phase.
 * @returns {Promise<object>} - A new state object containing the populated `draft` property.
 */
export const executeWriterPhase = async (state) => {
  logger.info("WriterPhase", "Starting production article generation.");

  if (!state.strategy) {
    throw new Error(
      'WriterPhase Error: Missing required upstream data "state.strategy"',
    );
  }

  if (!state.researchData) {
    throw new Error(
      'WriterPhase Error: Missing required upstream data "state.researchData"',
    );
  }

  if (!state.outline) {
    throw new Error(
      'WriterPhase Error: Missing required upstream data "state.outline"',
    );
  }

  try {
    // Only pass the data required for writing the article.
    const userContext = JSON.stringify(
      {
        topic: state.topic,

        strategy: state.strategy,

        researchData: state.researchData,

        outline: state.outline,
      },
      null,
      2,
    );

    // Generate the first draft in Markdown format.
    const draft = await generateCompletion(
      writerSystemPrompt,

      userContext,

      {
        jsonOutput: false,
        temperature: 0.7,
      },
    );

    logger.info("WriterPhase", "Article draft generated successfully.", {
      charactersGenerated: draft.length,
    });

    // Return a fresh immutable state object.
    return {
      ...state,

      draft,
    };
  } catch (error) {
    logger.error("WriterPhase", "Failed to generate article draft.", error);

    throw new Error(`WriterPhase Critical Failure: ${error.message}`);
  }
};
