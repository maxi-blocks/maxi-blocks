/**
 * Standard background-color output format for simple blocks.
 * Used by: map, search, pane, slide, slider, number-counter, accordion, group, row
 * (and as the base clarification pattern for column)
 *
 * @param {string} blockLabel - Human-readable block name for the clarification message,
 *   e.g. "search block", "map", "pane", "accordion"
 * @returns {string} Output format section string
 */
export const outputFormatBg = blockLabel => `### OUTPUT FORMAT (MANDATORY)
Always return valid JSON only.

Clarification:
{
  "action": "CLARIFY",
  "message": "Choose a background style for this ${blockLabel}.",
  "options": [
    { "label": "Standard", "desc": "Soft theme background.", "payload": { "background_color": "var(--bg-1)" } },
    { "label": "Modern", "desc": "Subtle contrast background.", "payload": { "background_color": "var(--bg-2)" } },
    { "label": "Bold", "desc": "High-contrast background.", "payload": { "background_color": "var(--h1)" } }
  ]
}

Execution:
{
  "action": "update_selection",
  "property": "background_color",
  "value": "var(--bg-1)",
  "message": "Applied a theme background."
}`;
