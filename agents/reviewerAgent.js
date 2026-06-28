import { generateCompletion } from '../services/aiService.js';
import { reviewerSystemPrompt } from '../prompts/reviewerPrompt.js';
import { logger } from '../utils/logger.js'; 

/**
 * Pure function to execute the article review phase.
 * Reviews the generated article for technical accuracy, readability,
 * structure, grammar, and overall quality before SEO optimization.
 *
 * @param {object} state - The immutable global pipeline state object.
 * @param {string} state.topic - The core subject matter.
 * @param {object} state.strategy - The output from the Planner Phase.
 * @param {object} state.researchData - The output from the Research Phase.
 * @param {object} state.outline - The output from the Outline Phase.
 * @param {string} state.draft - The output from the Writer Phase.
 * @returns {Promise<object>} - A new state object containing the populated `finalDraft` property.
 */
export const executeReviewerPhase = async (state) => {

  logger.info(
    'ReviewerPhase',
    'Starting article review.'
  );

  if (!state.draft) {
    throw new Error(
      'ReviewerPhase Error: Missing required upstream data "state.draft"'
    );
  }

  try {

    // Only pass the data required for reviewing the article.
    const userContext = JSON.stringify({

      topic: state.topic,

      strategy: state.strategy,

      researchData: state.researchData,

      outline: state.outline,

      draft: state.draft

    }, null, 2);

    // Review and improve the generated article.
    const finalDraft = await generateCompletion(

      reviewerSystemPrompt,

      userContext,

      {
        jsonOutput: false,
        temperature: 0.2
      }

    );

    logger.info(
      'ReviewerPhase',
      'Article review completed successfully.',
      {
        charactersGenerated: finalDraft.length
      }
    );

    // Return a fresh immutable state object.
    return {

      ...state,

      finalDraft

    };

  } catch (error) {

    logger.error(
      'ReviewerPhase',
      'Failed to review article.',
      error
    );

    throw new Error(
      `ReviewerPhase Critical Failure: ${error.message}`
    );

  }

};
