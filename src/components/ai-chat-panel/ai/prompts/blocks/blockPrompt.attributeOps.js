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
MODIFY_BLOCK — use this to create/insert Maxi blocks into the page.

### MAXI BLOCK TYPES
- maxi-blocks/container-maxi  → page section / wrapper (outermost block)
- maxi-blocks/row-maxi        → horizontal row INSIDE a container (only valid child of container)
- maxi-blocks/column-maxi     → column INSIDE a row (only valid child of row)
- maxi-blocks/text-maxi       → heading or paragraph text
- maxi-blocks/button-maxi     → call-to-action button (supports built-in icons via attributes — see below)
- maxi-blocks/image-maxi      → image
- maxi-blocks/svg-icon-maxi   → STANDALONE decorative icon (NOT for buttons with icons — use button-maxi instead)
- maxi-blocks/video-maxi      → video embed
- maxi-blocks/divider-maxi    → horizontal divider line
- maxi-blocks/number-counter-maxi → animated number counter
- maxi-blocks/map-maxi        → Google map
- maxi-blocks/search-maxi     → search bar
- maxi-blocks/slider-maxi     → image/content slider
- maxi-blocks/accordion-maxi  → accordion / FAQ

### BUTTON vs ICON — CHOOSE BY INTENT
- User says "add a button with an icon" / "social button" / "icon button" / "CTA with icon":
  → Use maxi-blocks/button-maxi with icon attributes set inline. Do NOT add a separate svg-icon-maxi.
- User says "add an icon" / "add icon modules" / "add social icons" (no mention of buttons):
  → Use maxi-blocks/svg-icon-maxi.

Button icon attributes (set in the button's "attributes" when creating via MODIFY_BLOCK):
  "button_icon_add": "facebook"   ← icon slug (e.g. facebook, instagram, x, arrow-right, check)
  "button_icon": "only"           ← hide label, show icon only
  "icon_position": "left"|"right" ← icon placement relative to label

Example — social button with icon built in:
{"name":"maxi-blocks/button-maxi","attributes":{"button_text":"Facebook","button_icon_add":"facebook","button_icon":"only"},"innerBlocks":[]}

### BLOCK HIERARCHY (CRITICAL)
container-maxi
  └── row-maxi          (must be direct child of container)
        └── column-maxi (must be direct child of row)
              └── (content blocks: text-maxi, button-maxi, image-maxi, etc.)

You CANNOT put content blocks directly in a container or row.
You CANNOT put a row inside a column.
A container always needs at least one row; a row always needs at least one column.

### MODIFY_BLOCK PAYLOAD SHAPES

Shape 1 — Insert a new top-level block (no parent):
{"action":"MODIFY_BLOCK","payload":{"block":{"name":"maxi-blocks/container-maxi","attributes":{},"innerBlocks":[{"name":"maxi-blocks/row-maxi","attributes":{},"innerBlocks":[{"name":"maxi-blocks/column-maxi","attributes":{},"innerBlocks":[]}]}]}},"message":"Added a container."}

Shape 2 — Append one or more blocks to specific parents (use clientId from context):
{"action":"MODIFY_BLOCK","payload":{"ops":[{"op":"append_child","parent_clientId":"<row-clientId>","block":{"name":"maxi-blocks/column-maxi","attributes":{},"innerBlocks":[]}},{"op":"append_child","parent_clientId":"<column-clientId>","block":{"name":"maxi-blocks/text-maxi","attributes":{},"innerBlocks":[]}}]},"message":"Added a column with text."}

Shape 3 — Update inner blocks of a specific block (replaces all children):
{"action":"MODIFY_BLOCK","payload":{"update_inner_blocks":[{"op":"append_child","parent_clientId":"<clientId>","block":{"name":"maxi-blocks/button-maxi","attributes":{},"innerBlocks":[]}}]},"message":"Added a button."}

### WHEN TO USE MODIFY_BLOCK
- User asks to "add", "create", "insert", "build", or "generate" any block
- User asks to add content to an existing block (use parent_clientId from context)
- Always follow the hierarchy: if adding a text block, the parent must be a column-maxi
`;

export default ATTRIBUTE_OPS_PROMPT;
export { ATTRIBUTE_OPS_PROMPT };

