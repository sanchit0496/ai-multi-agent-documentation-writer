import { logger } from "../utils/logger.js";

/**
 * Evaluates the overall quality of the article and determines
 * whether it should proceed to the SEO phase or return to the
 * Writer for another refinement cycle.
 *
 * @param {object} review - Subjective scores from the Reviewer Agent.
 * @param {object} metrics - Objective metrics from the Metrics Service.
 * @returns {object} Supervisor decision.
 */
export const evaluateArticle = (review, metrics) => {
  logger.info("SupervisorService", "Evaluating article quality.");

  const overallScore = Math.round(
    (review.technical +
      review.clarity +
      review.completeness +
      metrics.seoScore +
      metrics.readabilityScore) /
      5,
  );
  const accepted = overallScore >= 85;
  const nextAgent = accepted ? "seo" : "writer";

  logger.info("SupervisorService", "Evaluation completed.", {
    overallScore,
    accepted,
    nextAgent,
  });

  return { overallScore, accepted, nextAgent };
};
