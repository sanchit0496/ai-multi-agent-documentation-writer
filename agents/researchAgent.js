// agents/researchAgent.js
import { generateCompletion } from '../services/aiService.js';
import { researchSystemPrompt } from '../prompts/researchPrompt.js';
import { logger } from '../utils/logger.js';

/**
 * Pure function to execute the deep-dive technical research phase.
 * Transforms the high-level strategy into concrete, verified technical data points.
 *
 * @param {object} state - The immutable global pipeline state object.
 * @param {string} state.topic - The core subject matter.
 * @param {object} state.strategy - The output from the Planner Phase.
 * @returns {Promise<object>} - A new state object containing the populated `researchData` property.
 */
export const executeResearchPhase = async (state) => {
  logger.info('ResearchPhase', 'Starting deep-dive technical research.');

  if (!state.strategy) {
    throw new Error('ResearchPhase Error: Missing required upstream data "state.strategy"');
  }

  try {
    // We stringify only the subset of state this agent actually cares about
    const userContext = JSON.stringify(
      {
        topic: state.topic,
        strategy: state.strategy,
      },
      null,
      2,
    );

    // Enforce JSON output for predictable state parsing
    const responseText = await generateCompletion(
      researchSystemPrompt,
      userContext,
      { jsonOutput: true, temperature: 0.3 }, // Low temp for factual, analytical output
    );

    const researchData = JSON.parse(responseText);

    logger.info('ResearchPhase', 'Research phase complete.', {
      mechanismsFound: researchData.coreMechanisms?.length || 0,
    });

    // Return a fresh state clone (Immutability pattern)
    return {
      ...state,
      researchData: researchData,
    };
  } catch (error) {
    logger.error('ResearchPhase', 'Failed to execute technical research phase.', error);
    throw new Error(`ResearchPhase Critical Failure: ${error.message}`);
  }
};
