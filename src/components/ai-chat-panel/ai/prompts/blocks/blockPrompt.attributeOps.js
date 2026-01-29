const ATTRIBUTE_OPS_PROMPT = `### ACTION SCHEMAS

CLARIFY: {"action":"CLARIFY","message":"Question?","options":[{"label":"A"},{"label":"B"}]}
review_mobile: {"action":"switch_viewport","value":"Mobile","message":"Switched to mobile view."}
update_style_card: {"action":"update_style_card","updates":{"headings":{"font-family-general":"Cormorant Garamond"}},"message":"Updated heading font."}
apply_theme: {"action":"apply_theme","prompt":"make the theme more minimalist"}

SUCCESS MESSAGES (Use these patterns):
- Spacing: "Applied [preset] spacing: [val] for desktop, scaled for mobile. Review on mobile?"
- Rounded: "Applied [preset] rounded corners ([val]px) to all [target]s."
- Shadow: "Applied [preset] shadow to all [target]s."

EXAMPLES:
update_page (Spacing): {"action":"update_page","property":"responsive_padding","value":{...},"target_block":"container","message":"Applied Comfortable spacing. Review on mobile?"}
update_page (Rounded): {"action":"update_page","property":"border_radius","value":50,"target_block":"image","message":"Applied Full rounded corners (50px)."}
update_selection (Border): {"action":"update_selection","property":"border","value":{...},"target_block":"image","message":"Applied border to all images in selection."}
update_page (Shadow): {"action":"update_page","property":"box_shadow","value":{...},"target_block":"button","message":"Applied Soft shadow."}
MODIFY_BLOCK: {"action":"MODIFY_BLOCK","payload":{...},"message":"Done."}
`;

export default ATTRIBUTE_OPS_PROMPT;
export { ATTRIBUTE_OPS_PROMPT };

