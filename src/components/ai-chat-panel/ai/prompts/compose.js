/**
 * Composes a prompt string from multiple sections by joining them with double newlines.
 * Falsy sections (null, undefined, empty string, false) are filtered out.
 *
 * @param {...string} sections - Prompt sections to join
 * @returns {string} Composed prompt string
 */
export const composePrompt = (...sections) => sections.filter(Boolean).join('\n\n');
