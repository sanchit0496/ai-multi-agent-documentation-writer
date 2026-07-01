import { logger } from "./utils/logger.js";
import { executePlannerPhase } from "./agents/plannerAgent.js";
import { executeResearchPhase } from "./agents/researchAgent.js";
import { executeOutlinePhase } from "./agents/outlineAgent.js";
import { executeWriterPhase } from "./agents/writerAgent.js";
import { executeReviewerPhase } from "./agents/reviewerAgent.js";
import { executeSEOPhase } from "./agents/seoAgent.js";
import { executeExporterPhase } from "./agents/exporterAgent.js";
import { calculateMetrics } from "./services/metricsService.js";
import { evaluateArticle } from "./services/supervisorService.js";

const MAX_REVISIONS = 3;
const initialState = {
  topic: "Best practices in React Native development",
  strategy: null,
  researchData: null,
  outline: null,
  draft: null,
  review: null,
  metrics: null,
  supervisor: null,
  seoData: null,
  finalMarkdownFile: null,
};

async function runPipeline() {
  logger.info("Orchestrator", "Initializing Functional AI Agent Pipeline...");

  try {
    let state = initialState;

    // Initial Pipeline
    state = await executePlannerPhase(state);
    state = await executeResearchPhase(state);
    state = await executeOutlinePhase(state);

    // Review Loop
    let revision = 1;
    while (revision <= MAX_REVISIONS) {
      logger.info("Orchestrator", `Starting revision ${revision}.`);

      state = await executeWriterPhase(state);
      state = await executeReviewerPhase(state);

      const metrics = calculateMetrics(state.draft);
      const supervisor = evaluateArticle(state.review, metrics);

      state = { ...state, metrics, supervisor };

      logger.info("Orchestrator", "Supervisor decision completed.", supervisor);

      if (supervisor.accepted) {
        logger.info("Orchestrator", "Article approved.");
        break; 
      }

      logger.warn("Orchestrator", "Article requires another refinement cycle.");
      revision++;
    }

    if (!state.supervisor.accepted)
      throw new Error(`Maximum revision limit (${MAX_REVISIONS}) reached.`);

    // Final Pipeline
    state = await executeSEOPhase(state);
    state = await executeExporterPhase(state);

    logger.info("Orchestrator", "Pipeline completed successfully.");
    console.log(
      "\n======================================\nPIPELINE COMPLETED SUCCESSFULLY\n======================================\n",
    );
    console.log("Overall Score:", state.supervisor.overallScore);
    console.log("Output File:", state.finalMarkdownFile);
    console.log("\n======================================\n");
  } catch (error) {
    logger.error("Orchestrator", "Pipeline execution halted.", error);
    process.exit(1);
  }
}

runPipeline();