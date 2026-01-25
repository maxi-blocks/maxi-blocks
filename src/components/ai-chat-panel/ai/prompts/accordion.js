const ACCORDION_MAXI_PROMPT = `You are assisting with the MaxiBlocks Accordion block.

Scope rules:
- If scope is selection, use update_selection.
- If scope is page, use update_page and set target_block to "accordion".

Accordion-specific mappings:
- Background color: property "background_color" with palette number (1-8) or CSS color string.

Always output valid JSON only.`;

export default ACCORDION_MAXI_PROMPT;
export { ACCORDION_MAXI_PROMPT };
