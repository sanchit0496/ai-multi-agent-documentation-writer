// index.js
import { logger } from './utils/logger.js';
import { PlannerAgent } from './agents/plannerAgent.js';
// import { ResearchAgent } from './agents/researchAgent.js'; 
// import { ExporterAgent } from './agents/exporterAgent.js';

/**
 * The core application state that flows through the agent pipeline.
 * Each agent reads from this state and appends its specific output.
 */
const initialState = {
  topic: "Designing a Production-Ready Multi-Agent Architecture in Node.js",
  strategy: null,
  researchData: null,
  outline: null,
  draft: null,
  seoData: null,
  finalMarkdownFile: null
};

/**
 * Main application orchestrator.
 * Executes the agents in a strict, sequential pipeline.
 */
async function runPipeline() {
  logger.info('Orchestrator', 'Initializing AI Agent Pipeline...');
  let state = { ...initialState };

  try {
    // 1. Planner Agent
    state = await PlannerAgent.execute(state);
    
    // 2. Research Agent (Example of how it drops in)
    // state = await ResearchAgent.execute(state);

    // 3. Fact Checker Agent
    // state = await FactCheckerAgent.execute(state);

    // ... continue pipeline ...

    // N. Exporter Agent
    // await ExporterAgent.execute(state);

    logger.info('Orchestrator', 'Pipeline completed successfully!');
    logger.info('Orchestrator', 'Final Output summary:', {  
        thesis: state 
    });

  } catch (error) {
    logger.error('Orchestrator', 'Pipeline execution halted due to a critical error.', error);
    process.exit(1);
  }
}

// Execute application
runPipeline();