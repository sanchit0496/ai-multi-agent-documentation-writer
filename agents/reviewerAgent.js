import { generateCompletion } from '../services/aiService.js';
import { reviewerSystemPrompt } from '../prompts/reviewerPrompt.js';
import { logger } from '../utils/logger.js';

/**
 * Pure function to execute the article review phase.
 * Reviews the generated article for technical accuracy, readability,
 * completeness, and overall quality before further pipeline processing.
 */
export const executeReviewerPhase = async (state) => {
  logger.info('ReviewerPhase', 'Starting article review.');

  if (!state.draft) {
    throw new Error('ReviewerPhase Error: Missing required upstream data "state.draft"');
  }

  try {
    const userContext = JSON.stringify(
      {
        topic: state.topic,
        strategy: state.strategy,
        researchData: state.researchData,
        outline: state.outline,
        draft: state.draft,
      },
      null,
      2,
    );

    const responseText = await generateCompletion(reviewerSystemPrompt, userContext, {
      jsonOutput: true,
      temperature: 0.2,
    });

    const reviewerOutput = JSON.parse(responseText);

    // FIX: Removed the ".review" nesting here! 
    logger.info('ReviewerPhase', 'Article review completed successfully.', {
      technical: reviewerOutput.technical,
      clarity: reviewerOutput.clarity,
      completeness: reviewerOutput.completeness,
    });

    return {
      ...state,
      // We map the flat reviewerOutput directly to state.review so the 
      // Supervisor and Writer agents still get the exact shape they expect.
      review: reviewerOutput, 
    };
  } catch (error) {
    logger.error('ReviewerPhase', 'Failed to review article.', error);
    throw new Error(`ReviewerPhase Critical Failure: ${error.message}`);
  }
};