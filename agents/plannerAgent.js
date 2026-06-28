// agents/plannerAgent.js
import { generateCompletion } from '../services/aiService.js';
import { plannerSystemPrompt } from '../prompts/plannerPrompt.js';
import { logger } from '../utils/logger.js';

/**
 * Pure function to execute the planning phase.
 * @param {object} state - The current pipeline state object.
 * @returns {Promise<object>} - Immutably updated state object containing the strategy.
 */
export const executePlannerPhase = async (state) => {
  logger.info('PlannerPhase', `Starting planning phase for topic: "${state.topic}"`);
  
  try {
    const userContext = `Topic to plan for: ${state.topic}`;
    
    // Call our functional AI Service
    const responseText = await generateCompletion(
      plannerSystemPrompt, 
      userContext,
      { jsonOutput: true, temperature: 0.5 }
    );

    const strategyData = JSON.parse(responseText);
    
    logger.info('PlannerPhase', `Planning complete. Identified ${strategyData.keyConcepts.length} key concepts.`);
    
    // Return a new state object (pure function, no mutation of the original)
    return {
      ...state,
      strategy: strategyData
    };

  } catch (error) {
    logger.error('PlannerPhase', 'Failed to execute planning phase', error);
    throw new Error(`PlannerPhase Error: ${error.message}`);
  }
};