import { logger } from "./utils/logger.js";

import { executePlannerPhase } from "./agents/plannerAgent.js";
import { executeResearchPhase } from "./agents/researchAgent.js";
import { executeOutlinePhase } from "./agents/outlineAgent.js";
import { executeWriterPhase } from "./agents/writerAgent.js";
import { executeReviewerPhase } from "./agents/reviewerAgent.js";
import { executeSEOPhase } from "./agents/seoAgent.js";
import { executeExporterPhase } from "./agents/exporterAgent.js";

const initialState = {
  topic: "Best practices in creating CI CD pipelines for Node.js applications",
  strategy: null,
  researchData: null,
  auditLog: null,
  outline: null,
  draft: null,
  finalDraft: null,
  seoData: null,
  finalMarkdownFile: null,
};

async function runPipeline() {
  logger.info("Orchestrator", "Initializing Functional AI Agent Pipeline...");

  try {
    // ---------------------------------------------------------------------
    // 1. Planner Phase
    // ---------------------------------------------------------------------

    let state = await executePlannerPhase(initialState);

    logger.info("Orchestrator", "Planner Node completed successfully!");

    // ---------------------------------------------------------------------
    // 2. Research Phase
    // ---------------------------------------------------------------------

    state = await executeResearchPhase(state);

    logger.info("Orchestrator", "Research Node completed successfully!");

    // ---------------------------------------------------------------------
    // 3. Outline Phase
    // ---------------------------------------------------------------------

    state = await executeOutlinePhase(state);

    logger.info("Orchestrator", "Outline Node completed successfully!");

    // ---------------------------------------------------------------------
    // 4. Writer Phase
    // ---------------------------------------------------------------------

    state = await executeWriterPhase(state);

    logger.info("Orchestrator", "Writer Node completed successfully!");

    // ---------------------------------------------------------------------
    // 5. Reviewer Phase
    // ---------------------------------------------------------------------

    state = await executeReviewerPhase(state);

    logger.info("Orchestrator", "Reviewer Node completed successfully!");

    // ---------------------------------------------------------------------
    // 6. SEO Phase
    // ---------------------------------------------------------------------

    state = await executeSEOPhase(state);

    logger.info("Orchestrator", "SEO Node completed successfully!");

    // ---------------------------------------------------------------------
    // 7. Exporter Phase
    // ---------------------------------------------------------------------

    state = await executeExporterPhase(state);

    logger.info("Orchestrator", "Exporter Node completed successfully!");

    // ---------------------------------------------------------------------
    // Pipeline Completed
    // ---------------------------------------------------------------------

    console.log("\n========================================");
    console.log(" AI ARTICLE PIPELINE COMPLETED");
    console.log("========================================\n");

    console.log("Topic");
    console.log(state.topic);

    console.log("\nSEO Metadata");
    console.dir(state.seoData, {
      depth: null,
      colors: true,
    });

    console.log("\nGenerated Markdown File");
    console.log(state.finalMarkdownFile);

    console.log("\n========================================\n");
  } catch (error) {
    logger.error(
      "Orchestrator",
      "Pipeline execution halted due to a critical error.",
      error,
    );

    process.exit(1);
  }
}

// Kick off the system
runPipeline();
