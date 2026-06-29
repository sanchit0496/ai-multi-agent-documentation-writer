import { generateCompletion } from '../services/aiService.js';
import { outlineSystemPrompt } from '../prompts/outlinePrompt.js';
import { logger } from '../utils/logger.js';

/**
 * Executes the article outlining phase. Transforms technical research
 * into a structured article blueprint for the Writer Phase.
 *
 * @param {object} state - Immutable pipeline state.
 * @returns {Promise<object>} - Updated state with `outline`.
 */
export const executeOutlinePhase = async (state) => {
  logger.info('OutlinePhase', 'Starting article outline generation.');

  if (!state.strategy || !state.researchData) throw new Error('OutlinePhase Error: Missing strategy or researchData.');

  try {
    const userContext = JSON.stringify({
      topic: state.topic,
      strategy: state.strategy,
      researchData: state.researchData,
    });
    const responseText = await generateCompletion(outlineSystemPrompt, userContext, {
      jsonOutput: true,
      temperature: 0.4,
    });
    const outline = JSON.parse(responseText);

    logger.info('OutlinePhase', 'Outline generation completed.', { sections: outline.sections?.length || 0 });

    return { ...state, outline };
  } catch (error) {
    logger.error('OutlinePhase', 'Failed to generate article outline.', error);
    throw new Error(`OutlinePhase Critical Failure: ${error.message}`);
  }
};
