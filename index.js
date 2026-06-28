import { logger } from './utils/logger.js';
import { executePlannerPhase } from './agents/plannerAgent.js';
import { executeResearchPhase } from './agents/researchAgent.js';
import { executeOutlinePhase } from './agents/outlineAgent.js';

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

  logger.info(
    'Orchestrator',
    'Initializing Functional AI Agent Pipeline...'
  );

  try {

    // 1. Run the Planner
    let state = await executePlannerPhase(initialState);

    // 2. Run the Research Phase
    state = await executeResearchPhase(state);

    logger.info(
      'Orchestrator',
      'Research Node completed successfully!'
    );

    // 3. Run the Outline Phase
    state = await executeOutlinePhase(state);

    logger.info(
      'Orchestrator',
      'Outline Node completed successfully!'
    );

    // Verify the generated outline
    console.log('\n--- VERIFIED STATE AFTER OUTLINE ---');
    console.dir(state.outline, {
      depth: null,
      colors: true
    });
    console.log('------------------------------------\n');

  } catch (error) {

    logger.error(
      'Orchestrator',
      'Pipeline execution halted due to a critical error.',
      error
    );

    process.exit(1);

  }

}

// Kick off the system
runPipeline();
