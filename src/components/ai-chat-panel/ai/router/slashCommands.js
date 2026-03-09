/**
 * Slash-command helpers for the AI chat routing pipeline.
 *
 * Thin wrappers around the lower-level parser in ai/commands/slashParser.js
 * so that callers only need to import from ai/router/.
 */

export { parseSlashCommand } from '../commands/slashParser';

/**
 * Returns true when the raw input starts with a forward-slash,
 * indicating an explicit slash command rather than natural language.
 *
 * @param {string} input Raw user input.
 * @returns {boolean}
 */
export const isSlashCommand = input =>
	typeof input === 'string' && input.trimStart().startsWith( '/' );
