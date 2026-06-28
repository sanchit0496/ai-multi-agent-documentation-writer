// index.js
import { logger } from './utils/logger.js';
import { executePlannerPhase } from './agents/plannerAgent.js';
import { executeResearchPhase } from './agents/researchAgent.js';

const initialState = {
  topic: "Best practices in a React JS Web Application",
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
    // 1. Run the Planner
    let state = await executePlannerPhase(initialState);
    
    // 2. Pass the updated state into the Researcher
    state = await executeResearchPhase(state);
    
    logger.info('Orchestrator', 'Research Node completed successfully!');
    
    // Let's log the output to verify the Research node successfully grabbed the Planner's strategy
    console.log('\n--- VERIFIED STATE AFTER RESEARCHER ---');
    console.dir(state.researchData, { depth: null, colors: true });
    console.log('---------------------------------------\n');

  } catch (error) {
    logger.error('Orchestrator', 'Pipeline execution halted due to a critical error.', error);
    process.exit(1);
  }
}

// Kick off the system
runPipeline();