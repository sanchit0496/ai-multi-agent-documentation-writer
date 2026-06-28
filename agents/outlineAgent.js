import { generateCompletion } from "../services/aiService.js";
import { outlineSystemPrompt } from "../prompts/outlinePrompt.js";
import { logger } from "../utils/logger.js";

/**
 * Pure function to execute the article outlining phase.
 * Transforms the technical research into a structured article blueprint
 * that will be consumed by the Writer Phase.
 *
 * @param {object} state - The immutable global pipeline state object.
 * @param {string} state.topic - The core subject matter.
 * @param {object} state.strategy - The output from the Planner Phase.
 * @param {object} state.researchData - The output from the Research Phase.
 * @returns {Promise<object>} - A new state object containing the populated `outline` property.
 */
export const executeOutlinePhase = async (state) => {
  logger.info("OutlinePhase", "Starting article outline generation.");

  if (!state.strategy) {
    throw new Error(
      'OutlinePhase Error: Missing required upstream data "state.strategy"',
    );
  }

  if (!state.researchData) {
    throw new Error(
      'OutlinePhase Error: Missing required upstream data "state.researchData"',
    );
  }

  try {
    // Only pass the data required for creating the article outline.
    const userContext = JSON.stringify(
      {
        topic: state.topic,

        strategy: state.strategy,

        researchData: state.researchData,
      },
      null,
      2,
    );

    // Generate a structured outline for the Writer Phase.
    const responseText = await generateCompletion(
      outlineSystemPrompt,

      userContext,

      {
        jsonOutput: true,
        temperature: 0.4,
      },
    );

    const outline = JSON.parse(responseText);

    logger.info("OutlinePhase", "Article outline generation completed.", {
      sectionsGenerated: outline.sections?.length || 0,
    });

    // Return a fresh immutable state object.
    return {
      ...state,

      outline,
    };
  } catch (error) {
    logger.error("OutlinePhase", "Failed to generate article outline.", error);

    throw new Error(`OutlinePhase Critical Failure: ${error.message}`);
  }
};
