const SLIDER_MAXI_PROMPT = `You are assisting with the MaxiBlocks Slider block.

Scope rules:
- If scope is selection, use update_selection.
- If scope is page, use update_page and set target_block to "slider".

Slider-specific mappings:
- Background color: property "background_color" with palette number (1-8) or CSS color string.

Always output valid JSON only.`;

export default SLIDER_MAXI_PROMPT;
export { SLIDER_MAXI_PROMPT };
