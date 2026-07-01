import { generateCompletion } from '../services/aiService.js';
import { writerSystemPrompt } from '../prompts/writerPrompt.js';
import { logger } from '../utils/logger.js';

/**
 * Executes the article writing phase. Generates the initial article
 * or improves an existing draft using reviewer feedback.
 *
 * @param {object} state - Immutable pipeline state.
 * @returns {Promise<object>} - Updated state with populated `draft`.
 */
export const executeWriterPhase = async (state) => {
  logger.info('WriterPhase', 'Starting article generation.');

  if (!state.outline) throw new Error('WriterPhase: Missing required data "state.outline"');

  try {
    const userContext = JSON.stringify({
      topic: state.topic,
      strategy: state.strategy,
      researchData: state.researchData,
      outline: state.outline,
      previousDraft: state.draft || null,
      reviewerFeedback: state.review?.feedback || null,
    });

    const draft = await generateCompletion(writerSystemPrompt, userContext, { jsonOutput: false, temperature: 0.7 });

    logger.info('WriterPhase', 'Generation completed.', { rewrite: !!state.review, length: draft.length });

    return { ...state, draft };
  } catch (error) {
    logger.error('WriterPhase', 'Failed to generate article.', error);
    throw new Error(`WriterPhase Critical Failure: ${error.message}`);
  }
};
