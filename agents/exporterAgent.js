import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Pure function to execute the article export phase.
 * Persists the final article and SEO metadata to the local filesystem.
 *
 * @param {object} state - The immutable global pipeline state object.
 * @param {string} state.topic - The core subject matter.
 * @param {string} state.finalDraft - The reviewed article.
 * @param {object} state.seoData - Generated SEO metadata.
 * @returns {Promise<object>} - A new state object containing the populated `finalMarkdownFile` property.
 */
export const executeExporterPhase = async (state) => {

  logger.info(
    'ExporterPhase',
    'Starting article export.'
  );

  if (!state.finalDraft) {
    throw new Error(
      'ExporterPhase Error: Missing required upstream data "state.finalDraft"'
    );
  }

  if (!state.seoData) {
    throw new Error(
      'ExporterPhase Error: Missing required upstream data "state.seoData"'
    );
  }

  try {

    const outputDirectory = path.resolve('./articles');

    await fs.mkdir(outputDirectory, {
      recursive: true
    });

    const fileName =
      state.seoData.slug ||
      state.topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const markdownFilePath =
      path.join(outputDirectory, `${fileName}.md`);

    const seoFilePath =
      path.join(outputDirectory, `${fileName}.seo.json`);

    const markdownContent = `# ${state.seoData.seoTitle}

${state.finalDraft}
`;

    await fs.writeFile(
      markdownFilePath,
      markdownContent,
      'utf8'
    );

    await fs.writeFile(
      seoFilePath,
      JSON.stringify(state.seoData, null, 2),
      'utf8'
    );

    logger.info(
      'ExporterPhase',
      'Article exported successfully.',
      {
        markdownFile: markdownFilePath,
        seoFile: seoFilePath
      }
    );

    return {

      ...state,

      finalMarkdownFile: markdownFilePath

    };

  } catch (error) {

    logger.error(
      'ExporterPhase',
      'Failed to export article.',
      error
    );

    throw new Error(
      `ExporterPhase Critical Failure: ${error.message}`
    );

  }

};
