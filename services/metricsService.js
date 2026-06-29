/**
 * Calculates objective quality metrics for the generated article.
 * This service intentionally avoids AI and relies only on deterministic
 * calculations so that every score is reproducible.
 *
 * Future improvements:
 * - Replace regex with remark / markdown-it
 * - Use readability libraries
 * - Add keyword density analysis
 * - Validate heading hierarchy
 * - Analyze code blocks and links
 */

/**
 * Calculates article metrics.
 *
 * @param {string} article - Markdown article.
 * @returns {object} Calculated metrics.
 */
export const calculateMetrics = (article) => {
  const wordCount = calculateWordCount(article);

  const headingCount = calculateHeadingCount(article);

  const paragraphCount = calculateParagraphCount(article);

  const readingTime = calculateReadingTime(wordCount);

  const readabilityScore = calculateReadabilityScore(wordCount);

  const seoScore = calculateSEOScore(wordCount, headingCount);

  const formattingScore = calculateFormattingScore(
    headingCount,
    paragraphCount,
  );

  return {
    wordCount,

    headingCount,

    paragraphCount,

    readingTime,

    readabilityScore,

    seoScore,

    formattingScore,
  };
};

/**
 * Counts total words.
 */
const calculateWordCount = (article) => {
  return article.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * Counts Markdown headings.
 */
const calculateHeadingCount = (article) => {
  return (article.match(/^#{1,6}\s/gm) || []).length;
};

/**
 * Counts paragraphs.
 */
const calculateParagraphCount = (article) => {
  return article
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0).length;
};

/**
 * Calculates estimated reading time.
 */
const calculateReadingTime = (wordCount) => {
  return Math.max(1, Math.ceil(wordCount / 200));
};

/**
 * Calculates a basic readability score.
 *
 * NOTE:
 * Placeholder implementation.
 * Can later be replaced with a readability library.
 */
const calculateReadabilityScore = (wordCount) => {
  if (wordCount >= 1800 && wordCount <= 3000) {
    return 100;
  }

  if (wordCount >= 1200) {
    return 90;
  }

  if (wordCount >= 800) {
    return 80;
  }

  return 60;
};

/**
 * Calculates a basic SEO score.
 *
 * NOTE:
 * Placeholder implementation.
 * Can later be replaced with proper SEO analysis.
 */
const calculateSEOScore = (wordCount, headingCount) => {
  let score = 100;

  if (wordCount < 1200) {
    score -= 20;
  }

  if (headingCount < 5) {
    score -= 15;
  }

  return Math.max(score, 0);
};

/**
 * Calculates a formatting score.
 *
 * NOTE:
 * Placeholder implementation.
 */
const calculateFormattingScore = (headingCount, paragraphCount) => {
  let score = 100;

  if (headingCount < 5) {
    score -= 20;
  }

  if (paragraphCount < 10) {
    score -= 20;
  }

  return Math.max(score, 0);
};
