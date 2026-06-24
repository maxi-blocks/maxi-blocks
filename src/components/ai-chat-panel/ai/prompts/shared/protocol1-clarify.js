/**
 * Protocol 1: Clarify Trigger — shared across all block prompts.
 * The vague-example phrase varies per block; pass it as an argument.
 *
 * @param {string} vagueExamples - Comma-separated quoted examples of vague requests for this block.
 *   Defaults to the most common phrasing used by simple blocks.
 * @returns {string} Protocol 1 section string
 */
export const clarifyProtocol = (vagueExamples = '"make it nicer", "add a background"') =>
	`### PROTOCOL 1: CLARIFY TRIGGER (3-button rule)
If the request is vague or underspecified (for example: ${vagueExamples}), do not apply changes.
Return action "CLARIFY" with exactly 3 options. Each option must include:
- label
- desc
- payload
Exception: For spacing/margin/padding clarifications, include a 4th option "Remove".`;
