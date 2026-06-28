/**
 * Simple structured logger.
 * Future improvement: Swap this out for Pino or Winston when deploying to a cloud environment.
 */
export const logger = {
  /**
   * Logs informational messages with an agent context.
   * @param {string} agent - The name of the executing agent.
   * @param {string} message - The message to log.
   * @param {object} [meta] - Additional metadata (e.g., token usage, execution time).
   */
  info: (agent, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [${agent}] ${message}`, Object.keys(meta).length ? meta : '');
  },

  error: (agent, message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${agent}] ${message}`);
    if (error) console.error(error);
  }
};