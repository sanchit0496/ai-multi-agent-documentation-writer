import { AIService } from '../services/aiService.js';
import { plannerSystemPrompt } from '../prompts/plannerPrompt.js';
import { logger } from '../utils/logger.js';

/**
 * Planner Agent
 * Responsible for defining the overall strategy and directives for the article.
 */
export class PlannerAgent {
  /**
   * Executes the planning phase.
   * * @param {object} state - The current pipeline state object.
   * @returns {Promise<object>} - The updated state object containing the strategy.
   */
  static async execute(state) {
    logger.info('PlannerAgent', `Starting planning phase for topic: "${state.topic}"`);
    
    try {
      const userContext = `Topic to plan for: ${state.topic}`;
      
      // We request JSON output to easily parse the strategy into our state object
      const responseText = await AIService.generateCompletion(
        plannerSystemPrompt, 
        userContext,
        { jsonOutput: true, temperature: 0.5 } // Lower temp for more analytical planning
      );

      const strategyData = JSON.parse(responseText);
      
      // Update state immutably (best practice for pipelines)
      const updatedState = {
        ...state,
        strategy: strategyData
      };

      logger.info('PlannerAgent', `Planning complete. Identified ${strategyData.keyConcepts.length} key concepts.`);
      return updatedState;

    } catch (error) {
      logger.error('PlannerAgent', 'Failed to execute planning phase', error);
      throw new Error(`PlannerAgent Error: ${error.message}`);
    }
  }
}