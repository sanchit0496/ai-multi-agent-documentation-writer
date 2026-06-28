// index.js
import { logger } from './utils/logger.js';
import { executePlannerPhase } from './agents/plannerAgent.js';

const initialState = {
  topic: "Designing a Production-Ready Multi-Agent Architecture in Node.js",
  strategy: null,
  researchData: null,
  auditLog: null,
  outline: null,
  draft: null,
  finalDraft: null,
  seoData: null,
  finalMarkdownFile: null
};

async function runPipeline() {
  logger.info('Orchestrator', 'Initializing Functional AI Agent Pipeline...');
  
  try {
    // We pass the initial state in, and get the new state out.
    // This is the core of functional data pipelines!
    const stateAfterPlanning = await executePlannerPhase(initialState);
    
    logger.info('Orchestrator', 'Planner Node completed successfully!');
    
    // Let's log the output to verify our state actually updated
    console.log('\n--- VERIFIED STATE AFTER PLANNER ---');
    console.dir(stateAfterPlanning.strategy, { depth: null, colors: true });
    console.log('------------------------------------\n');

  } catch (error) {
    logger.error('Orchestrator', 'Pipeline execution halted due to a critical error.', error);
    process.exit(1);
  }
}

// Kick off the system
runPipeline();