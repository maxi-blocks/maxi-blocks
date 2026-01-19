/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { dispatch, useDispatch, useSelect, useRegistry } from '@wordpress/data';
import { cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import './editor.scss';
import applyThemeToStyleCards from '@extensions/style-cards/applyThemeToStyleCards';
import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import { handleSetAttributes } from '@extensions/maxi-block';
import { getSkillContextForBlock, getAllSkillsContext } from './skillContext';
import { findBestPattern, extractPatternQuery } from './patternSearch';
import onRequestInsertPattern from '../../editor/library/utils/onRequestInsertPattern';

const SYSTEM_PROMPT = `CRITICAL RULE: You MUST respond ONLY with valid JSON. NEVER respond with plain text.

### SCOPE RULES
- USER INTENT SCOPE "SELECTION": Use update_selection for selected block and its contents.
- USER INTENT SCOPE "PAGE": Use update_page for all matching blocks on page.
- USER INTENT SCOPE "GLOBAL": Use apply_theme for Style Card changes.

### BLOCK TARGETING
Include "target_block" when user mentions specific types:
- "all images" / "the images" → target_block: "image"
- "all buttons" → target_block: "button"
- "all sections" / "containers" → target_block: "container"

### INTENT MAPPING
1. "Round/Rounded/Corners" → property: border_radius
2. "Shadow/Depth/Pop" → property: box_shadow
3. "Space/Breathing Room/Padding" → property: responsive_padding
4. "More space/Less cramped" → property: responsive_padding

### RESPONSIVE SPACING PROTOCOL (CRITICAL)
When changing padding/margin/spacing, NEVER apply a single large value. Always use responsive_padding with auto-scaled values for all devices.

**Spacing presets:**
{"action":"CLARIFY","message":"How much spacing would you like?","options":[{"label":"Compact"},{"label":"Comfortable"},{"label":"Spacious"}]}

**Preset values:**
- Compact: {"desktop":"60px","tablet":"40px","mobile":"20px"}
- Comfortable: {"desktop":"100px","tablet":"60px","mobile":"40px"}
- Spacious: {"desktop":"140px","tablet":"80px","mobile":"60px"}

**After applying spacing, confirm:**
"I've applied [preset] spacing: [desktop]px for large screens, auto-scaled to [mobile]px for mobile."

"I've applied [preset] spacing: [desktop]px for large screens, auto-scaled to [mobile]px for mobile. Would you like to review how it looks on mobile?"
{ "action": "CLARIFY", "message": "Switch to mobile view?", "options": [{"label": "Yes, show me"}, {"label": "No, thanks"}] }

### CLARIFICATION EXAMPLES (COPY EXACTLY)

When user says "add shadow" or "give shadow":
{"action":"CLARIFY","message":"What style of shadow would you like?","options":[{"label":"Soft"},{"label":"Crisp"},{"label":"Bold"}]}

When user says "make rounded" or "round corners":
{"action":"CLARIFY","message":"How rounded should the corners be?","options":[{"label":"Subtle (8px)"},{"label":"Soft (24px)"},{"label":"Full (50px)"}]}

When user says "add space" or "more padding":
{"action":"CLARIFY","message":"How much vertical spacing would you like?","options":[{"label":"Compact"},{"label":"Comfortable"},{"label":"Spacious"}]}

When user says "style buttons":
{"action":"CLARIFY","message":"What button style would you like?","options":[{"label":"Solid"},{"label":"Outline"},{"label":"Flat"}]}

### THEME-AWARE RULES (CRITICAL)
- **Theme Border:** use "var(--p)" (Subtle), "var(--h1)" (Strong), "var(--highlight)" (Brand).
- **Brand Glow:** Use "box_shadow" with color "var(--highlight)".
- **Ghost Button:** use "button_style" value "outline".
- **Invert Section:** Set background "var(--h1)", color "white".

### SVG ICON COLORS (STYLE CARD PALETTE)
When user asks to change icon color, fill, stroke, or border:
- "change icon color" / "fill color" → property: svg_fill_color, value: palette number (1-8)
- "change icon stroke" / "line color" / "icon border" → property: svg_line_color, value: palette number (1-8)
- "change icon line width" / "stroke width" → property: svg_stroke_width, value: 1-4
- Default: Use palette number based on request (1=Primary, 2=Secondary, 3=Accent, 4=Highlight, 5=Text, 8=Dark)
- If user says "brand color" → use palette 4 (highlight)
- If user says "match headings" → use palette 2
- For icon color requests, the client will show a palette picker - no need to clarify.
 
### OPTION TRIGGER MAPPING (CRITICAL)
IF user selects/types these options, YOU MUST use the corresponding property:
 
- "Compact" / "Comfortable" / "Spacious" -> ACTION: update_page, PROPERTY: responsive_padding
- "Subtle (8px)" / "Soft (24px)" / "Full (50px)" -> ACTION: update_page, PROPERTY: border_radius
- "Soft" / "Crisp" / "Bold" / "Brand Glow" -> ACTION: update_page, PROPERTY: box_shadow
- "Subtle Border" / "Strong Border" / "Brand Border" -> ACTION: update_page, PROPERTY: border
- "Thin" / "Medium" / "Thick" (line width) -> ACTION: update_page, PROPERTY: svg_stroke_width
- "Solid" / "Outline" / "Flat" -> ACTION: update_selection, PROPERTY: button_style


### WHEN TO APPLY DIRECTLY
Only when user specifies EXACT style/preset name:
- "Soft shadow" → Apply directly
- "Comfortable spacing" → Apply responsive_padding directly
- "Subtle corners" → Apply directly
- "Outline button" → Apply directly

### CRITICAL: NEVER ASSUME DEFAULTS
If user says "add shadow" (generic), DO NOT apply Soft shadow. ASK FIRST.
If user says "make rounded" (generic), DO NOT apply Subtle. ASK FIRST.
You MUST show the buttons for generic requests.

### VALUES
Shadow Soft: {"x":0,"y":10,"blur":30,"spread":0}
Shadow Crisp: {"x":0,"y":2,"blur":4,"spread":0}
Shadow Bold: {"x":0,"y":20,"blur":25,"spread":-5}
Rounded Subtle: 8, Soft: 24, Full: 50

### ACTION SCHEMAS

CLARIFY: {"action":"CLARIFY","message":"Question?","options":[{"label":"A"},{"label":"B"}]}
review_mobile: {"action":"switch_viewport","value":"Mobile","message":"Switched to mobile view."}

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

REMEMBER: ONLY OUTPUT JSON. NO PLAIN TEXT EVER.
`;

/**
 * ============================================================================
 * LAYOUT PATTERNS LOOKUP TABLE
 * ============================================================================
 * 
 * Pattern-based layout intent detection for zero-latency responses.
 * Each pattern maps natural language to CSS flexbox/layout properties.
 * 
 * Structure:
 * - regex: Pattern to match against lowercase user message  
 * - property: CSS property key for applyUpdatesToBlocks
 * - value: CSS value (can be object for compound values like stacking)
 * - selectionMsg: Message for Selection scope
 * - pageMsg: Message for Page scope
 * - target: Optional target_block filter (defaults to 'container')
 */
const LAYOUT_PATTERNS = [
	// GROUP 1: DIRECTIONAL INTENT (flex-direction)
	{ regex: /side\s*by\s*side|horizontal(?!ly)|in\s*a\s*line|beside\s*(each\s*other)?|next\s*to\s*(each\s*other)?/, property: 'flex_direction', value: 'row', selectionMsg: 'Arranged items side by side (row layout).', pageMsg: 'Arranged containers horizontally.' },
	{ regex: /stack(ed)?|vertical(?!ly)|one\s*on\s*top|underneath|on\s*top\s*of|column\s*layout/, property: 'flex_direction', value: 'column', selectionMsg: 'Stacked items vertically (column layout).', pageMsg: 'Arranged containers in a stack.' },
	{ regex: /backwards?|right\s*to\s*left|reverse.*horizontal|flip.*order/, property: 'flex_direction', value: 'row-reverse', selectionMsg: 'Reversed horizontal order (row-reverse).', pageMsg: 'Reversed horizontal order.' },
	{ regex: /bottom\s*up|reverse.*vertical|reverse.*stack|upwards?\s*stack/, property: 'flex_direction', value: 'column-reverse', selectionMsg: 'Reversed vertical order (column-reverse).', pageMsg: 'Reversed vertical order.' },
	
	// GROUP 2: JUSTIFY CONTENT (main axis distribution)
	{ regex: /spread.*wall|space\s*between|first.*last.*edge|push.*apart|stretch.*apart/, property: 'justify_content', value: 'space-between', selectionMsg: 'Spread items to edges (space-between).', pageMsg: 'Applied space-between layout.' },
	{ regex: /breathing\s*room|balanced\s*spac|space\s*around|equal\s*margin/, property: 'justify_content', value: 'space-around', selectionMsg: 'Added balanced spacing (space-around).', pageMsg: 'Applied balanced spacing.' },
	{ regex: /equal\s*gap|evenly\s*spac|space\s*evenly|perfectly\s*even/, property: 'justify_content', value: 'space-evenly', selectionMsg: 'Applied even spacing (space-evenly).', pageMsg: 'Applied evenly distributed spacing.' },
	{ regex: /push.*start|bunch.*start|items?.*left(?!.*text)|align.*items?.*left/, property: 'justify_content', value: 'flex-start', selectionMsg: 'Pushed items to start (flex-start).', pageMsg: 'Aligned items to start.' },
	{ regex: /push.*end|bunch.*end|items?.*right(?!.*text)|align.*items?.*right/, property: 'justify_content', value: 'flex-end', selectionMsg: 'Pushed items to end (flex-end).', pageMsg: 'Aligned items to end.' },
	{ regex: /center.*items?|items?.*center(?!.*text)|centre.*items?|items?.*centre/, property: 'justify_content', value: 'center', selectionMsg: 'Centred items on main axis (justify-content: center).', pageMsg: 'Centred items horizontally.' },
	
	// GROUP 3: ALIGN ITEMS (cross-axis)
	{ regex: /top\s*align|ceiling|push.*top|align.*top(?!.*text)/, property: 'align_items_flex', value: 'flex-start', selectionMsg: 'Aligned items to top (align-items: flex-start).', pageMsg: 'Top-aligned items.' },
	{ regex: /bottom\s*align|floor|push.*bottom|align.*bottom(?!.*text)/, property: 'align_items_flex', value: 'flex-end', selectionMsg: 'Aligned items to bottom (align-items: flex-end).', pageMsg: 'Bottom-aligned items.' },
	{ regex: /middle\s*align|center.*vertically|centre.*vertically|vertical.*center|vertical.*centre/, property: 'align_items_flex', value: 'center', selectionMsg: 'Vertically centred items (align-items: center).', pageMsg: 'Vertically centred items.' },
	{ regex: /same\s*height|stretch|equal\s*height|fill.*height|full.*height/, property: 'align_items_flex', value: 'stretch', selectionMsg: 'Stretched items to same height (align-items: stretch).', pageMsg: 'Stretched items to equal height.' },
	{ regex: /baseline|line\s*up.*text|align.*first\s*word/, property: 'align_items_flex', value: 'baseline', selectionMsg: 'Aligned items by text baseline.', pageMsg: 'Baseline-aligned items.' },
	
	// GROUP 4: FLEX WRAP
	{ regex: /let.*wrap|allow.*wrap|multi-?line|next\s*line|new\s*line|overflow.*wrap/, property: 'flex_wrap', value: 'wrap', selectionMsg: 'Enabled wrapping to new lines (flex-wrap: wrap).', pageMsg: 'Enabled multi-line wrapping.' },
	{ regex: /one\s*line|single\s*line|no\s*wrap|don'?t\s*wrap|force.*together/, property: 'flex_wrap', value: 'nowrap', selectionMsg: 'Forced items to single line (flex-wrap: nowrap).', pageMsg: 'Disabled wrapping.' },
	{ regex: /wrap.*upward|wrap.*reverse|reverse.*wrap/, property: 'flex_wrap', value: 'wrap-reverse', selectionMsg: 'Enabled reverse wrapping (flex-wrap: wrap-reverse).', pageMsg: 'Enabled reverse wrapping.' },
	
	// GROUP 5: EXTENDED - DEAD CENTER & FLEX SIZING
	{ regex: /dead\s*cent(er|re)|perfect(ly)?\s*cent(er|re)(ed)?|absolute(ly)?\s*cent(er|re)/, property: 'dead_center', value: true, selectionMsg: 'Perfectly centred items (horizontally + vertically).', pageMsg: 'Dead-centred all containers.' },
	{ regex: /fill.*remaining|fill.*rest|take.*rest|expand.*fill|grow.*space|use.*remaining/, property: 'flex_grow', value: 1, selectionMsg: 'Set to fill remaining space (flex-grow: 1).', pageMsg: 'Set containers to fill remaining space.' },
	{ regex: /don'?t\s*shrink|no\s*shrink|keep.*fixed|fixed\s*size|prevent.*shrink/, property: 'flex_shrink', value: 0, selectionMsg: 'Prevented shrinking (flex-shrink: 0).', pageMsg: 'Prevented containers from shrinking.' },
	
	// GROUP 6: STACKING & POSITION
	{ regex: /bring.*front|put.*top|on\s*top|overlap|layer.*top|above.*other/, property: 'stacking', value: { zIndex: 10, position: 'relative' }, selectionMsg: 'Brought to front (z-index: 10).', pageMsg: 'Brought containers to front.' },
	{ regex: /send.*back|put.*behind|behind.*everything|layer.*back|below.*other/, property: 'stacking', value: { zIndex: -1, position: 'relative' }, selectionMsg: 'Sent to back (z-index: -1).', pageMsg: 'Sent containers to back.' },
	{ regex: /make.*sticky|sticky|follow.*scroll|stay.*scroll|stick.*top/, property: 'position', value: 'sticky', selectionMsg: 'Made sticky (follows scroll).', pageMsg: 'Made containers sticky.' },
	{ regex: /float.*corner|fixed\s*position|stay.*corner|pin.*corner|always\s*visible/, property: 'position', value: 'fixed', selectionMsg: 'Fixed to viewport (always visible).', pageMsg: 'Fixed containers to viewport.' },
	
	// GROUP 7: VISIBILITY
	{ regex: /hide\s*(this|it)?(?!.*mobile)|make.*invisible|disappear|display.*none|remove.*view/, property: 'display', value: 'none', selectionMsg: 'Hidden from view (display: none).', pageMsg: 'Hidden containers.' },
	{ regex: /show\s*(this|it)?(?!.*mobile)|make.*visible|appear|unhide|display.*block/, property: 'display', value: 'flex', selectionMsg: 'Made visible (display: flex).', pageMsg: 'Made containers visible.' },
	
	// GROUP 8: GAP CONTROL (special handling - remove only, add has clarification)
	{ regex: /remove\s*gap|no\s*gap|zero\s*gap|remove\s*gutter/, property: 'gap', value: 0, selectionMsg: 'Removed gaps between items.', pageMsg: 'Removed gaps from containers.' },
	
	// GROUP 9: OPACITY & TRANSPARENCY
	{ regex: /see.*through|transparent|ghostly|translucent|opacity.*half|semi.*transparent/, property: 'opacity', value: 0.5, selectionMsg: 'Made semi-transparent (opacity: 0.5).', pageMsg: 'Made containers semi-transparent.' },
	{ regex: /fade.*out.*complete|fully.*transparent|invisible|opacity.*zero|completely.*transparent/, property: 'opacity', value: 0, selectionMsg: 'Made fully transparent (opacity: 0).', pageMsg: 'Made containers invisible.' },
	{ regex: /fully.*opaque|solid|not.*transparent|opacity.*full|remove.*transparency/, property: 'opacity', value: 1, selectionMsg: 'Made fully opaque (opacity: 1).', pageMsg: 'Restored full opacity.' },
	
	// GROUP 10: TRANSFORM EFFECTS
	{ regex: /tilt|askew|skew|slant/, property: 'transform_rotate', value: 5, selectionMsg: 'Tilted element (rotate: 5deg).', pageMsg: 'Tilted containers.' },
	{ regex: /rotate|spin|turn.*degrees/, property: 'transform_rotate', value: 45, selectionMsg: 'Rotated element (45deg).', pageMsg: 'Rotated containers.' },
	{ regex: /flip.*horizontal|mirror/, property: 'transform_scale', value: { x: -1, y: 1 }, selectionMsg: 'Flipped horizontally.', pageMsg: 'Flipped containers horizontally.' },
	{ regex: /flip.*vertical|upside.*down/, property: 'transform_scale', value: { x: 1, y: -1 }, selectionMsg: 'Flipped vertically.', pageMsg: 'Flipped containers vertically.' },
	{ regex: /zoom.*hover|bigger.*hover|enlarge.*hover|scale.*hover|grow.*hover/, property: 'transform_scale_hover', value: 1.1, selectionMsg: 'Added zoom on hover (scale: 1.1).', pageMsg: 'Added hover zoom effect.' },
	
	// GROUP 11: SCROLL EFFECTS
	{ regex: /fade.*scroll|scroll.*fade|entrance.*fade|fade.*in.*scroll/, property: 'scroll_fade', value: true, selectionMsg: 'Added scroll fade-in effect.', pageMsg: 'Added scroll fade to containers.' },
	{ regex: /parallax|slow.*background|background.*slower/, property: 'parallax', value: true, selectionMsg: 'Added parallax effect.', pageMsg: 'Added parallax to backgrounds.' },
	
	// GROUP 12: AESTHETIC STYLES (triggers apply_theme via special handling)
	{ regex: /minimalis(m|t)|clean.*look|simple.*design|white.*space/, property: 'aesthetic', value: 'minimalism', selectionMsg: 'Applied minimalist style.', pageMsg: 'Applied minimalist aesthetic.' },
	{ regex: /brutalis(m|t)|raw.*html|harsh|industrial/, property: 'aesthetic', value: 'brutalism', selectionMsg: 'Applied brutalist style.', pageMsg: 'Applied brutalist aesthetic.' },
	{ regex: /neobrutalis(m|t)|thick.*border.*pastel|block.*shadow|modern.*figma/, property: 'aesthetic', value: 'neobrutalism', selectionMsg: 'Applied neobrutalist style.', pageMsg: 'Applied neobrutalist aesthetic.' },
	{ regex: /swiss|helvetica|grid.*layout|typograph/, property: 'aesthetic', value: 'swiss', selectionMsg: 'Applied Swiss style.', pageMsg: 'Applied Swiss typography aesthetic.' },
	{ regex: /editorial|magazine|newspaper|pull.*quote/, property: 'aesthetic', value: 'editorial', selectionMsg: 'Applied editorial style.', pageMsg: 'Applied editorial layout.' },
	{ regex: /masculine|bold.*dark|strong.*geometric/, property: 'aesthetic', value: 'masculine', selectionMsg: 'Applied masculine style.', pageMsg: 'Applied masculine aesthetic.' },
	{ regex: /feminine|soft.*pastel|delicate|script.*font/, property: 'aesthetic', value: 'feminine', selectionMsg: 'Applied feminine style.', pageMsg: 'Applied feminine aesthetic.' },
	{ regex: /corporate|professional|business|navy.*slate/, property: 'aesthetic', value: 'corporate', selectionMsg: 'Applied corporate style.', pageMsg: 'Applied corporate aesthetic.' },
	{ regex: /natural|organic|earth.*tone|terracotta|sage/, property: 'aesthetic', value: 'natural', selectionMsg: 'Applied natural style.', pageMsg: 'Applied natural/organic aesthetic.' },
	
	// GROUP 13: TYPOGRAPHY READABILITY
	{ regex: /lines.*crash|wall.*text|too.*close.*lines|line.*height|more.*space.*lines/, property: 'line_height', value: 1.8, selectionMsg: 'Increased line spacing (line-height: 1.8).', pageMsg: 'Improved line spacing for readability.' },
	{ regex: /tight.*lines|condense.*lines|less.*space.*lines/, property: 'line_height', value: 1.2, selectionMsg: 'Tightened line spacing (line-height: 1.2).', pageMsg: 'Reduced line spacing.' },
	{ regex: /letters.*squish|too.*tight.*letter|letter.*spac|track/, property: 'letter_spacing', value: 1, selectionMsg: 'Increased letter spacing.', pageMsg: 'Added letter spacing.' },
	{ regex: /chunk|heavy|bold|thicker.*text|fatter.*text|font.*weight/, property: 'font_weight', value: 700, selectionMsg: 'Made text bolder (font-weight: 700).', pageMsg: 'Applied bold weight.' },
	{ regex: /thin.*text|light.*weight|lighter.*text/, property: 'font_weight', value: 300, selectionMsg: 'Made text lighter (font-weight: 300).', pageMsg: 'Applied light weight.' },
	{ regex: /remove.*underline|no.*underline|plain.*link/, property: 'text_decoration', value: 'none', selectionMsg: 'Removed underline.', pageMsg: 'Removed underlines from links.' },
	{ regex: /add.*underline|underline.*text/, property: 'text_decoration', value: 'underline', selectionMsg: 'Added underline.', pageMsg: 'Underlined text.' },
	
	// GROUP: COLOUR CLARIFICATION (show palette picker)
	// Match colour requests that need clarification - will show 8-colour palette
	{ regex: /(make|change|set|turn|paint|color|colour|give).*(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)|(\bred|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey)\b.*(background|button|text|heading|container|box|section|color|colour)/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?' },
	
	// GROUP 14: BACKGROUNDS & MEDIA
	{ regex: /video.*behind|movie.*behind|background.*video/, property: 'background_media', value: 'video', selectionMsg: 'Set video as background.', pageMsg: 'Applied video background.' },
	{ regex: /darken.*screen|overlay|dim.*background|dark.*overlay/, property: 'background_overlay', value: 0.5, selectionMsg: 'Added dark overlay (50%).', pageMsg: 'Darkened background with overlay.' },
	{ regex: /zoom.*photo|fill.*container|cover.*image|fit.*cover/, property: 'object_fit', value: 'cover', selectionMsg: 'Set image to cover container.', pageMsg: 'Applied cover fit to images.' },
	{ regex: /contain.*image|show.*whole|fit.*contain/, property: 'object_fit', value: 'contain', selectionMsg: 'Set image to contain.', pageMsg: 'Applied contain fit to images.' },
	{ regex: /pattern.*texture|tile.*background|repeat.*background|honeycomb/, property: 'background_tile', value: true, selectionMsg: 'Added tiled pattern.', pageMsg: 'Applied repeating pattern.' },
	
	// GROUP 15: SHAPES & DIVIDERS
	{ regex: /wavy.*edge|wave.*bottom|wave.*divider/, property: 'shape_divider', value: 'wave', selectionMsg: 'Added wave shape divider.', pageMsg: 'Applied wave divider.' },
	{ regex: /triangle.*edge|angle.*divider|slant.*edge/, property: 'shape_divider', value: 'triangle', selectionMsg: 'Added triangle shape divider.', pageMsg: 'Applied angled divider.' },
	{ regex: /cut.*triangle|triangle.*shape|clip.*triangle/, property: 'clip_path', value: 'polygon(50% 0%, 0% 100%, 100% 100%)', selectionMsg: 'Cut into triangle shape.', pageMsg: 'Applied triangle clip.' },
	{ regex: /cut.*circle|circle.*shape|round.*clip/, property: 'clip_path', value: 'circle(50%)', selectionMsg: 'Cut into circle shape.', pageMsg: 'Applied circle clip.' },
	{ regex: /cut.*diamond|diamond.*shape/, property: 'clip_path', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', selectionMsg: 'Cut into diamond shape.', pageMsg: 'Applied diamond clip.' },
	
	// GROUP 16: CONSTRAINTS & SIZING
	{ regex: /don'?t.*too.*wide|max.*width|limit.*width|constrain.*width/, property: 'max_width', value: 'fit-content', selectionMsg: 'Constrained max width.', pageMsg: 'Limited maximum width.' },
	{ regex: /full.*width|stretch.*wide|100.*width/, property: 'full_width', value: true, selectionMsg: 'Set to full width.', pageMsg: 'Made containers full width.' },
	{ regex: /minimum.*height|at.*least.*tall|min.*height/, property: 'min_height', value: 400, selectionMsg: 'Set minimum height.', pageMsg: 'Applied minimum height.' },
	
	// GROUP 17: ROW PATTERNS
	{ regex: /zig.*zag|alternate|stagger|every.*other/, property: 'row_pattern', value: 'alternating', selectionMsg: 'Applied alternating row pattern.', pageMsg: 'Created zig-zag layout.' },
	{ regex: /masonry|pinterest|grid.*flow/, property: 'row_pattern', value: 'masonry', selectionMsg: 'Applied masonry layout.', pageMsg: 'Created masonry grid.' },
	
	// GROUP 18: RELATIVE SIZING (±20% adjustment)
	{ regex: /bigger(?!.*hover)|larger|increase.*size|more.*size|scale.*up/, property: 'relative_size', value: 1.2, selectionMsg: 'Increased size by 20%.', pageMsg: 'Scaled up by 20%.' },
	{ regex: /smaller|reduce.*size|decrease.*size|less.*size|scale.*down/, property: 'relative_size', value: 0.8, selectionMsg: 'Decreased size by 20%.', pageMsg: 'Scaled down by 20%.' },
	{ regex: /bigger.*text|larger.*text|increase.*font|larger.*font/, property: 'font_size_relative', value: 1.2, selectionMsg: 'Increased font size by 20%.', pageMsg: 'Enlarged text.' },
	{ regex: /smaller.*text|reduce.*text|decrease.*font|tinier/, property: 'font_size_relative', value: 0.8, selectionMsg: 'Decreased font size by 20%.', pageMsg: 'Reduced text size.' },
	{ regex: /wider|more.*width|increase.*width|stretch.*horizontal/, property: 'width_relative', value: 1.2, selectionMsg: 'Increased width by 20%.', pageMsg: 'Made wider.' },
	{ regex: /narrower|less.*width|decrease.*width|thinner/, property: 'width_relative', value: 0.8, selectionMsg: 'Decreased width by 20%.', pageMsg: 'Made narrower.' },
	{ regex: /taller|more.*height|increase.*height|stretch.*vertical/, property: 'height_relative', value: 1.2, selectionMsg: 'Increased height by 20%.', pageMsg: 'Made taller.' },
	{ regex: /shorter|less.*height|decrease.*height|squash/, property: 'height_relative', value: 0.8, selectionMsg: 'Decreased height by 20%.', pageMsg: 'Made shorter.' },
	
	// GROUP 19: DIRECTIONAL MARGIN
	{ regex: /push.*down|more.*space.*above|margin.*top|space.*above/, property: 'margin_top', value: 40, selectionMsg: 'Added top margin (40px).', pageMsg: 'Added space above.' },
	{ regex: /push.*up|more.*space.*below|margin.*bottom|space.*below|space.*under/, property: 'margin_bottom', value: 40, selectionMsg: 'Added bottom margin (40px).', pageMsg: 'Added space below.' },
	{ regex: /push.*right|more.*space.*left|margin.*left|space.*left/, property: 'margin_left', value: 40, selectionMsg: 'Added left margin (40px).', pageMsg: 'Added space on left.' },
	{ regex: /push.*left|more.*space.*right|margin.*right|space.*right/, property: 'margin_right', value: 40, selectionMsg: 'Added right margin (40px).', pageMsg: 'Added space on right.' },
	
	// GROUP 20: DIRECTIONAL PADDING
	{ regex: /cushion.*top|pad.*top|padding.*top|inside.*top/, property: 'padding_top', value: 30, selectionMsg: 'Added top padding (30px).', pageMsg: 'Added internal space at top.' },
	{ regex: /cushion.*bottom|pad.*bottom|padding.*bottom|inside.*bottom/, property: 'padding_bottom', value: 30, selectionMsg: 'Added bottom padding (30px).', pageMsg: 'Added internal space at bottom.' },
	{ regex: /cushion.*left|pad.*left|padding.*left|inside.*left/, property: 'padding_left', value: 30, selectionMsg: 'Added left padding (30px).', pageMsg: 'Added internal space on left.' },
	{ regex: /cushion.*right|pad.*right|padding.*right|inside.*right/, property: 'padding_right', value: 30, selectionMsg: 'Added right padding (30px).', pageMsg: 'Added internal space on right.' },
	
	// GROUP 21: RESPONSIVE OVERRIDES
	{ regex: /hide.*mobile|mobile.*hide|don'?t.*show.*mobile|invisible.*mobile/, property: 'display_mobile', value: 'none', selectionMsg: 'Hidden on mobile devices.', pageMsg: 'Hidden on mobile.' },
	{ regex: /hide.*desktop|desktop.*hide|mobile.*only/, property: 'display_desktop', value: 'none', selectionMsg: 'Hidden on desktop (mobile only).', pageMsg: 'Showing only on mobile.' },
	{ regex: /hide.*tablet|tablet.*hide/, property: 'display_tablet', value: 'none', selectionMsg: 'Hidden on tablet.', pageMsg: 'Hidden on tablets.' },
	{ regex: /show.*mobile.*only|mobile.*version/, property: 'show_mobile_only', value: true, selectionMsg: 'Showing on mobile only.', pageMsg: 'Visible only on mobile.' },
	
	// GROUP 22: HOVER STATE PATTERNS
	{ regex: /change.*hover|hover.*change|when.*hover/, property: 'hover_effect', value: 'transform', selectionMsg: 'Added hover effect.', pageMsg: 'Applied hover transformation.' },
	{ regex: /lift.*hover|raise.*hover|elevate.*hover/, property: 'hover_lift', value: true, selectionMsg: 'Added lift on hover.', pageMsg: 'Elements lift on hover.' },
	{ regex: /glow.*hover|shine.*hover/, property: 'hover_glow', value: true, selectionMsg: 'Added glow on hover.', pageMsg: 'Elements glow on hover.' },
	{ regex: /darken.*hover|dim.*hover/, property: 'hover_darken', value: true, selectionMsg: 'Added darken on hover.', pageMsg: 'Elements darken on hover.' },
	{ regex: /lighten.*hover|brighten.*hover/, property: 'hover_lighten', value: true, selectionMsg: 'Added lighten on hover.', pageMsg: 'Elements brighten on hover.' },
	
	// GROUP 23: UNIVERSAL ALIGNMENT (text + items together)
	{ regex: /align.*everything.*left|everything.*left.*align|left.*align.*all|flush.*left/, property: 'align_everything', value: 'left', selectionMsg: 'Left-aligned all content.', pageMsg: 'Left-aligned everything.' },
	{ regex: /align.*everything.*center|everything.*center|center.*align.*all|centre.*everything/, property: 'align_everything', value: 'center', selectionMsg: 'Centred all content.', pageMsg: 'Centred everything.' },
	{ regex: /align.*everything.*right|everything.*right.*align|right.*align.*all|flush.*right/, property: 'align_everything', value: 'right', selectionMsg: 'Right-aligned all content.', pageMsg: 'Right-aligned everything.' },
	
	// GROUP 24: BUTTON ACTIONS
	{ regex: /outline.*button|ghost.*button|transparent.*button/, property: 'button_style', value: 'outline', selectionMsg: 'Applied outline style to buttons.', pageMsg: 'Changed all buttons to outline style.', target: 'button' },
	{ regex: /solid.*button|filled.*button|fill.*button/, property: 'button_style', value: 'solid', selectionMsg: 'Applied solid style to buttons.', pageMsg: 'Changed all buttons to solid style.', target: 'button' },
	{ regex: /flat.*button|no.*shadow.*button/, property: 'button_style', value: 'flat', selectionMsg: 'Applied flat style (no shadow) to buttons.', pageMsg: 'Removed shadows from buttons.', target: 'button' },
	{ regex: /pill.*button|capsule.*button|rounded.*button/, property: 'border_radius', value: 50, selectionMsg: 'Applied pill shape to buttons.', pageMsg: 'Changed buttons to pill shape.', target: 'button' },
	{ regex: /full.*width.*button|stretch.*button|expand.*button/, property: 'width', value: '100%', selectionMsg: 'Made buttons full width.', pageMsg: 'Expanded buttons to full width.', target: 'button' },
	{ regex: /auto.*width.*button|fit.*content.*button|shrink.*button/, property: 'width', value: 'auto', selectionMsg: 'Set buttons to auto width.', pageMsg: 'Set buttons to fit content.', target: 'button' },
	{ regex: /icon.*only.*button|remove.*text.*button|hide.*text.*button/, property: 'button_icon', value: 'only', selectionMsg: 'Made buttons icon-only.', pageMsg: 'Changed buttons to icon-only.', target: 'button' },
	{ regex: /remove.*icon.*button|no.*icon.*button|hide.*icon.*button|text.*only.*button/, property: 'button_icon', value: 'none', selectionMsg: 'Removed icons from buttons.', pageMsg: 'Removed icons from all buttons.', target: 'button' },
	{ regex: /small.*button|tiny.*button|compact.*button/, property: 'button_size', value: 'small', selectionMsg: 'Made buttons smaller.', pageMsg: 'Reduced button size.', target: 'button' },
	{ regex: /large.*button|big.*button|huge.*button|giant.*button/, property: 'button_size', value: 'large', selectionMsg: 'Made buttons larger.', pageMsg: 'Increased button size.', target: 'button' },

	// GROUP 25: CREATE BLOCK PATTERNS (from Cloud Library)
	// Must include pattern-related keywords to avoid matching style changes like "make button red"
	{ regex: /(create|make|add|insert|build|generate)\s+(a\s+|an\s+|me\s+a\s+)?(pricing|hero|testimonial|contact|feature|team|gallery|footer|header|nav|cta|about|services|portfolio|faq|blog|card|grid|section|template|pattern|layout)/i, property: 'create_block', value: 'cloud_library', pageMsg: 'Creating pattern from Cloud Library...' },
];

const AIChatPanel = ({ isOpen, onClose }) => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [scope, setScope] = useState('page'); // 'selection', 'page', 'global'
	const messagesEndRef = useRef(null);

	const selectedBlock = useSelect(
		select => select('core/block-editor').getSelectedBlock(),
		[]
	);

	const allBlocks = useSelect(
		select => select('core/block-editor').getBlocks(),
		[]
	);
	
	const registry = useRegistry();

	// Style Card Data
	const activeStyleCard = useSelect(
		select => select('maxiBlocks/style-cards')?.receiveMaxiSelectedStyleCard(),
		[]
	);
	const allStyleCards = useSelect(
		select => select('maxiBlocks/style-cards')?.receiveMaxiStyleCards(),
		[]
	);
	const { saveMaxiStyleCards, resetSC, setActiveStyleCard } = useDispatch('maxiBlocks/style-cards') || {};
	
	// Fetch Custom Colors
	const customColors = useSelect(select => {
		const {
			receiveSelectedStyleCardValue,
			receiveMaxiSelectedStyleCardValue,
		} = select('maxiBlocks/style-cards') || {};

		if (!receiveSelectedStyleCardValue) return [];

		// Try multiple strategies to get custom colors in order of preference
		// First check if we can get them directly from receiveSelectedStyleCardValue
		let colors = receiveSelectedStyleCardValue(
			'customColors',
			null,
			'color'
		);

		// If that fails, try the direct selector
		if (!colors || colors.length === 0) {
			colors = receiveMaxiSelectedStyleCardValue?.('customColors') || [];
		}

		// If still no colors, try to get the styleCard directly
		if (!colors || colors.length === 0) {
			const styleCard = select('maxiBlocks/style-cards')?.receiveMaxiSelectedStyleCard();

			if (styleCard && styleCard.value) {
				// Check multiple possible locations for custom colors
				colors =
					styleCard.value.light?.styleCard?.color?.customColors ||
					styleCard.value.dark?.styleCard?.color?.customColors ||
					styleCard.value.color?.customColors ||
					[];
			}
		}

		return colors || [];
	}, []);

	const { updateBlockAttributes } = useDispatch('core/block-editor');
	
	// Try to get undo from both possible stores (Post Editor or Site Editor)
	const { undo: undoPost } = useDispatch('core/editor') || {};
	const { undo: undoSite } = useDispatch('core/edit-site') || {};

	const handleUndo = () => {
		if (typeof undoPost === 'function') {
			undoPost();
		} else if (typeof undoSite === 'function') {
			undoSite();
		} else {
			console.warn('Maxi AI: Undo not available in this context.');
		}

		// Optimistically mark the last action as undone in UI
		setMessages(prev => {
			const newMessages = [...prev];
			// Find last executed assistant message
			for (let i = newMessages.length - 1; i >= 0; i--) {
				if (newMessages[i].role === 'assistant' && newMessages[i].executed && !newMessages[i].undone) {
					newMessages[i].undone = true;
					break;
				}
			}
			return newMessages;
		});
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Get Style Card palette colors for visual swatches
	// Uses CSS variables that are already set on the page (same approach as sidebar palette)
	const getPaletteColors = () => {
		return [1, 2, 3, 4, 5, 6, 7, 8].map(i => `rgba(var(--maxi-light-color-${i}), 1)`);
	};

	// --- Helper Functions ---

	const getBlockPrefix = (blockName) => {
		if (!blockName) return '';
		if (blockName.includes('button-maxi')) return 'button-';
		if (blockName.includes('image-maxi')) return 'image-';
		if (blockName.includes('icon-maxi')) return 'icon-';
		// Add other prefixed blocks here if needed
		return '';
	};

	const updateBackgroundColor = (clientId, color, currentAttributes) => {
		const newAttributes = {};
		newAttributes['background-color-general'] = color;
		newAttributes['background-palette-status-general'] = false;
		newAttributes['background-active-media-general'] = 'color';
		newAttributes['background-class-general'] = ''; // clear class based colors

		if (currentAttributes['background-layers'] && Array.isArray(currentAttributes['background-layers'])) {
			const layers = cloneDeep(currentAttributes['background-layers']);
			if (layers.length > 0) {
				layers[0].type = 'color';
				layers[0]['background-color-general'] = color;
				layers[0]['background-palette-status-general'] = false;
				layers[0]['display-general'] = 'block';
				newAttributes['background-layers'] = layers;
			}
		}
		return newAttributes;
	};

	const updateTextColor = (color) => ({
		'color-general': color,
		'palette-status-general': false,
	});

	const updatePadding = (value, side = null, prefix = '') => {
		const valStr = String(value);
		
		// If a specific side is provided, only update that side
		if (side && ['top', 'bottom', 'left', 'right'].includes(side.toLowerCase())) {
			const sideLower = side.toLowerCase();
			return {
				[`${prefix}padding-${sideLower}-general`]: valStr,
				[`${prefix}padding-${sideLower}-unit-general`]: 'px',
				[`${prefix}padding-sync-general`]: 'none', // Disable sync when setting individual sides
			};
		}
		
		// Otherwise, update all sides equally
		return {
			[`${prefix}padding-top-general`]: valStr,
			[`${prefix}padding-bottom-general`]: valStr,
			[`${prefix}padding-left-general`]: valStr,
			[`${prefix}padding-right-general`]: valStr,
			[`${prefix}padding-top-unit-general`]: 'px',
			[`${prefix}padding-bottom-unit-general`]: 'px',
			[`${prefix}padding-left-unit-general`]: 'px',
			[`${prefix}padding-right-unit-general`]: 'px',
			[`${prefix}padding-sync-general`]: 'all',
		};
	};

	const updateFontSize = (value) => ({
		'font-size-general': Number(value),
		'typography-unit-general': 'px',
	});

	// Margin - same pattern as padding
	// Margin - same pattern as padding
	const updateMargin = (value, side = null, prefix = '') => {
		const valStr = String(value);
		
		if (side && ['top', 'bottom', 'left', 'right'].includes(side.toLowerCase())) {
			const sideLower = side.toLowerCase();
			return {
				[`${prefix}margin-${sideLower}-general`]: valStr,
				[`${prefix}margin-${sideLower}-unit-general`]: 'px',
				[`${prefix}margin-sync-general`]: 'none',
			};
		}
		
		return {
			[`${prefix}margin-top-general`]: valStr,
			[`${prefix}margin-bottom-general`]: valStr,
			[`${prefix}margin-left-general`]: valStr,
			[`${prefix}margin-right-general`]: valStr,
			[`${prefix}margin-top-unit-general`]: 'px',
			[`${prefix}margin-bottom-unit-general`]: 'px',
			[`${prefix}margin-left-unit-general`]: 'px',
			[`${prefix}margin-right-unit-general`]: 'px',
			[`${prefix}margin-sync-general`]: 'all',
		};
	};



	// Border Radius
	// Border Radius
	// Border Radius
	const updateBorderRadius = (value, corner = null, prefix = '') => {
		// Fix: Allow 0 to be passed validly
		let finalValue = (value === undefined || value === null || value === '') ? 8 : Number(value);
		if (isNaN(finalValue)) finalValue = 8;

		const corners = {
			'top-left': 'border-top-left-radius',
			'top-right': 'border-top-right-radius',
			'bottom-left': 'border-bottom-left-radius',
			'bottom-right': 'border-bottom-right-radius',
		};
		
		let changes = {};
		if (corner && corners[corner.toLowerCase()]) {
			changes = {
				[`${prefix}${corners[corner.toLowerCase()]}-general`]: finalValue,
				[`${prefix}border-sync-radius-general`]: 'none',
				[`${prefix}border-unit-radius-general`]: 'px',
			};
		} else {
			changes = {
				[`${prefix}border-top-left-radius-general`]: finalValue,
				[`${prefix}border-top-right-radius-general`]: finalValue,
				[`${prefix}border-bottom-left-radius-general`]: finalValue,
				[`${prefix}border-bottom-right-radius-general`]: finalValue,
				[`${prefix}border-sync-radius-general`]: 'all',
				[`${prefix}border-unit-radius-general`]: 'px',
			};
		}
		
		console.log('[Maxi AI Debug] updateBorderRadius:', prefix, changes);
		return changes;
	};

	// Box Shadow - Uses Style Card palette by default
	// Box Shadow - Supports Theme Variables
	const updateBoxShadow = (x = 0, y = 4, blur = 10, spread = 0, color = null, prefix = '', opacity = null) => {
		const base = {
			[`${prefix}box-shadow-status-general`]: true,
			[`${prefix}box-shadow-horizontal-general`]: x,
			[`${prefix}box-shadow-vertical-general`]: y,
			[`${prefix}box-shadow-blur-general`]: blur,
			[`${prefix}box-shadow-spread-general`]: spread,
			[`${prefix}box-shadow-inset-general`]: false,
			[`${prefix}box-shadow-horizontal-unit-general`]: 'px',
			[`${prefix}box-shadow-vertical-unit-general`]: 'px',
			[`${prefix}box-shadow-blur-unit-general`]: 'px',
			[`${prefix}box-shadow-spread-unit-general`]: 'px',
		};

		// Handle numeric palette color with breakpoints
		if (typeof color === 'number') {
			const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
			const allAttrs = { ...base };
			
			breakpoints.forEach(bp => {
				const suffix = bp === 'general' ? '-general' : `-${bp}`;
				// Set palette color
				allAttrs[`${prefix}box-shadow-palette-status${suffix}`] = true;
				allAttrs[`${prefix}box-shadow-palette-color${suffix}`] = color;
				allAttrs[`${prefix}box-shadow-color${suffix}`] = '';
				
				// Set values for each breakpoint
				allAttrs[`${prefix}box-shadow-horizontal${suffix}`] = x;
				allAttrs[`${prefix}box-shadow-vertical${suffix}`] = y;
				allAttrs[`${prefix}box-shadow-blur${suffix}`] = blur;
				allAttrs[`${prefix}box-shadow-spread${suffix}`] = spread;
				allAttrs[`${prefix}box-shadow-inset${suffix}`] = false;
				allAttrs[`${prefix}box-shadow-horizontal-unit${suffix}`] = 'px';
				allAttrs[`${prefix}box-shadow-vertical-unit${suffix}`] = 'px';
				allAttrs[`${prefix}box-shadow-blur-unit${suffix}`] = 'px';
				allAttrs[`${prefix}box-shadow-spread-unit${suffix}`] = 'px';
				// Apply opacity if provided
				if (opacity !== null) {
					allAttrs[`${prefix}box-shadow-palette-opacity${suffix}`] = opacity;
				}
			});
			
			console.log('[Maxi AI Debug] updateBoxShadow attrs:', prefix, allAttrs);
			return allAttrs;
		}

		if (color) {
			// Custom color or variable provided
			return {
				...base,
				[`${prefix}box-shadow-palette-status-general`]: false, // Disable palette ID
				[`${prefix}box-shadow-color-general`]: color, // Use custom color (var or hex)
				[`${prefix}box-shadow-type-general`]: 'outset' // Ensure default type
			};
		}

		// Default to Style Card Palette (Color 8)
		return {
			...base,
			[`${prefix}box-shadow-palette-status-general`]: true,
			[`${prefix}box-shadow-palette-color-general`]: 8,
			[`${prefix}box-shadow-palette-opacity-general`]: 12,
		};
	};

	const removeBoxShadow = (prefix = '') => ({
		[`${prefix}box-shadow-status-general`]: false,
	});

	/**
	 * ============================================================================
	 * RESPONSIVE SPACING HELPER
	 * ============================================================================
	 * 
	 * Creates padding/margin attributes across ALL 6 MaxiBlocks breakpoints.
	 * This is a dedicated function for spacing to avoid confusion with other
	 * attribute updates.
	 * 
	 * Breakpoint mapping:
	 * - Desktop: XL, L (largest screens)
	 * - Tablet:  M, S (medium screens)
	 * - Mobile:  XS, XXS (smallest screens)
	 * 
	 * @param {string} preset - 'compact' | 'comfortable' | 'spacious'
	 * @param {string} prefix - Block attribute prefix (e.g., 'container-')
	 * @param {string} property - 'padding' or 'margin'
	 * @returns {object} Attribute changes for all breakpoints
	 */
	const createResponsiveSpacing = (preset, prefix = '', property = 'padding') => {
		// Define preset values: {desktop, tablet, mobile}
		const presets = {
			compact: { desktop: 60, tablet: 40, mobile: 20 },
			comfortable: { desktop: 100, tablet: 60, mobile: 40 },
			spacious: { desktop: 140, tablet: 80, mobile: 60 },
		};

		const values = presets[preset] || presets.comfortable;
		const { desktop, tablet, mobile } = values;

		return {
			// ==================== BASE / GENERAL ====================
			[`${prefix}${property}-top-general`]: desktop,
			[`${prefix}${property}-bottom-general`]: desktop,
			[`${prefix}${property}-left-general`]: 0,
			[`${prefix}${property}-right-general`]: 0,
			[`${prefix}${property}-unit-general`]: 'px',
			[`${prefix}${property}-sync-general`]: 'none',

			// ==================== DESKTOP (XXL, XL, L) ====================
			[`${prefix}${property}-top-xxl`]: desktop,
			[`${prefix}${property}-bottom-xxl`]: desktop,
			[`${prefix}${property}-left-xxl`]: 0,
			[`${prefix}${property}-right-xxl`]: 0,
			[`${prefix}${property}-unit-xxl`]: 'px',
			[`${prefix}${property}-sync-xxl`]: 'none',

			[`${prefix}${property}-top-xl`]: desktop,
			[`${prefix}${property}-bottom-xl`]: desktop,
			[`${prefix}${property}-left-xl`]: 0,
			[`${prefix}${property}-right-xl`]: 0,
			[`${prefix}${property}-unit-xl`]: 'px',
			[`${prefix}${property}-sync-xl`]: 'none',
			
			[`${prefix}${property}-top-l`]: desktop,
			[`${prefix}${property}-bottom-l`]: desktop,
			[`${prefix}${property}-left-l`]: 0,
			[`${prefix}${property}-right-l`]: 0,
			[`${prefix}${property}-unit-l`]: 'px',
			[`${prefix}${property}-sync-l`]: 'none',

			// ==================== TABLET (M, S) ====================
			[`${prefix}${property}-top-m`]: tablet,
			[`${prefix}${property}-bottom-m`]: tablet,
			[`${prefix}${property}-left-m`]: 0,
			[`${prefix}${property}-right-m`]: 0,
			[`${prefix}${property}-unit-m`]: 'px',
			[`${prefix}${property}-sync-m`]: 'none',
			
			[`${prefix}${property}-top-s`]: tablet,
			[`${prefix}${property}-bottom-s`]: tablet,
			[`${prefix}${property}-left-s`]: 0,
			[`${prefix}${property}-right-s`]: 0,
			[`${prefix}${property}-unit-s`]: 'px',
			[`${prefix}${property}-sync-s`]: 'none',

			// ==================== MOBILE (XS) ====================
			[`${prefix}${property}-top-xs`]: mobile,
			[`${prefix}${property}-bottom-xs`]: mobile,
			[`${prefix}${property}-left-xs`]: 0,
			[`${prefix}${property}-right-xs`]: 0,
			[`${prefix}${property}-unit-xs`]: 'px',
			[`${prefix}${property}-sync-xs`]: 'none',
		};
	};

	// Opacity
	const updateOpacity = (value) => ({
		'opacity-general': Math.max(0, Math.min(1, Number(value))),
	});

	// Border Helper
	// Border Helper
	const updateBorder = (width, style, color, prefix = '') => {
		const widthStr = String(parseInt(width) || 0);

		// If width is 0 or style is none, remove border
		if (parseInt(width) === 0 || style === 'none') {
			return {
				[`${prefix}border-style-general`]: 'none',
				[`${prefix}border-top-width-general`]: '0',
				[`${prefix}border-bottom-width-general`]: '0',
				[`${prefix}border-left-width-general`]: '0',
				[`${prefix}border-right-width-general`]: '0',
				[`${prefix}border-sync-width-general`]: 'all',
			};
		}
		
		const base = {
			[`${prefix}border-style-general`]: style || 'solid',
			[`${prefix}border-top-width-general`]: widthStr,
			[`${prefix}border-bottom-width-general`]: widthStr,
			[`${prefix}border-left-width-general`]: widthStr,
			[`${prefix}border-right-width-general`]: widthStr,
			[`${prefix}border-sync-width-general`]: 'all',
			[`${prefix}border-unit-width-general`]: 'px',
		};

		// Check for Palette Variables to fix UI "Custom Color" issue
		if (color && typeof color === 'string') {
			if (color.includes('var(--p)')) {
				return { ...base, [`${prefix}border-palette-status-general`]: true, [`${prefix}border-palette-color-general`]: 1 };
			}
			if (color.includes('var(--h1)')) {
				return { ...base, [`${prefix}border-palette-status-general`]: true, [`${prefix}border-palette-color-general`]: 2 }; // Typically Heading
			}
			if (color.includes('var(--highlight)')) {
				// Highlight is often palette 3 in many default themes, or 5 depending on config.
				// Let's assume 3 (Accent) for broader compatibility if unknown.
				return { ...base, [`${prefix}border-palette-status-general`]: true, [`${prefix}border-palette-color-general`]: 3 }; 
			}
			// Fallback for other vars or hex
			// Must iterate all breakpoints to ensure we override specific palette settings
			const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
			const widthNum = parseFloat(width) || 2;
			const allAttrs = { ...base };

			breakpoints.forEach(bp => {
				const suffix = bp === 'general' ? '-general' : `-${bp}`;
				
				// Disable palette and set custom color
				allAttrs[`${prefix}border-palette-status${suffix}`] = false;
				allAttrs[`${prefix}border-color${suffix}`] = color;
				allAttrs[`${prefix}border-palette-color${suffix}`] = ''; // Explicitly clear stale palette index
				
				// Apply style/width to all breakpoints to ensure consistency
				allAttrs[`${prefix}border-style${suffix}`] = style || 'solid';
				allAttrs[`${prefix}border-top-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-bottom-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-left-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-right-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-sync-width${suffix}`] = 'all';
				allAttrs[`${prefix}border-unit-width${suffix}`] = 'px';
			});
			
			// console.log('[Maxi AI Debug] updateBorder (Custom) attrs:', prefix, allAttrs);
			return allAttrs;
		}
		
			// Handle numeric palette colour
		if (typeof color === 'number') {
			const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
			const widthNum = parseFloat(width) || 2; // Use number, not string
			const allAttrs = { ...base };
			
			breakpoints.forEach(bp => {
				const suffix = bp === 'general' ? '-general' : `-${bp}`;
				// Set palette colour
				allAttrs[`${prefix}border-palette-status${suffix}`] = true;
				allAttrs[`${prefix}border-palette-color${suffix}`] = color;
				allAttrs[`${prefix}border-color${suffix}`] = `var(--maxi-color-${color})`;
				
				// Set width and style for each breakpoint (width must be NUMBER)
				allAttrs[`${prefix}border-style${suffix}`] = style || 'solid';
				allAttrs[`${prefix}border-top-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-bottom-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-left-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-right-width${suffix}`] = widthNum;
				allAttrs[`${prefix}border-sync-width${suffix}`] = 'all';
				allAttrs[`${prefix}border-unit-width${suffix}`] = 'px';
			});
			
			console.log('[Maxi AI Debug] updateBorder attrs:', prefix, allAttrs);
			return allAttrs;
		}
		return {
			...base,
			[`${prefix}border-color-general`]: color || '#000000',
			[`${prefix}border-palette-status-general`]: false, 
		};
	};

	// Width


	// Width
	const updateWidth = (value, unit = 'px', prefix = '') => ({
		[`${prefix}width-general`]: value,
		[`${prefix}width-unit-general`]: unit,
	});

	// Height
	const updateHeight = (value, unit = 'px', prefix = '') => ({
		[`${prefix}height-general`]: value,
		[`${prefix}height-unit-general`]: unit,
	});

	// Typography helpers
	const updateFontFamily = (value) => ({
		'font-family-general': value,
	});

	const updateFontWeight = (value) => {
		// Convert text weight names to numbers
		const weightMap = {
			'thin': '100',
			'extra-light': '200',
			'extralight': '200',
			'light': '300',
			'normal': '400',
			'regular': '400',
			'medium': '500',
			'semi-bold': '600',
			'semibold': '600',
			'bold': '700',
			'extra-bold': '800',
			'extrabold': '800',
			'black': '900',
			'heavy': '900',
		};
		const normalizedValue = String(value).toLowerCase();
		const weight = weightMap[normalizedValue] || String(value);
		return {
			'font-weight-general': weight,
		};
	};

	const updateLineHeight = (value, unit = 'em') => ({
		'line-height-general': Number(value),
		'line-height-unit-general': unit,
	});

	const updateLetterSpacing = (value, unit = 'px') => ({
		'letter-spacing-general': Number(value),
		'letter-spacing-unit-general': unit,
	});

	const updateTextTransform = (value) => ({
		'text-transform-general': value,
	});

	const updateTextAlign = (alignment = 'left') => {
		return {
			'text-alignment-general': alignment,
			'alignment-general': alignment, // For buttons etc
			'text-alignment-xxl': '', 'text-alignment-xl': '', 'text-alignment-l': '', 'text-alignment-m': '', 'text-alignment-s': '', 'text-alignment-xs': '',
			'alignment-xxl': '', 'alignment-xl': '', 'alignment-l': '', 'alignment-m': '', 'alignment-s': '', 'alignment-xs': '',
		};
	};

	// Layout/Flexbox helpers
	const updateFlexDirection = (value) => ({
		'flex-direction-general': value,
	});

	const updateJustifyContent = (value) => ({
		'justify-content-general': value,
	});

	const updateAlignItems = (value) => ({
		'align-items-general': value,
	});

	const updateGap = (value, unit = 'px') => ({
		'row-gap-general': Number(value),
		'row-gap-unit-general': unit,
		'column-gap-general': Number(value),
		'column-gap-unit-general': unit,
	});

	// Flex sizing helpers
	const updateFlexGrow = (value) => ({
		'flex-grow-general': Number(value),
	});

	const updateFlexShrink = (value) => ({
		'flex-shrink-general': Number(value),
	});

	// Combo helper for dead center
	const updateDeadCenter = () => ({
		'justify-content-general': 'center',
		'align-items-general': 'center',
	});

	// Stacking/layer helper
	const updateStacking = (zIndex, position = 'relative') => ({
		'z-index-general': Number(zIndex),
		'position-general': position,
	});

	const updateDisplay = (value) => ({
		'display-general': value,
	});

	const updatePosition = (value) => ({
		'position-general': value,
	});

	const updateZIndex = (value) => ({
		'z-index-general': Number(value),
	});

	// Visual Effects helpers
	const updateTransform = (type, x = 0, y = 0, z = 0) => {
		// type: rotate, scale, translate
		return {
			[`transform-${type}-general`]: { x: Number(x), y: Number(y), z: Number(z) }
		};
	};

	const updateClipPath = (shape) => ({
		'clip-path-general': shape,
		'clip-path-status-general': shape !== 'none',
	});

	const addScrollEffect = (effect) => ({
		[`scroll-${effect}-status-general`]: true,
	});

	const updateOverflow = (value) => ({
		'overflow-general': value,
	});

	const updateBlendMode = (value) => ({
		'mix-blend-mode-general': value,
	});

	// SVG Icon Color Helpers - Uses Style Card Palette by default
	const updateSvgFillColor = (value = 4, isHover = false) => {
		// Hover attributes use -hover suffix (paletteAttributesCreator doesn't add -general)
		const suffix = isHover ? '-hover' : '';
		
		const result = {};
		
		if (typeof value === 'number') {
			result[`svg-fill-palette-color${suffix}`] = value;
			result[`svg-fill-palette-status${suffix}`] = true;
			result[`svg-fill-color${suffix}`] = ''; // clear custom
		} else {
			// Assume it's a color string (hex/var)
			result[`svg-fill-palette-status${suffix}`] = false;
			result[`svg-fill-color${suffix}`] = value;
		}

		// If hover, also enable the hover status toggle
		if (isHover) {
			result['svg-status-hover'] = true;
		}
		return result;
	};

	const updateSvgLineColor = (value = 7, isHover = false) => {
		const suffix = isHover ? '-hover' : '';
		
		const result = {};
		
		if (typeof value === 'number') {
			result[`svg-line-palette-color${suffix}`] = value;
			result[`svg-line-palette-status${suffix}`] = true;
			result[`svg-line-color${suffix}`] = '';
		} else {
			result[`svg-line-palette-status${suffix}`] = false;
			result[`svg-line-color${suffix}`] = value;
		}

		// If hover, also enable the hover status toggle
		if (isHover) {
			result['svg-status-hover'] = true;
		}
		return result;
	};

	const updateSvgStrokeWidth = (width = 2) => {
		return {
			'svg-stroke-general': width,
		};
	};

	// Image Block Helpers
	const updateImageFit = (fit) => {
		if (fit === 'cover') {
			return { 
				'fitParentSize': true,
				// Ensure ratio allows filling
				'imageRatio': 'custom',
			};
		}
		// contain / original
		return { 
			'fitParentSize': false,
			'imageRatio': 'original',
		};
	};

	const updateAspectRatio = (ratio) => {
		// ratio: "1:1", "16:9", "4:3", or raw number
		let val = 1;
		
		if (String(ratio).includes(':')) {
			const parts = ratio.split(':');
			if (parts.length === 2) {
				val = Number(parts[1]) / Number(parts[0]); // Height / Width usually for padding-bottom hack?
				// Wait, standard aspect ratio is Width/Height (16/9 = 1.77).
				// But CSS padding-bottom hack is Height/Width (9/16 = 0.5625).
				// Let's assume input "16:9" means 16 wide 9 high.
				// If Maxi uses a multiplier, let's verify.
				// attributes.js: default 1.
				val = Number(parts[0]) / Number(parts[1]);
			}
		} else {
			val = Number(ratio) || 1;
		}

		return {
			'imageRatio': 'custom',
			'imageRatioCustom': String(val),
		};
	};



	const updateItemAlign = (alignment = 'center') => {
		let justify = alignment;
		let align = alignment;

		if (alignment === 'left') {
			justify = 'flex-start';
			align = 'flex-start';
		} else if (alignment === 'right') {
			justify = 'flex-end';
			align = 'flex-end';
		} else if (alignment === 'center') {
			justify = 'center';
			align = 'center';
		}

		return {
			'justify-content-general': justify,
			'align-items-general': align,
			'justify-content-xxl': '', 'justify-content-xl': '', 'justify-content-l': '', 'justify-content-m': '', 'justify-content-s': '', 'justify-content-xs': '',
			'align-items-xxl': '', 'align-items-xl': '', 'align-items-l': '', 'align-items-m': '', 'align-items-s': '', 'align-items-xs': '',
		};
	};

	const handleUpdateStyleCard = (updates) => {
		if (!allStyleCards || !saveMaxiStyleCards) {
			return __('Style Cards System is not ready.', 'maxi-blocks');
		}

		const newStyleCards = cloneDeep(allStyleCards);
		let activeKey = Object.keys(newStyleCards).find(key => newStyleCards[key].status === 'active');
		
		if (!activeKey) {
			// Fallback to first key if no active status found
			activeKey = Object.keys(newStyleCards)[0];
		}

		// SANITY CHECK: Detect corrupted data (e.g., 'light', 'dark', 'status' as root keys)
		const corruptedKeys = ['light', 'dark', 'status', 'value', 'styleCard'];
		const isCorrupted = Object.keys(newStyleCards).some(key => corruptedKeys.includes(key));

		if (!activeKey || !newStyleCards[activeKey] || isCorrupted) {
			// RECOVERY: If corrupted data caused no cards, reset to defaults.
			if (resetSC) {
				resetSC();
				return __('Style Cards data was corrupted. Resetting to defaults... Please try again after page reload.', 'maxi-blocks');
			}
			return __('No active Style Card found.', 'maxi-blocks');
		}

		// LOGIC: If default card (sc_maxi), CLONE it. If Custom, UPDATE in-place.
		let targetKey = activeKey;
		let message = '';

		if (activeKey === 'sc_maxi') {
			// CLONE Strategy
			const timestamp = Date.now();
			const newKey = `sc_ai_${timestamp}`;
			targetKey = newKey;

			newStyleCards[newKey] = cloneDeep(newStyleCards[activeKey]);
			newStyleCards[newKey].id = newKey;
			newStyleCards[newKey].name = `AI Generated - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
			newStyleCards[newKey].status = 'active';

			// Deactivate original
			newStyleCards[activeKey].status = 'inactive';
			
			message = __('New Style Card created and activated.', 'maxi-blocks');
		} else {
			// UPDATE Strategy
			message = __('Style Card updated.', 'maxi-blocks');
		}

		const targetCard = newStyleCards[targetKey];
		let changesCount = 0;

		// Helper to safely set deeply nested values
		const setStyleValue = (key, value) => {
			['light', 'dark'].forEach(mode => {
				if (!targetCard[mode]) targetCard[mode] = {};
				if (!targetCard[mode].styleCard) targetCard[mode].styleCard = {};
				
				// Identify category
				let category = 'color'; // Default
				if (key.startsWith('font-')) category = 'typography';
				
				if (!targetCard[mode].styleCard[category]) {
					targetCard[mode].styleCard[category] = {};
				}

				targetCard[mode].styleCard[category][key] = value;
			});
			changesCount++;
		};

		Object.entries(updates).forEach(([key, value]) => {
			setStyleValue(key, value);
		});

		if (changesCount > 0) {
			saveMaxiStyleCards(newStyleCards, true);
			
			// Switch UI if we changed cards
			if (setActiveStyleCard && targetKey !== activeKey) {
				setActiveStyleCard(targetKey);
			}
			
			return message;
		}
		return __('No valid Style Card updates found.', 'maxi-blocks');
	};

	const handleApplyTheme = (theme, prompt) => {
		if (!allStyleCards || !saveMaxiStyleCards) {
			return __('Style Cards System is not ready.', 'maxi-blocks');
		}

		// Detect if request is about headings
		const isHeadingRequest = prompt && /heading|header|title|h1|h2|h3|h4|h5|h6/i.test(prompt);
		const isBlueRequest = prompt && /blue/i.test(prompt);

		const result = applyThemeToStyleCards({
			styleCards: allStyleCards,
			theme,
			prompt,
			openEditor: false, // We'll handle opening manually with options
			timestamp: Date.now(),
		});

		if (!result) {
			return __('Could not apply theme. Try specifying a color like "make it green".', 'maxi-blocks');
		}

		// Save with pendingChanges: true to enable save button
		saveMaxiStyleCards(result.styleCards, false);

		if (setActiveStyleCard && result.updatedKey) {
			setActiveStyleCard(result.updatedKey);
		}

		// Open Style Card editor with enhanced options
		setTimeout(() => {
			const editorOptions = {};
			
			if (isHeadingRequest) {
				editorOptions.focusHeadingsGlobals = true;
				
				// Determine which level to focus and apply
				let detectedLevel = null;
				const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
				for (const level of levels) {
					if (new RegExp(level, 'i').test(prompt)) {
						detectedLevel = level;
						break;
					}
				}
				
				const isAll = /all|every/i.test(prompt);
				
				// Focus level: default to H1 unless a specific one is mentioned
				editorOptions.headingLevel = detectedLevel || 'h1';
				
				// Apply level: 'all' if requested, otherwise the specific one (or all if generic 'heading' used without level)
				editorOptions.applyHeadingLevel = isAll ? 'all' : (detectedLevel || 'all');
				
				editorOptions.delay = 400;
				
				// If user asked for blue headings, apply palette blue
				if (isBlueRequest) {
					editorOptions.applyHeadingPaletteColor = true;
				}
			}
			
			if (typeof window.maxiBlocksOpenStyleCardsEditor === 'function') {
				window.maxiBlocksOpenStyleCardsEditor(editorOptions);
			} else {
				// Fallback: click the button
				const styleCardsButton = document.getElementById('maxi-button__style-cards');
				if (styleCardsButton) {
					styleCardsButton.click();
					
					// If heading request, try to focus headings after editor opens
					if (isHeadingRequest) {
						setTimeout(() => {
							// Try to find Headings accordion - look for the accordion item wrapper first
							// The accordion item has class maxi-blocks-sc__type--heading
							// The button inside it has class maxi-accordion-control__item__button
							const headingAccordionItem = document.querySelector('.maxi-blocks-sc__type--heading');
							
							if (headingAccordionItem) {
								// Accordion button is a div with role="button" and class .maxi-accordion-control__item__button
								// NOT a <button> tag
								const accordionBtn = headingAccordionItem.querySelector('.maxi-accordion-control__item__button');
								
								if (accordionBtn) {
									// Check if already expanded to avoid closing it
									const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
									if (!isExpanded) {
										accordionBtn.click();
									}
									
									// Now try to switch to the specific H-tag tab if needed
									setTimeout(() => {
										const headingPanel = headingAccordionItem.querySelector('.maxi-accordion-control__item__panel');
										if (headingPanel) {
											const tabButtons = Array.from(headingPanel.querySelectorAll('[role="tab"], button'));
											const targetTab = tabButtons.find(btn => 
												btn.textContent.trim().toLowerCase() === editorOptions.headingLevel.toLowerCase()
											);
											
											if (targetTab) {
												targetTab.click();
											}
										}
									}, 100);
								}
							} else {
								// Fallback: try to find by text content
								const allAccordionButtons = document.querySelectorAll('.maxi-accordion-control__item__button');
								
								for (const btn of allAccordionButtons) {
									if (btn.textContent.toLowerCase().includes('heading')) {
										btn.click();
										break;
									}
								}
							}
						}, 500);
					}
				}
			}
		}, 300);

		if (result.createdNew) {
			return __('Created new Style Card. Review and save in the editor.', 'maxi-blocks');
		}
		return __('Style Card updated. Review and save in the editor.', 'maxi-blocks');
	};

	/*
	 * ============================================================================
	 * UNIVERSAL BLOCK UPDATER
	 * ============================================================================
	 * Applies updates to a list of blocks recursively.
	 * Used by both Page changes (allBlocks) and Selection changes ([selectedBlock]).
	 */
	const applyUpdatesToBlocks = (blocksToUpdate, property, value, targetBlock = null, specificClientId = null) => {
		let count = 0;

		// Block type matching helper
		const matchesTarget = (blockName, targetBlockArg) => {
			if (!targetBlockArg) return true; // No filter, apply to all
			const lowerName = blockName.toLowerCase();
			const lowerTarget = targetBlockArg.toLowerCase();
			
			// STRICTER TARGETING
			if (lowerTarget === 'image') {
				// Only target actual Image blocks
				return lowerName === 'maxi-blocks/image-maxi' || lowerName === 'maxi-blocks/image'; 
			}
			if (lowerTarget === 'button') {
				return lowerName.includes('button-maxi') || lowerName.includes('button');
			}
			if (lowerTarget === 'text') return lowerName.includes('text') || lowerName.includes('heading');
			if (lowerTarget === 'container') {
				// Exclude groups/rows if looking for main container
				return lowerName.includes('container') && !lowerName.includes('group'); 
			}
			if (lowerTarget === 'icon') {
				return lowerName.includes('icon-maxi') || lowerName.includes('svg-icon');
			}
			return true;
		};

		const recursiveUpdate = (blocks) => {
			if (!Array.isArray(blocks)) {
				return;
			}
			
			blocks.forEach(block => {
				let changes = null;
				const isMaxi = block.name.startsWith('maxi-blocks/');
				
				const prefix = getBlockPrefix(block.name);
				
				// MATCHING LOGIC
				const isMatch = specificClientId ? block.clientId === specificClientId : matchesTarget(block.name, targetBlock);

				// console.log(`[Maxi AI Debug] Checking block: ${block.name} (${block.clientId}). isMaxi: ${isMaxi}, isMatch: ${isMatch}, Target: ${targetBlock}`);

				if (isMaxi && isMatch) {
					// console.log(`[Maxi AI Debug] MATCH: ${block.name} (${block.clientId}). Updating ${property}...`);
					
					switch (property) {

						case 'background_color':
							// Apply to containers, rows, columns OR if it's a direct clientId match (Selection)
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column')) {
								changes = updateBackgroundColor(block.clientId, value, block.attributes);
							}
							break;
						case 'text_color':
							// Apply to text and buttons OR direct selection
							if (specificClientId || block.name.includes('text-maxi') || block.name.includes('button-maxi')) {
								changes = updateTextColor(value);
							}
							break;
						case 'heading_color':
							// Apply only to headings (h1-h6)
							if (block.name.includes('text-maxi') && ['h1','h2','h3','h4','h5','h6'].includes(block.attributes.textLevel)) {
								changes = updateTextColor(value);
							}
							break;
						case 'padding':
							changes = updatePadding(value, null, prefix);
							break;
						case 'responsive_padding':
							if (typeof value === 'object') {
								const { desktop, tablet, mobile } = value;
								// Helper to parse '100px' -> 100
								const parseVal = (v) => parseInt(v) || 0;
								
								const dVal = parseVal(desktop);
								const tVal = parseVal(tablet);
								const mVal = parseVal(mobile);
								
								changes = {
									// Desktop (XL, L)
									[`${prefix}padding-top-xl`]: dVal, [`${prefix}padding-bottom-xl`]: dVal,
									[`${prefix}padding-left-xl`]: 0, [`${prefix}padding-right-xl`]: 0, // Force side padding to 0
									
									[`${prefix}padding-top-lg`]: dVal, [`${prefix}padding-bottom-lg`]: dVal,
									[`${prefix}padding-left-lg`]: 0, [`${prefix}padding-right-lg`]: 0,

									// Tablet (M, S)
									[`${prefix}padding-top-md`]: tVal, [`${prefix}padding-bottom-md`]: tVal,
									[`${prefix}padding-left-md`]: 0, [`${prefix}padding-right-md`]: 0,
									
									[`${prefix}padding-top-sm`]: tVal, [`${prefix}padding-bottom-sm`]: tVal,
									[`${prefix}padding-left-sm`]: 0, [`${prefix}padding-right-sm`]: 0,
									
									// Mobile (XS, XXS)
									[`${prefix}padding-top-xs`]: mVal, [`${prefix}padding-bottom-xs`]: mVal,
									[`${prefix}padding-left-xs`]: 0, [`${prefix}padding-right-xs`]: 0,
									
									[`${prefix}padding-top-xxs`]: mVal, [`${prefix}padding-bottom-xxs`]: mVal,
									[`${prefix}padding-left-xxs`]: 0, [`${prefix}padding-right-xxs`]: 0,
									
									// Units
									[`${prefix}padding-unit-xl`]: 'px', [`${prefix}padding-unit-lg`]: 'px',
									[`${prefix}padding-unit-md`]: 'px', [`${prefix}padding-unit-sm`]: 'px',
									[`${prefix}padding-unit-xs`]: 'px', [`${prefix}padding-unit-xxs`]: 'px',
									
									// Sync - we sync top/bottom but not sides, so set to 'none' (unlinked)
									[`${prefix}padding-sync-xl`]: 'none', 
									[`${prefix}padding-sync-lg`]: 'none', 
									[`${prefix}padding-sync-md`]: 'none',
									[`${prefix}padding-sync-sm`]: 'none',
									[`${prefix}padding-sync-xs`]: 'none',
									[`${prefix}padding-sync-xxs`]: 'none',
								};
							}
							break;
						case 'margin':
							changes = updateMargin(value, null, prefix);
							break;
						case 'font_size':
							changes = updateFontSize(value);
							break;
						case 'border_radius':
							changes = updateBorderRadius(value, null, prefix);
							break;
						case 'border':
							// value can be string "1px solid red" or object {width, style, color}
							if (value === 'none') {
								changes = updateBorder(0, 'none', null, prefix);
							} else if (typeof value === 'object') {
								changes = updateBorder(value.width, value.style, value.color, prefix);
							} else if (typeof value === 'string') {
								// Simple parse for "1px solid color"
								const parts = value.split(' ');
								if (parts.length >= 3) {
									// Assume format: width style color
									changes = updateBorder(parseInt(parts[0]), parts[1], parts.slice(2).join(' '), prefix);
								} else {
									// FALLBACK: Single value = color only, use defaults
									changes = updateBorder(1, 'solid', value, prefix);
								}
							}
							break;
						case 'box_shadow':
							// value is expected to be object {x, y, blur, spread, color}
							if (value === 'none') {
								changes = removeBoxShadow(prefix);
							} else if (typeof value === 'object') {
								changes = updateBoxShadow(value.x, value.y, value.blur, value.spread, value.color, prefix, value.opacity);
							}
							break;
						case 'apply_responsive_spacing':
							// value is the preset name: 'compact' | 'comfortable' | 'spacious'
							changes = createResponsiveSpacing(value, prefix);
							break;
						case 'width':
							const wStr = String(value);
							changes = updateWidth(value, wStr.includes('%') || wStr.includes('vw') ? '' : 'px', prefix);
							break;
						case 'height':
							const hStr = String(value);
							changes = updateHeight(value, hStr.includes('%') || hStr.includes('vh') ? '' : 'px', prefix);
							break;
						case 'object_fit':
						case 'objectFit':
							// Only apply to images or direct selection
							if (specificClientId || block.name.includes('image')) {
								changes = updateImageFit(value);
							}
							break;
						case 'opacity':
							changes = updateOpacity(value);
							break;
						case 'svg_fill_color':
							// Only apply to SVG icon blocks
							if (specificClientId || block.name.includes('svg-icon')) {
								changes = updateSvgFillColor(value);
							}
							break;
						case 'svg_line_color':
							// Only apply to SVG icon blocks
							if (specificClientId || block.name.includes('svg-icon')) {
								changes = updateSvgLineColor(value);
							}
							break;
						case 'svg_stroke_width':
							// Only apply to SVG icon blocks
							if (specificClientId || block.name.includes('svg-icon')) {
								const width = typeof value === 'number' ? value : parseInt(value) || 2;
								changes = updateSvgStrokeWidth(width);
							}
							break;
						case 'svg_fill_color_hover':
							// Only apply to SVG icon blocks - hover state
							if (specificClientId || block.name.includes('svg-icon')) {
								changes = updateSvgFillColor(value, true); // true = isHover
							}
							break;
						case 'svg_line_color_hover':
							// Only apply to SVG icon blocks - line/stroke hover state
							if (specificClientId || block.name.includes('svg-icon')) {
								changes = updateSvgLineColor(value, true); // true = isHover
							}
							break;
						case 'text_align':
							// Text alignment for text/heading blocks
							changes = { 'text-alignment-general': value };
							break;
						case 'align_items':
							// Item alignment for container blocks
							changes = { 
								'justify-content-general': value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center',
								'align-items-general': value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center',
							};
							break;
						case 'align_everything':
							// Universal alignment: text + flex items together
							const flexValue = value === 'left' ? 'flex-start' : value === 'right' ? 'flex-end' : 'center';
							changes = { 
								'text-alignment-general': value,
								'justify-content-general': flexValue,
								'align-items-general': flexValue,
							};
							break;
						// ======= LAYOUT INTENT PROPERTIES =======
						case 'flex_direction':
							// Apply to layout containers
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = updateFlexDirection(value);
							}
							break;
						case 'justify_content':
							// Apply to layout containers
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = updateJustifyContent(value);
							}
							break;
						case 'align_items_flex':
							// Apply to layout containers (different from text align_items)
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = updateAlignItems(value);
							}
							break;
						case 'flex_wrap':
							// Apply to layout containers
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = {
									'flex-wrap-general': value,
								};
							}
							break;
						case 'gap':
							// Apply to layout containers
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								const gapVal = typeof value === 'number' ? value : parseInt(value) || 0;
								changes = updateGap(gapVal);
							}
							break;
						// ======= EXTENDED LAYOUT PROPERTIES =======
						case 'dead_center':
							// Combo: center both axes
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = updateDeadCenter();
							}
							break;
						case 'flex_grow':
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = updateFlexGrow(value);
							}
							break;
						case 'flex_shrink':
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = updateFlexShrink(value);
							}
							break;
						case 'stacking':
							// Combo: z-index + position
							if (typeof value === 'object' && value.zIndex !== undefined) {
								changes = updateStacking(value.zIndex, value.position || 'relative');
							}
							break;
						case 'position':
							changes = updatePosition(value);
							break;
						case 'display':
							changes = updateDisplay(value);
							break;
						// ======= OPACITY & TRANSPARENCY =======
						case 'opacity':
							changes = { 'opacity-general': Number(value) };
							break;
						// ======= TRANSFORM EFFECTS =======
						case 'transform_rotate':
							changes = {
								'transform-rotate-general': Number(value),
								'transform-origin-general': 'center center',
							};
							break;
						case 'transform_scale':
							if (typeof value === 'object') {
								changes = {
									'transform-scale-x-general': value.x || 1,
									'transform-scale-y-general': value.y || 1,
								};
							} else {
								changes = {
									'transform-scale-x-general': Number(value),
									'transform-scale-y-general': Number(value),
								};
							}
							break;
						case 'transform_scale_hover':
							changes = {
								'transform-scale-x-hover': Number(value),
								'transform-scale-y-hover': Number(value),
								'transform-status-hover': true,
							};
							break;
						// ======= BUTTON ACTIONS =======
						case 'button_style':
							if (block.name.includes('button')) { // Double check
								if (value === 'outline') {
									changes = {
										[`${prefix}background-active-media-general`]: 'none',
										[`${prefix}border-style-general`]: 'solid',
										[`${prefix}border-top-width-general`]: '2',
										[`${prefix}border-bottom-width-general`]: '2',
										[`${prefix}border-left-width-general`]: '2',
										[`${prefix}border-right-width-general`]: '2',
										[`${prefix}border-sync-width-general`]: 'all',
										[`${prefix}border-unit-width-general`]: 'px',
										[`${prefix}border-palette-status-general`]: true,
										[`${prefix}border-palette-color-general`]: 4, // Highlight
									};
								} else if (value === 'solid') {
									changes = {
										[`${prefix}background-active-media-general`]: 'color',
										[`${prefix}background-palette-status-general`]: true,
										[`${prefix}background-palette-color-general`]: 4, // Highlight
										[`${prefix}border-style-general`]: 'none',
									};
								} else if (value === 'flat') {
									changes = {
										[`${prefix}box-shadow-status-general`]: false,
									};
								}
							}
							break;
						case 'button_icon':
							if (block.name.includes('button')) {
								if (value === 'only') {
									changes = { 'icon-only': true };
								} else if (value === 'none') {
									changes = { 'icon-only': false, 'icon-content': '' }; // Removing content effectively removes icon
								}
							}
							break;
						case 'button_size':
							if (block.name.includes('button')) {
								if (value === 'small') {
									changes = {
										[`${prefix}padding-top-general`]: '8',
										[`${prefix}padding-bottom-general`]: '8',
										[`${prefix}padding-left-general`]: '16',
										[`${prefix}padding-right-general`]: '16',
										[`${prefix}font-size-general`]: 14,
									};
								} else if (value === 'large') {
									changes = {
										[`${prefix}padding-top-general`]: '20',
										[`${prefix}padding-bottom-general`]: '20',
										[`${prefix}padding-left-general`]: '40',
										[`${prefix}padding-right-general`]: '40',
										[`${prefix}font-size-general`]: 20,
									};
								}
							}
							break;
						case 'scroll_fade':
							changes = { 'scroll-fade-status-general': true };
							break;
						case 'parallax':
							changes = { 
								'background-image-attachment-general': 'fixed',
								'background-image-parallax-general': true,
							};
							break;
						// ======= AESTHETIC (special - triggers apply_theme) =======
						case 'aesthetic':
							// This is handled specially - force to global scope
							// The aesthetic patterns will use apply_theme instead
							changes = null; // Handled in the loop with special logic
							break;
						// ======= TYPOGRAPHY =======
						case 'line_height':
							changes = { 'line-height-general': Number(value) };
							break;
						case 'letter_spacing':
							changes = { 'letter-spacing-general': Number(value) };
							break;
						case 'font_weight':
							changes = { 'font-weight-general': Number(value) };
							break;
						case 'text_decoration':
							changes = { 'text-decoration-general': value };
							break;
						// ======= BACKGROUNDS & MEDIA =======
						case 'background_media':
							changes = { 'background-active-media-general': value };
							break;
						case 'background_overlay':
							changes = {
								'overlay-background-color-general': 'rgba(0,0,0,' + Number(value) + ')',
								'overlay-status-general': true,
							};
							break;
						case 'object_fit':
							if (block.name.includes('image')) {
								changes = { 'object-fit-general': value };
							}
							break;
						case 'background_tile':
							changes = { 
								'background-image-repeat-general': 'repeat',
								'background-image-size-general': 'auto',
							};
							break;
						// ======= SHAPES & DIVIDERS =======
						case 'shape_divider':
							changes = { 
								'shape-divider-bottom-status': true,
								'shape-divider-bottom-shape': value,
							};
							break;
						case 'clip_path':
							changes = { 
								'clip-path-general': value,
								'clip-path-status-general': true,
							};
							break;
						// ======= CONSTRAINTS & SIZING =======
						case 'max_width':
							changes = { 'max-width-general': value };
							break;
						case 'full_width':
							changes = { 
								'full-width-general': true,
								'size-advanced-options': true,
							};
							break;
						case 'min_height':
							changes = { 
								'min-height-general': Number(value),
								'min-height-unit-general': 'px',
							};
							break;
						// ======= ROW PATTERNS =======
						case 'row_pattern':
							// Row patterns are complex - just set a marker attribute
							changes = { 'row-pattern-general': value };
							break;
						// ======= RELATIVE SIZING =======
						case 'relative_size':
							// Multiply current size by value (1.2 = +20%, 0.8 = -20%)
							const currentWidth = block.attributes['width-general'] || 100;
							const currentHeight = block.attributes['height-general'] || 100;
							changes = {
								'width-general': Math.round(currentWidth * Number(value)),
								'height-general': Math.round(currentHeight * Number(value)),
							};
							break;
						case 'font_size_relative':
							const currentFontSize = block.attributes['font-size-general'] || 16;
							changes = { 'font-size-general': Math.round(currentFontSize * Number(value)) };
							break;
						case 'width_relative':
							const currentW = block.attributes['width-general'] || 100;
							changes = { 'width-general': Math.round(currentW * Number(value)) };
							break;
						case 'height_relative':
							const currentH = block.attributes['height-general'] || 100;
							changes = { 'height-general': Math.round(currentH * Number(value)) };
							break;
						// ======= DIRECTIONAL MARGIN =======
						case 'margin_top':
							changes = { 
								[`${prefix}margin-top-general`]: Number(value),
								[`${prefix}margin-top-unit-general`]: 'px',
							};
							break;
						case 'margin_bottom':
							changes = { 
								[`${prefix}margin-bottom-general`]: Number(value),
								[`${prefix}margin-bottom-unit-general`]: 'px',
							};
							break;
						case 'margin_left':
							changes = { 
								[`${prefix}margin-left-general`]: Number(value),
								[`${prefix}margin-left-unit-general`]: 'px',
							};
							break;
						case 'margin_right':
							changes = { 
								[`${prefix}margin-right-general`]: Number(value),
								[`${prefix}margin-right-unit-general`]: 'px',
							};
							break;
						// ======= DIRECTIONAL PADDING =======
						case 'padding_top':
							changes = { 
								[`${prefix}padding-top-general`]: Number(value),
								[`${prefix}padding-top-unit-general`]: 'px',
							};
							break;
						case 'padding_bottom':
							changes = { 
								[`${prefix}padding-bottom-general`]: Number(value),
								[`${prefix}padding-bottom-unit-general`]: 'px',
							};
							break;
						case 'padding_left':
							changes = { 
								[`${prefix}padding-left-general`]: Number(value),
								[`${prefix}padding-left-unit-general`]: 'px',
							};
							break;
						case 'padding_right':
							changes = { 
								[`${prefix}padding-right-general`]: Number(value),
								[`${prefix}padding-right-unit-general`]: 'px',
							};
							break;
						// ======= RESPONSIVE OVERRIDES =======
						case 'display_mobile':
							changes = { 'display-xs': value }; // xs = mobile
							break;
						case 'display_tablet':
							changes = { 'display-sm': value, 'display-md': value }; // sm/md = tablet
							break;
						case 'display_desktop':
							changes = { 'display-xl': value, 'display-lg': value }; // xl/lg = desktop
							break;
						case 'show_mobile_only':
							changes = { 
								'display-xl': 'none', 
								'display-lg': 'none',
								'display-md': 'none',
								'display-xs': 'flex',
							};
							break;
						// ======= HOVER STATE EFFECTS =======
						case 'hover_effect':
							changes = { 
								'transform-status-hover': true,
								'transform-scale-x-hover': 1.05,
								'transform-scale-y-hover': 1.05,
							};
							break;
						case 'hover_lift':
							changes = { 
								'transform-status-hover': true,
								'transform-translate-y-hover': -10,
								'box-shadow-blur-hover': 20,
								'box-shadow-vertical-hover': 10,
							};
							break;
						case 'hover_glow':
							changes = { 
								'box-shadow-status-hover': true,
								'box-shadow-blur-hover': 30,
								'box-shadow-spread-hover': 5,
								'box-shadow-opacity-hover': 0.5,
							};
							break;
						case 'hover_darken':
							changes = { 
								'opacity-hover': 0.7,
								'opacity-status-hover': true,
							};
							break;
						case 'hover_lighten':
							changes = { 
								'filter-brightness-hover': 1.2,
								'filter-status-hover': true,
							};
							break;
					}
				}

				if (changes) {
					// console.log(`[Maxi AI Debug] Dispatching update to ${block.clientId}:`, changes);
					updateBlockAttributes(block.clientId, changes);
					count++;
				}


				if (block.innerBlocks && block.innerBlocks.length > 0) {
					// console.log(`[Maxi AI Debug] Recursing into ${block.innerBlocks.length} inner blocks of ${block.name}`);
					recursiveUpdate(block.innerBlocks);
				} else {
					// Fallback: Check if block helper has innerBlocks not directly on object?
					// Usually block object has 'innerBlocks' array.
				}
			});
		};

		// execute
		if (blocksToUpdate && blocksToUpdate.length > 0) {
			// console.log(`[Maxi AI Debug] applyUpdatesToBlocks started with ${blocksToUpdate.length} blocks. Target: ${targetBlock}`);
			recursiveUpdate(blocksToUpdate);
		} else {
			// console.log('[Maxi AI Debug] applyUpdatesToBlocks called with empty block list.');
		}
		
		return count;
	};

	const handleUpdatePage = (property, value, targetBlock = null, clientId = null) => {
		let count = 0;
		// Wrap in batch to prevent multiple re-renders
		registry.batch(() => {
			count = applyUpdatesToBlocks(allBlocks, property, value, targetBlock, clientId);
		});
		return `Updated ${count} blocks on the page.`;
	};

	const handleUpdateSelection = (property, value, targetBlock = null) => {
		if (!selectedBlock) return __('Please select a block first.', 'maxi-blocks');
		
		let count = 0;
		// IMPORTANT: getSelectedBlock() often returns a "light" object or the recursion fails if innerBlocks aren't fully hydrated in that specific reference.
		// Instead, we should find the selected block within the full 'allBlocks' tree to ensure we have the complete structure with innerBlocks.
		
		const findBlockByClientId = (blocks, id) => {
			for (const block of blocks) {
				if (block.clientId === id) return block;
				if (block.innerBlocks && block.innerBlocks.length > 0) {
					const found = findBlockByClientId(block.innerBlocks, id);
					if (found) return found;
				}
			}
			return null;
		};


		const fullSelectedBlock = findBlockByClientId(allBlocks, selectedBlock.clientId);

		if (!fullSelectedBlock) {
			console.warn('[Maxi AI] Could not find full selected block in allBlocks tree. Using selectedBlock state as fallback.');
		}

		const blocksToProcess = [fullSelectedBlock || selectedBlock];
		
		// Wrap in batch
		registry.batch(() => {
			count = applyUpdatesToBlocks(blocksToProcess, property, value, targetBlock);
		});


		if (count === 0) {
			return __('No matching components found in selection.', 'maxi-blocks');
		}
		
		return count === 1 
			? __('Updated the selected block.', 'maxi-blocks')
			: `Updated ${count} items in the selection.`;
	};

	// Hover Animation Helper
	const applyHoverAnimation = (currentAttributes, shadowValue) => {
		// 1. Define the Smooth Transition (Applied to Base)
		const transitionSettings = "box-shadow 0.3s ease, transform 0.3s ease";
		
		// 2. Define the "Lift" Effect (Applied to Hover)
		const hoverTransform = "translateY(-5px)";
		
		const prefix = getBlockPrefix(selectedBlock?.name || '');
		
		// Shadow Value should be object {x, y, blur, spread, color}
		const { x=0, y=10, blur=30, spread=0, color='rgba(0,0,0,0.1)' } = (typeof shadowValue === 'object') ? shadowValue : {};

		return {
			// Base State: Clean slate + Transition
			[`${prefix}box-shadow-general`]: 'none', // Or should we rely on status?
			[`${prefix}box-shadow-status-general`]: false, // Explicitly disable base shadow
			[`${prefix}transition-general`]: transitionSettings,
			
			// Hover State: The Shadow + The Lift
			[`${prefix}box-shadow-status-hover`]: true,
			[`${prefix}box-shadow-horizontal-hover`]: x,
			[`${prefix}box-shadow-vertical-hover`]: y,
			[`${prefix}box-shadow-blur-hover`]: blur,
			[`${prefix}box-shadow-spread-hover`]: spread,
			[`${prefix}box-shadow-color-hover`]: color,
			[`${prefix}box-shadow-horizontal-unit-hover`]: 'px',
			[`${prefix}box-shadow-vertical-unit-hover`]: 'px',
			[`${prefix}box-shadow-blur-unit-hover`]: 'px',
			[`${prefix}box-shadow-spread-unit-hover`]: 'px',
			
			[`${prefix}transform-hover`]: hoverTransform,
		};
	};

	const parseAndExecuteAction = async responseText => {
		try {
			let action;
			
			// If already an object (from client-side interception), use it directly
			if (typeof responseText === 'object' && responseText !== null) {
				action = responseText;
			} else {
				try {
					action = JSON.parse(responseText.trim());
				} catch {
					const jsonMatch = responseText.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						action = JSON.parse(jsonMatch[0]);
					}
				}
			}

			// FALLBACK: If AI returned plain text for known clarification patterns, synthesize the response
			if (!action || !action.action) {
				const lowerText = responseText.toLowerCase();
				
				// Detect rounded corners clarification
				if (lowerText.includes('rounded') || lowerText.includes('corner')) {
					console.log('[Maxi AI Debug] Fallback: Detected rounded corners clarification in plain text');
					return {
						executed: false,
						message: 'How rounded should the corners be?',
						options: ['Subtle (8px)', 'Soft (24px)', 'Full (50px)']
					};
				}
				
				// Detect shadow clarification
				if (lowerText.includes('shadow')) {
					console.log('[Maxi AI Debug] Fallback: Detected shadow clarification in plain text');
					return {
						executed: false,
						message: 'What style of shadow would you like?',
						options: ['Soft', 'Crisp', 'Bold']
					};
				}

				// Detect spacing/padding clarification
				if (lowerText.includes('spacing') || lowerText.includes('padding') || lowerText.includes('space')) {
					console.log('[Maxi AI Debug] Fallback: Detected spacing clarification in plain text');
					return {
						executed: false,
						message: 'How much vertical spacing would you like?',
						options: ['Compact', 'Comfortable', 'Spacious']
					};
				}

				// Detect border clarification
				if (lowerText.includes('border')) {
					console.log('[Maxi AI Debug] Fallback: Detected border clarification in plain text');
					return {
						executed: false,
						message: 'What style of border would you like?',
						options: ['Subtle Border', 'Strong Border', 'Brand Border']
					};
				}
				
				// No pattern matched, return as regular message
				return { executed: false, message: responseText };
			}

			// DEBUG: Log parsed action
			console.log('[Maxi AI Debug] Parsed action:', JSON.stringify(action, null, 2));

			// --- NEW ACTION TYPES ---
			
			if (action.action === 'CLARIFY') {
				// Map CLARIFY to the existing message/options structure
				console.log('[Maxi AI Debug] CLARIFY action detected');
				console.log('[Maxi AI Debug] Raw options:', action.options);
				
				const optionsLabels = action.options?.map(opt => opt.label) || [];
				console.log('[Maxi AI Debug] Extracted option labels:', optionsLabels);
				
				return { 
					executed: false, 
					message: action.message, 
					options: optionsLabels 
				};
			}

			if (action.action === 'MODIFY_BLOCK') {
				if (!selectedBlock?.clientId) {
					return {
						executed: false,
						message: __('Please select a block first.', 'maxi-blocks'),
					};
				}

				let changes = {};
				const prefix = getBlockPrefix(selectedBlock.name);
				console.log('[Maxi AI Debug] MODIFY_BLOCK - Block name:', selectedBlock.name, 'Prefix:', prefix || '(empty)');

				// Helper to collect changes for a single block
				const getChangesForSelection = (prop, val) => {
					let c = null;
					
					// Detect removal commands
					const isRemoval = val === null || val === 'none' || val === 'remove' || val === 0 || val === '0' || val === 'square';
					
					switch (prop) {
						case 'padding': c = updatePadding(val, null, prefix); break;
						case 'margin': c = updateMargin(val, null, prefix); break;
						case 'spacing_preset': c = createResponsiveSpacing(val, prefix); break;
						case 'background_color': c = updateBackgroundColor(selectedBlock.clientId, val, selectedBlock.attributes); break;
						case 'border': 
							if (isRemoval) c = updateBorder(0, 'none', null, prefix);
							else if (typeof val === 'object') c = updateBorder(val.width, val.style, val.color, prefix);
							else {
								const parts = String(val).split(' ');
								if (parts.length >= 3) c = updateBorder(parseInt(parts[0]), parts[1], parts.slice(2).join(' '), prefix);
								else if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('var')) c = updateBorder(1, 'solid', val, prefix);
							}
							break;
						case 'border_radius': 
							// Normalize square/0/removal
							let rVal = isRemoval ? 0 : val;
							if (!isRemoval && (val === '0px' || parseInt(val) === 0)) rVal = 0;
							else if (!isRemoval && typeof val === 'string') {
								if (val.includes('subtle')) rVal = 8;
								else if (val.includes('soft')) rVal = 24;
								else if (val.includes('full')) rVal = 50;
								else rVal = parseInt(val) || 8;
							}
							c = updateBorderRadius(rVal, null, prefix); 
							break;
						case 'shadow':
						case 'box_shadow':
						case 'box-shadow':
							if (isRemoval) c = removeBoxShadow(prefix);
							else if (typeof val === 'object') c = updateBoxShadow(val.x, val.y, val.blur, val.spread, val.color, prefix);
							else c = { [`${prefix}box-shadow-general`]: val, [`${prefix}box-shadow-status-general`]: true };
							break;
						case 'width': c = updateWidth(val, String(val).includes('%') ? '' : 'px', prefix); break;
						case 'height': c = updateHeight(val, String(val).includes('%') ? '' : 'px', prefix); break;
						case 'objectFit':
						case 'object_fit': c = updateImageFit(val); break;
						case 'opacity': c = updateOpacity(val); break;
						// Typography properties
						case 'color':
						case 'text_color':
							c = updateTextColor(val);
							break;
						case 'font_size':
						case 'fontSize':
							c = updateFontSize(val);
							break;
						case 'font_weight':
						case 'fontWeight':
							c = updateFontWeight(val);
							break;
						// ======= BUTTON ACTIONS =======
						case 'button_style':
							if (selectedBlock.name.includes('button')) {
								if (val === 'outline') {
									c = {
										[`${prefix}background-active-media-general`]: 'none',
										[`${prefix}border-style-general`]: 'solid',
										[`${prefix}border-top-width-general`]: '2',
										[`${prefix}border-bottom-width-general`]: '2',
										[`${prefix}border-left-width-general`]: '2',
										[`${prefix}border-right-width-general`]: '2',
										[`${prefix}border-sync-width-general`]: 'all',
										[`${prefix}border-unit-width-general`]: 'px',
										[`${prefix}border-palette-status-general`]: true,
										[`${prefix}border-palette-color-general`]: 4,
									};
								} else if (val === 'solid') {
									c = {
										[`${prefix}background-active-media-general`]: 'color',
										[`${prefix}background-palette-status-general`]: true,
										[`${prefix}background-palette-color-general`]: 4,
										[`${prefix}border-style-general`]: 'none',
									};
								} else if (val === 'flat') {
									c = { [`${prefix}box-shadow-status-general`]: false };
								}
							}
							break;
						case 'button_icon':
							if (selectedBlock.name.includes('button')) {
								if (val === 'only') c = { 'icon-only': true };
								else if (val === 'none') {
                                    c = { 'icon-only': false, 'icon-content': '' };
                                }
							}
							break;
						case 'button_size':
							if (selectedBlock.name.includes('button')) {
								if (val === 'small') {
									c = {
										[`${prefix}padding-top-general`]: '8',
										[`${prefix}padding-bottom-general`]: '8',
										[`${prefix}padding-left-general`]: '16',
										[`${prefix}padding-right-general`]: '16',
										[`${prefix}font-size-general`]: 14,
									};
								} else if (val === 'large') {
									c = {
										[`${prefix}padding-top-general`]: '20',
										[`${prefix}padding-bottom-general`]: '20',
										[`${prefix}padding-left-general`]: '40',
										[`${prefix}padding-right-general`]: '40',
										[`${prefix}font-size-general`]: 20,
									};
								}
							}
							break;
					}
					return c;
				};

				// 1. Handle Special Actions
				if (action.payload?.special_action === 'APPLY_HOVER_ANIMATION') {
					const hoverChanges = applyHoverAnimation(selectedBlock.attributes, action.payload.shadow_value);
					if (Object.keys(hoverChanges).length > 0) {
						updateBlockAttributes(selectedBlock.clientId, hoverChanges);
					}
					return { executed: true, message: action.message || 'Applied hover animation.' };
				}

				// 2. Handle Payload (Object with multiple updates)
				if (action.payload) {
					const p = action.payload;
					const allChanges = {};
					
					Object.entries(p).forEach(([prop, val]) => {
						// Special handling for spacing object
						if (prop === 'spacing' && typeof val === 'object') {
							if (val.padding) Object.assign(allChanges, getChangesForSelection('padding', val.padding));
							if (val.margin) Object.assign(allChanges, getChangesForSelection('margin', val.margin));
						} else {
							const c = getChangesForSelection(prop, val);
							console.log('[Maxi AI Debug] getChangesForSelection result:', prop, val, '->', c);
							if (c) Object.assign(allChanges, c);
						}
					});

					console.log('[Maxi AI Debug] Final allChanges:', JSON.stringify(allChanges));
					console.log('[Maxi AI Debug] selectedBlock:', selectedBlock?.name, 'clientId:', selectedBlock?.clientId);
					if (Object.keys(allChanges).length > 0) {
						console.log('[Maxi AI Debug] Calling dispatch updateBlockAttributes with:', selectedBlock?.clientId, allChanges);
						// Use direct dispatch instead of hook to ensure the update goes through
						dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, allChanges);
						console.log('[Maxi AI Debug] dispatch updateBlockAttributes called successfully');
					}
				}

				// 3. Handle Direct Property/Value
				if (action.property && action.value !== undefined) {
					const c = getChangesForSelection(action.property, action.value);
					if (c) dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, c);
				}

				// 4. Trigger Sidebar Expand based on properties (Enhanced Selection Feedback)
				const targetProp = action.property || (action.payload ? Object.keys(action.payload)[0] : null);
				if (targetProp === 'padding' || targetProp === 'margin' || targetProp === 'responsive_padding' || action.payload?.spacing_preset) {
					openSidebarAccordion(0, 'dimension-panel');
				} else if (targetProp === 'box_shadow' || action.payload?.shadow) {
					openSidebarAccordion(0, 'shadow-panel');
				} else if (targetProp === 'border' || targetProp === 'border_radius' || action.payload?.border) {
					openSidebarAccordion(0, 'border-panel');
				}

				if (action.ui_target) {
					console.log('[Maxi AI] UI Target requested:', action.ui_target);
					// Map new IDs to existing sidebar logic
					// spacing-panel, dimension-panel, border-panel, shadow-panel, style-card-colors, style-card-typography
					
					const uiMap = {
						'spacing-panel': { panel: 'Margin / Padding', tab: 'Settings' },
						'dimension-panel': { panel: 'Dimension', tab: 'Settings' },
						'border-panel': { panel: 'Border', tab: 'Settings' },
						'shadow-panel': { panel: 'Box shadow', tab: 'Settings' },
						'shadow-panel-hover': { panel: 'Box shadow', tab: 'Settings', state: 'hover' }, // Logic hint
					};
					
					const mapping = uiMap[action.ui_target];
					if (mapping) {
						// Trigger sidebar open logic (reusing existing code or refactoring)
						// We can attach this metadata to the return and handle it in the main flow
						// Or verify if we can set "state" (hover/normal) programmatically?
						action.sidebarMapping = mapping; 
					}
				}

				if (action.payload || action.property) {
					// Handle UI Target trigger
					if (action.sidebarMapping) {
						const { panel, tab } = action.sidebarMapping;
						// Reuse the sidebar opening logic from previous implementation
						setTimeout(() => {
							const tabButtons = document.querySelectorAll('.maxi-tabs-control__button');
							for (const tabBtn of tabButtons) {
								if (tabBtn.textContent.trim().toLowerCase() === tab.toLowerCase()) {
									tabBtn.click();
									break;
								}
							}
							setTimeout(() => {
								const selectors = ['.maxi-accordion-control__item__button', '.maxi-accordion-control button', '[class*="accordion"] button', '.maxi-accordion-tab__item__button'];
								const labelParts = panel.split(/\s*\/\s*|\s+/).filter(p => p.length > 2);
								for (const selector of selectors) {
									const buttons = document.querySelectorAll(selector);
									for (const button of buttons) {
										const text = button.textContent.trim();
										if (labelParts.some(part => text.toLowerCase().includes(part.toLowerCase()))) {
											button.click();
											return;
										}
									}
								}
							}, 200);
						}, 300);
					}
					
					return { executed: true, message: action.message || 'Updated.' };
				}
				
				return { executed: true, message: action.message || 'No changes needed.' };
			} // End MODIFY_BLOCK


			// --- GLOBAL ACTIONS RESTORED ---
			// Handle both "update_page" and "UPDATE_PAGE" (case insensitive)
			const actionType = action.action?.toLowerCase();
			
			if (action.action === 'switch_viewport') {
				const device = action.value || 'Mobile';
				// Use WordPress data dispatch to switch viewport
				const { dispatch } = require('@wordpress/data');
				// Try both common stores for viewport switching
				try {
					dispatch('core/edit-post').__experimentalSetPreviewDeviceType(device);
				} catch (e) {
					try {
						dispatch('core/editor').setDeviceType(device);
					} catch (e2) {
						console.warn('Could not switch viewport', e2);
					}
				}
				return { executed: true, message: action.message || `Switched to ${device} view.` };
			}

			if (action.action === 'update_page') {
				let property = action.property;
				let value = action.value;
				
				// Handle AI returning payload wrapper (legacy fix)
				if (action.payload) {
					if (action.payload.shadow) {
						property = 'box_shadow';
						value = action.payload.shadow;
					} else if (action.payload.border_radius !== undefined) {
						property = 'border_radius';
						value = action.payload.border_radius;
					} else if (action.payload.padding !== undefined) {
						property = 'padding';
						value = action.payload.padding;
					}
				}
				
				console.log('[Maxi AI Debug] update_page action received:', property, value, 'target:', action.target_block);
				
				// Normalize border_radius values - AI sometimes sends wrong numbers
				if (property === 'border_radius') {
					// Parse numeric value or map keyword
					if (typeof value === 'string') {
						const lowerValue = value.toLowerCase();
						if (lowerValue.includes('subtle') || lowerValue === '8px') value = 8;
						else if (lowerValue.includes('soft') || lowerValue === '24px') value = 24;
						else if (lowerValue.includes('full') || lowerValue === '50px') value = 50;
						else if (lowerValue.includes('square') || lowerValue === '0px' || lowerValue === '0') value = 0;
						else {
							const parsed = parseInt(value);
							value = isNaN(parsed) ? 8 : parsed;
						}
					} else if (typeof value === 'number') {
						// value is already a number, leave as is
					} else {
						value = 8; // Default if unknown type
					}
					console.log('[Maxi AI Debug] Normalized border_radius to:', value);
				}
				
				const resultMsg = handleUpdatePage(property, value, action.target_block);
				console.log('[Maxi AI Debug] handleUpdatePage returned:', resultMsg);

				// EXPAND SIDEBAR based on property
				// This ensures "settings are showing" as requested by user
				if (property === 'responsive_padding' || property === 'padding' || property === 'margin') {
					openSidebarAccordion(0, 'dimension-panel');
				} else if (property === 'box_shadow') {
					openSidebarAccordion(0, 'shadow-panel');
				} else if (property === 'border_radius' || property === 'border') {
					openSidebarAccordion(0, 'border-panel');
				}

				return { executed: true, message: action.message || resultMsg };
			}

			if (action.action === 'apply_responsive_spacing') {
				const resultMsg = handleUpdatePage('apply_responsive_spacing', action.preset, action.target_block);
				
				// Ensure dimension panel is open for feedback
				openSidebarAccordion(0, 'dimension-panel');

				return { executed: true, message: action.message || resultMsg };
			}

			if (action.action === 'update_style_card') {
				const resultMsg = handleUpdateStyleCard(action.updates);
				return { executed: true, message: resultMsg };
			}

			if (action.action === 'apply_theme') {
				console.log('[Maxi AI Debug] handleApplyTheme called with:', action.prompt);
				const resultMsg = handleApplyTheme(action.theme, action.prompt);
				return { executed: true, message: resultMsg, openedStyleCard: true };
			}

			if (action.action === 'update_selection') {
				let property = action.property;
				let value = action.value;
				
				// Handle same payload wrapper if needed
				if (action.payload) {
					if (action.payload.shadow) { property = 'box_shadow'; value = action.payload.shadow; }
					else if (action.payload.border_radius !== undefined) { property = 'border_radius'; value = action.payload.border_radius; }
					else if (action.payload.padding !== undefined) { property = 'padding'; value = action.payload.padding; }
				}
				
				// Normalizations
				if (property === 'border_radius' && typeof value === 'string') {
					if (value.includes('subtle') || value === '8px') value = 8;
					else if (value.includes('soft') || value === '24px') value = 24;
					else if (value.includes('full') || value === '50px') value = 50;
					else if (value.includes('square') || value === '0px') value = 0;
					else value = parseInt(value) || 8;
				}

				const resultMsg = handleUpdateSelection(property, value, action.target_block);
				console.log('[Maxi AI Debug] handleUpdateSelection result:', resultMsg);

				// EXPAND SIDEBAR
				if (property === 'responsive_padding' || property === 'padding' || property === 'margin') openSidebarAccordion(0, 'dimension-panel');
				else if (property === 'box_shadow') openSidebarAccordion(0, 'shadow-panel');
				else if (property === 'border_radius' || property === 'border') openSidebarAccordion(0, 'border-panel');

				// Combine AI message with technical result if mismatch
				// If resultMsg says "No matching components", we should probably show that.
				let finalMessage = action.message || resultMsg;
				if (typeof resultMsg === 'string' && resultMsg.includes('No matching')) {
					finalMessage = `${action.message} (${resultMsg})`;
				}

				return { executed: true, message: finalMessage };
			}

			if (action.action === 'message') {
				return { executed: false, message: action.content, options: action.options };
			}

			// ... (rest of standard legacy handling if needed, or rely on prompt to strictly use new types)
			// Given the strict prompt, we might not need the old switch(action.action) block if the AI complies.
			// But sticking to the new schema is key.

			return {
				executed: true,
				message: action.message || 'Done.',
			};

		} catch (e) {
			console.error('Parse error:', e);
			return { executed: false, message: __('Error parsing AI response.', 'maxi-blocks') };
		}

	};

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage = input.trim();
		setInput('');
		setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
		
		// 0. SELECTION CHECK: If in Selection mode, enforce that a block MUST be selected
		if (scope === 'selection' && !selectedBlock) {
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: 'Please select a block on the page first so I know what to modify.',
					executed: false,
				},
			]);
			return;
		}

		// CLIENT-SIDE INTERCEPTION: Detect vague requests and show clarification immediately
		const lowerMessage = userMessage.toLowerCase();
		
		// Border requests - detect target from user message (exclude removal commands)
		if (lowerMessage.includes('border') && !lowerMessage.includes('radius') && !lowerMessage.includes('square') && !lowerMessage.includes('subtle') && !lowerMessage.includes('strong') && !lowerMessage.includes('brand') && !lowerMessage.includes('remove')) {
			// Detect what the user wants to target
			let target = null;
			if (lowerMessage.includes('image')) target = 'image';
			else if (lowerMessage.includes('button')) target = 'button';
			else if (lowerMessage.includes('container') || lowerMessage.includes('section')) target = 'container';
			
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: target ? `Which colour border for the ${target}s?` : 'Which colour border would you like?',
				options: ['palette'],
				optionsType: 'palette',
				colorTarget: 'border',
				targetContext: target, // Store the target for when user clicks an option
				executed: false
			}]);
			return;
		}
		
		// Shadow requests - detect target from user message (exclude removal commands)
		if (lowerMessage.includes('shadow') && !lowerMessage.includes('soft') && !lowerMessage.includes('crisp') && !lowerMessage.includes('bold') && !lowerMessage.includes('remove') && !lowerMessage.includes('no shadow')) {
			// Detect what the user wants to target
			let target = null;
			if (lowerMessage.includes('image')) target = 'image';
			else if (lowerMessage.includes('button')) target = 'button';
			else if (lowerMessage.includes('container') || lowerMessage.includes('section')) target = 'container';
			
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: target ? `Which colour box shadow for the ${target}s?` : 'Which colour box shadow would you like?',
				options: ['palette'],
				optionsType: 'palette',
				colorTarget: 'box-shadow',
				targetContext: target,
				executed: false
			}]);
			return;
		}
		
		// Spacing requests - detect target from user message
		if ((lowerMessage.includes('spacing') || lowerMessage.includes('space') || lowerMessage.includes('padding') || lowerMessage.includes('taller')) 
			&& !lowerMessage.includes('compact') && !lowerMessage.includes('comfortable') && !lowerMessage.includes('spacious') && !lowerMessage.includes('square')) {
			// Detect what the user wants to target
			let target = null;
			if (lowerMessage.includes('image')) target = 'image';
			else if (lowerMessage.includes('button')) target = 'button';
			else if (lowerMessage.includes('container') || lowerMessage.includes('section')) target = 'container';
			
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: target ? `How much spacing for the ${target}s?` : 'How much spacing would you like?',
				options: ['Compact', 'Comfortable', 'Spacious'],
				targetContext: target || 'container', // Default to container for spacing
				executed: false
			}]);
			return;
		}
		
		// Rounded corners requests - detect target from user message (exclude removal commands)
		if ((lowerMessage.includes('round') || lowerMessage.includes('corner') || lowerMessage.includes('radius')) 
			&& !lowerMessage.includes('subtle') && !lowerMessage.includes('soft') && !lowerMessage.includes('full') && !lowerMessage.includes('square') && !lowerMessage.includes('remove')) {
			// Detect what the user wants to target
			let target = null;
			if (lowerMessage.includes('image')) target = 'image';
			else if (lowerMessage.includes('button')) target = 'button';
			else if (lowerMessage.includes('container') || lowerMessage.includes('section')) target = 'container';
			
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: target ? `How rounded should the ${target} corners be?` : 'How rounded should the corners be?',
				options: ['Subtle (8px)', 'Soft (24px)', 'Full (50px)'],
				targetContext: target,
				executed: false
			}]);
			return;
		}
		
		// ICON LINE HOVER requests - show colour palette for stroke hover
		if (lowerMessage.includes('icon') && (lowerMessage.includes('line') || lowerMessage.includes('stroke')) && lowerMessage.includes('hover') && !lowerMessage.includes('remove')) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Which colour for the icon line hover?',
				options: ['palette'],
				optionsType: 'palette',
				colorTarget: 'icon-line-hover',
				executed: false
			}]);
			return;
		}
		
		// ICON FILL HOVER requests - show colour palette for fill hover
		if (lowerMessage.includes('icon') && lowerMessage.includes('hover') && !lowerMessage.includes('line') && !lowerMessage.includes('stroke') && !lowerMessage.includes('remove')) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Which colour for the icon fill hover?',
				options: ['palette'],
				optionsType: 'palette',
				colorTarget: 'icon-hover',
				executed: false
			}]);
			return;
		}

		// ALIGNMENT - "Center align everything" (Text vs Items)
		if (lowerMessage.includes('align') && lowerMessage.includes('center') && (lowerMessage.includes('everything') || lowerMessage.includes('all'))) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Would you like to align the text or the items?',
				options: ['Align Text', 'Align Items'],
				alignmentType: 'center',
				executed: false
			}]);
			return;
		}

		// ALIGNMENT - "Align everything" (Generic)
		if (lowerMessage.includes('align') && (lowerMessage.includes('everything') || lowerMessage.includes('all')) && !lowerMessage.includes('left') && !lowerMessage.includes('right') && !lowerMessage.includes('center')) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'How would you like to align everything?',
				options: ['Align Left', 'Align Center', 'Align Right'],
				executed: false
			}]);
			return;
		}

		// ICON LINE WIDTH requests - show width presets
		if (lowerMessage.includes('icon') && lowerMessage.includes('line') && lowerMessage.includes('width') && !lowerMessage.includes('remove')) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'What line width would you like for the icons?',
				options: ['Thin', 'Medium', 'Thick'],
				lineWidthTarget: 'icon',
				executed: false
			}]);
			return;
		}
		
		// COLOR requests - show palette swatches (exclude width requests)
		if ((lowerMessage.includes('color') || lowerMessage.includes('colour')) 
			&& (lowerMessage.includes('icon') || lowerMessage.includes('fill') || lowerMessage.includes('stroke') || lowerMessage.includes('line'))
			&& !lowerMessage.includes('width')
			&& !lowerMessage.includes('remove')) {
			// Determine if fill or stroke
			const isStroke = lowerMessage.includes('stroke') || lowerMessage.includes('line') || lowerMessage.includes('border');
			
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: isStroke ? 'Which colour for the icon stroke?' : 'Which colour for the icon fill?',
				options: ['palette'],
				optionsType: 'palette',
				colorTarget: isStroke ? 'stroke' : 'fill',
				executed: false
			}]);
			return;
		}
		
		// DIRECT ACTION: "Make it square" / "remove rounded corners" / "remove border radius"
		if (lowerMessage.includes('square') || (lowerMessage.includes('remove') && (lowerMessage.includes('round') || lowerMessage.includes('radius')))) {
			setIsLoading(true);
			const directAction = scope === 'selection' 
				? { action: 'update_selection', property: 'border_radius', value: 0, message: 'Removed rounded corners from selected block.' }
				: { action: 'update_page', property: 'border_radius', value: 0, message: 'Removed rounded corners.' };
			
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
			return;
		}
		
			// DIRECT ACTION: "Remove shadow" / "no shadow"
		if (lowerMessage.includes('remove') && lowerMessage.includes('shadow') || lowerMessage.includes('no shadow')) {
			setIsLoading(true);
			const directAction = scope === 'selection'
				? { action: 'update_selection', property: 'box_shadow', value: 'none', message: 'Removed shadow from selected block.' }
				: { action: 'update_page', property: 'box_shadow', value: 'none', message: 'Removed shadows.' };
			
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
			return;
		}
		
			// DIRECT ACTION: "Remove border"
		if (lowerMessage.includes('remove') && lowerMessage.includes('border') && !lowerMessage.includes('radius')) {
			setIsLoading(true);
			const directAction = scope === 'selection'
				? { action: 'update_selection', property: 'border', value: 'none', message: 'Removed border from selected block.' }
				: { action: 'update_page', property: 'border', value: 'none', message: 'Removed borders.' };
			
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
			return;
		}

		// ============================================================
		// LAYOUT INTENT INTERCEPTION (Lookup Table Pattern Matching)
		// ============================================================
		// Uses LAYOUT_PATTERNS constant for zero-latency, maintainable pattern matching
		
		for (const pattern of LAYOUT_PATTERNS) {
			if (lowerMessage.match(pattern.regex)) {
				setIsLoading(true);
				
				// SPECIAL: Aesthetic patterns use apply_theme for global style changes
				if (pattern.property === 'aesthetic') {
					const directAction = {
						action: 'apply_theme',
						prompt: `Apply ${pattern.value} style: ${lowerMessage}`,
						message: pattern.pageMsg
					};
					setTimeout(async () => {
						const result = await parseAndExecuteAction(directAction);
						setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
						setIsLoading(false);
					}, 50);
					return;
				}
				
				// SPECIAL: Create block patterns - search Cloud Library and insert
				if (pattern.property === 'create_block') {
					setMessages(prev => [...prev, { role: 'assistant', content: 'Searching Cloud Library...' }]);
					
					setTimeout(async () => {
						try {
							const searchQuery = extractPatternQuery(userMessage);
							console.log('[Maxi AI] Searching Cloud Library for:', searchQuery);
							
							const patternResult = await findBestPattern(searchQuery);
							
							if (!patternResult) {
								setMessages(prev => [...prev, { 
									role: 'assistant', 
									content: `I couldn't find a pattern for "${searchQuery}" in the Cloud Library. Try browsing the Cloud Library manually or use different keywords.`,
									executed: false 
								}]);
								setIsLoading(false);
								return;
							}
							
							if (patternResult.isPro) {
								setMessages(prev => [...prev, { 
									role: 'assistant', 
									content: `Found "${patternResult.title}" but it's a Pro pattern. Upgrade to MaxiBlocks Pro to use it!`,
									executed: false 
								}]);
								setIsLoading(false);
								return;
							}
							
							// Insert the pattern - clientId of selected block or null for append
							const targetClientId = selectedBlock?.clientId || null;
							
							if (targetClientId && patternResult.gutenbergCode) {
								await onRequestInsertPattern(
									patternResult.gutenbergCode,
									false,  // usePlaceholderImage
									true,   // useSCStyles
									targetClientId
								);
								
								setMessages(prev => [...prev, { 
									role: 'assistant', 
									content: `✨ Created "${patternResult.title}"! The pattern has been inserted.`,
									executed: true 
								}]);
							} else {
								setMessages(prev => [...prev, { 
									role: 'assistant', 
									content: `Found "${patternResult.title}" but please select a block first to replace with this pattern.`,
									executed: false 
								}]);
							}
						} catch (error) {
							console.error('[Maxi AI] Pattern insert error:', error);
							setMessages(prev => [...prev, { 
								role: 'assistant', 
								content: 'Sorry, there was an error creating the pattern. Please try again.',
								executed: false 
							}]);
						}
						setIsLoading(false);
					}, 100);
					return;
				}
				
				// SPECIAL: Colour clarification - show 8-colour palette picker
				if (pattern.property === 'color_clarify') {
					// Detect what kind of colour operation (background, text, border, etc.)
					let colorTarget = 'element';
					if (lowerMessage.includes('background') || lowerMessage.includes('bg')) colorTarget = 'background';
					else if (lowerMessage.includes('text') || lowerMessage.includes('heading') || lowerMessage.includes('font')) colorTarget = 'text';
					else if (lowerMessage.includes('button')) colorTarget = 'button';
					else if (lowerMessage.includes('border')) colorTarget = 'border';
					
					setMessages(prev => [...prev, { 
						role: 'assistant', 
						content: `Choose a colour for the ${colorTarget}:`,
						options: ['Colour 1', 'Colour 2', 'Colour 3', 'Colour 4', 'Colour 5', 'Colour 6', 'Colour 7', 'Colour 8'],
						colorTarget: colorTarget,
						originalMessage: userMessage,
						isColorPicker: true
					}]);
					setIsLoading(false);
					return;
				}
				
				// Standard pattern handling
				const directAction = scope === 'selection'
					? { action: 'update_selection', property: pattern.property, value: pattern.value, message: pattern.selectionMsg }
					: { action: 'update_page', property: pattern.property, value: pattern.value, target_block: pattern.target || 'container', message: pattern.pageMsg };
				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}
		}
		
		// SPECIAL: Gap with number extraction (not in lookup table)
		const gapMatch = lowerMessage.match(/(\d+)\s*(?:px)?\s*(?:gap|gutter|air\s*between|space\s*between\s*items)/i);
		if (gapMatch) {
			const gapValue = parseInt(gapMatch[1]);
			setIsLoading(true);
			const directAction = scope === 'selection'
				? { action: 'update_selection', property: 'gap', value: gapValue, message: `Applied ${gapValue}px gap between items.` }
				: { action: 'update_page', property: 'gap', value: gapValue, target_block: 'container', message: `Applied ${gapValue}px gap to containers.` };
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
			return;
		}
		
		// SPECIAL: Gap clarification (add gaps without number)
		if (lowerMessage.match(/add\s*(gap|gutter)|gap\s*between|gutter\s*between/) && !gapMatch) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'How much gap would you like between items?',
				options: ['Small (10px)', 'Medium (20px)', 'Large (40px)'],
				gapTarget: scope === 'selection' ? 'selection' : 'container',
				executed: false
			}]);
			return;
		}

		setIsLoading(true);

		try {
			// Build context with scope info
			let context = '';
			context += `\n\nUSER INTENT SCOPE: ${scope.toUpperCase()}`;
			context += `\n- SELECTION: Apply change only to the selected block.`;
			context += `\n- PAGE: Apply change to all relevant blocks on the entire page (use update_page).`;
			context += `\n- GLOBAL: Apply change to the site-wide Style Card (MUST use apply_theme action).`;
			context += `\n\nIMPORTANT: The user has explicitly selected to apply changes to "${scope.toUpperCase()}".`;
			
			if (scope === 'global') {
				context += `\nYou MUST respond with the apply_theme action for any design change request.`;
				context += `\nExample: { "action": "apply_theme", "prompt": "${userMessage}" }`;
			} else if (scope === 'selection') {
				context += `\n\nCRITICAL: You are in SELECTION mode. You MUST use the "update_selection" action.`;
				context += `\nThis targets the selected block AND its inner blocks (recursively).`;
				context += `\nDo not use update_page (would affect unselected) or apply_responsive_spacing (use update_selection instead).`;
			} else if (scope === 'page') {
				context += `\n\nCRITICAL: You are in PAGE mode. You SHOULD use "update_page" or "apply_responsive_spacing" to affect multiple blocks if requested.`;
			}

			if (selectedBlock) {
				context += `\n\nUser has selected: ${selectedBlock.name}\nAttributes: ${JSON.stringify(selectedBlock.attributes, null, 2)}`;
			} else {
				context += '\n\nNo block is currently selected.';
			}

			// Add Style Card Context
			if (activeStyleCard) {
				// Use light mode colors as reference
				const colors = activeStyleCard.light?.styleCard?.color || {};
				const colorContext = Object.entries(colors)
					.filter(([k]) => k.startsWith('color-'))
					.map(([k, v]) => `${k}: ${v}`)
					.join(', ');
				
				if (colorContext) {
					context += `\n\nCurrent Style Card Colors: ${colorContext}\n(Use these keys to update global colors)`;
				}
			}

			const response = await fetch(`${window.wpApiSettings?.root || '/wp-json/'}maxi-blocks/v1.0/ai/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(window.wpApiSettings?.nonce ? { 'X-WP-Nonce': window.wpApiSettings.nonce } : {}),
				},
				body: JSON.stringify({
					messages: [
						{ role: 'system', content: SYSTEM_PROMPT },
						{ role: 'system', content: 'Context: ' + context + (selectedBlock ? '\n\nBlock Skills: ' + getSkillContextForBlock(selectedBlock.name) : '') },
						...messages.filter(m => m.role !== 'assistant' || !m.executed).slice(-6).map(m => ({ 
							role: m.role === 'assistant' ? 'assistant' : 'user', 
							content: m.content 
						})),
						{ role: 'user', content: userMessage },
					],
					model: 'gpt-4o-mini',
					temperature: 0.2, // Low temperature for consistent JSON
					streaming: false,
				}),
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const data = await response.json();
			let assistantContent = data?.choices?.[0]?.message?.content || __('Sorry, I couldn\'t process that.', 'maxi-blocks');
			
			// Debug: Log what the AI returned
			console.log('[Maxi AI] Raw AI response:', assistantContent);

			// 4. Force apply_theme for global scope if AI didn't use it
			if (scope === 'global') {
				try {
					const parsed = JSON.parse(assistantContent.trim());
					if (parsed.action && parsed.action !== 'apply_theme' && parsed.action !== 'message') {
						console.log('[Maxi AI] Forcing apply_theme for global scope');
						assistantContent = JSON.stringify({ action: 'apply_theme', prompt: userMessage });
					}
				} catch (e) {
					// If not JSON, create apply_theme action
					console.log('[Maxi AI] Non-JSON response, creating apply_theme for global scope');
					assistantContent = JSON.stringify({ action: 'apply_theme', prompt: userMessage });
				}
			}

			// 5. SELECTION SCOPE VALIDATION (Optional: You could validate `update_selection` usage here but better to trust the prompt + fallback)
			// (Removed old coercion to MODIFY_BLOCK - we now support `update_selection` natively)


			const { executed, message, options } = await parseAndExecuteAction(assistantContent);
			console.log('[Maxi AI] Parsed action result:', { executed, message, options });

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: message,
					options,
					executed,
				},
			]);
		} catch (error) {
			console.error('AI Chat error:', error);
			
			// Attempt to show a more helpful error message
			let errorMessage = __('Error: Please check your OpenAI API key in Maxi AI settings.', 'maxi-blocks');
			if (error.message) {
				// Don't show entire HTML responses if something crashed badly
				if (error.message.includes('<') && error.message.includes('>')) {
					errorMessage = __('Server Error: Recieved HTML instead of JSON. Check server logs.', 'maxi-blocks');
				} else if (error.message.length < 150) {
					errorMessage = `Error: ${error.message}`;
				}
			}

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: errorMessage,
					isError: true,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleSuggestion = async suggestion => {
		// INTERCEPTION: Check for Presets to bypass AI Latency/Hallucination
		let directAction = null;
		
		// Get target context from the last clarification message (if any)
		const lastClarificationMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.options);
		const targetContext = lastClarificationMsg?.targetContext;

		// 1. ROUNDED CORNERS
		if (suggestion.includes('Subtle (8px)')) directAction = { action: 'update_page', property: 'border_radius', value: 8, target_block: targetContext, message: 'Applied Subtle rounded corners (8px).' };
		else if (suggestion.includes('Soft (24px)')) directAction = { action: 'update_page', property: 'border_radius', value: 24, target_block: targetContext, message: 'Applied Soft rounded corners (24px).' };
		else if (suggestion.includes('Full (50px)')) directAction = { action: 'update_page', property: 'border_radius', value: 50, target_block: targetContext, message: 'Applied Full rounded corners (50px).' };
		
		// 2. RESPONSIVE SPACING
		// Uses dedicated createResponsiveSpacing function for consistent breakpoint handling
		// Action type 'apply_responsive_spacing' signals special handling in parseAndExecuteAction
		else if (suggestion === 'Compact') directAction = { action: 'apply_responsive_spacing', preset: 'compact', target_block: targetContext || 'container', message: 'Applied Compact spacing across all breakpoints.' };
		else if (suggestion === 'Comfortable') directAction = { action: 'apply_responsive_spacing', preset: 'comfortable', target_block: targetContext || 'container', message: 'Applied Comfortable spacing across all breakpoints.' };
		else if (suggestion === 'Spacious') directAction = { action: 'apply_responsive_spacing', preset: 'spacious', target_block: targetContext || 'container', message: 'Applied Spacious spacing across all breakpoints.' };

		// 3. SHADOW & GLOW - Handled by two-step flow (color selection → style selection)
		// Old direct handlers removed - see section 9 for the new context-aware handler
		else if (suggestion === 'Brand Glow') directAction = { action: 'update_page', property: 'box_shadow', value: { x:0, y:10, blur:25, spread:-5, color: 'var(--highlight)' }, target_block: targetContext, message: 'Applied Brand Glow (using theme variable).' };

		// 4. THEME BORDERS - now respects targetContext
		else if (suggestion === 'Subtle Border') directAction = { action: 'update_page', property: 'border', value: { width: 1, style: 'solid', color: 'var(--p)' }, target_block: targetContext, message: targetContext ? `Applied Subtle Border to all ${targetContext}s.` : 'Applied Subtle Border.' };
		else if (suggestion === 'Strong Border') directAction = { action: 'update_page', property: 'border', value: { width: 3, style: 'solid', color: 'var(--h1)' }, target_block: targetContext, message: targetContext ? `Applied Strong Border to all ${targetContext}s.` : 'Applied Strong Border.' };
		else if (suggestion === 'Brand Border') directAction = { action: 'update_page', property: 'border', value: { width: 2, style: 'solid', color: 'var(--highlight)' }, target_block: targetContext, message: targetContext ? `Applied Brand Border to all ${targetContext}s.` : 'Applied Brand Border.' };

		// 5. GHOST BUTTON
		else if (suggestion === 'Ghost Button') directAction = { action: 'update_page', property: 'border', value: { width: 2, style: 'solid', color: 'var(--highlight)' }, message: 'Applied Ghost Button style.' }; // Note: Background transp handling requires complex logic or separate action. Keeping simple for now relative to border.

		// 6. MOBILE REVIEW
		else if (suggestion === 'Yes, show me' || suggestion === 'Display Mobile') directAction = { action: 'switch_viewport', value: 'Mobile', message: 'Switched to mobile view.' };


		// 7. PALETTE & CUSTOM COLOR SELECTION
		else if (/^Color .+$/.test(suggestion)) {
			// Extract ID part (can be number or string for custom)
			const idPart = suggestion.replace('Color ', '');
			
			let colorValue = null;
			let isPalette = false;

			// Check if standard palette 1-8
			const paletteNum = parseInt(idPart);
			// Check if it's strictly a number 1-8. If idPart is "custom-1", parseInt might be NaN or partial match.
			// Better check: is it a valid integer AND in range?
			if (!isNaN(paletteNum) && String(paletteNum) === idPart && paletteNum >= 1 && paletteNum <= 8) {
				colorValue = paletteNum;
				isPalette = true;
			} else {
				// Try to find in custom colors
				const customColor = customColors.find(c => String(c.id) === idPart);
				if (customColor) {
					colorValue = customColor.value; // Use the HEX/String value
				} else {
					console.warn('Maxi AI: Unknown color ID:', idPart);
					colorValue = 4; // Fallback to highlight
					isPalette = true;
				}
			}

			const prevMsg = messages.findLast(m => m.colorTarget);
			
			if (prevMsg?.colorTarget === 'border') {
				// Don't apply immediately - ask for border style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which border style?',
					options: ['Solid Normal', 'Solid Fat', 'Dashed Normal', 'Dashed Fat', 'Dotted Normal', 'Dotted Fat'],
					borderColorChoice: colorValue,
					targetContext: prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else if (prevMsg?.colorTarget === 'box-shadow') {
				// Don't apply immediately - ask for shadow style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which shadow style?',
					options: ['Soft', 'Medium', 'Hard'],
					shadowColorChoice: colorValue,
					targetContext: prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else {
				// ICON COLORS
				// For icons, we need to handle Palette vs Custom slightly differently if the helper expects int vs string
				// updateSvgFillColor helper: if value is number, uses palette. If string? It currently might not support it well.
				// Let's check updateSvgFillColor implementation.
				// Lines ~1260 use: const paletteNum = typeof value === 'number' ? value : parseInt(value) || 4;
				// This implies it ONLY supports palette numbers.
				// We should fix the case handler in applyUpdatesToBlocks to allow string values for icons too.
				
				const target = prevMsg?.colorTarget;
				let property = '';
				let msgText = '';
				
				if (target === 'icon-line-hover') { property = 'svg_line_color_hover'; msgText = 'icon line hover colour'; }
				else if (target === 'icon-hover') { property = 'svg_fill_color_hover'; msgText = 'icon fill hover colour'; }
				else if (target === 'stroke') { property = 'svg_line_color'; msgText = 'icon stroke colour'; }
				else { property = 'svg_fill_color'; msgText = 'icon fill colour'; }

				directAction = { 
					action: 'update_page', 
					property, 
					value: colorValue, 
					target_block: 'svg-icon',
					message: `Applied ${isPalette ? 'Colour ' + colorValue : 'Custom Colour'} as ${msgText}.` 
				};
			}
		}

		// ALIGNMENT OPTIONS
		else if (['Align Text', 'Align Items'].includes(suggestion)) {
			const prevMsg = messages.findLast(m => m.alignmentType);
			const alignVal = prevMsg?.alignmentType || 'center';
			
			if (suggestion === 'Align Text') {
				directAction = { action: 'update_page', property: 'text_align', value: alignVal, message: `Aligned all text ${alignVal}.` };
			} else {
				directAction = { action: 'update_page', property: 'align_items', value: alignVal, message: `Aligned all items ${alignVal}.` };
			}
		}
		else if (['Align Left', 'Align Center', 'Align Right'].includes(suggestion)) {
			const alignVal = suggestion.replace('Align ', '').toLowerCase();
			directAction = { action: 'update_page', property: 'align_everything', value: alignVal, message: `Aligned everything ${alignVal}.` };
		}

		// GAP SIZE PRESETS (from layout intent clarification)
		else if (suggestion === 'Small (10px)') {
			const prevMsg = messages.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 10, message: 'Applied small gap (10px).' }
				: { action: 'update_page', property: 'gap', value: 10, target_block: 'container', message: 'Applied small gap (10px) to containers.' };
		}
		else if (suggestion === 'Medium (20px)') {
			const prevMsg = messages.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 20, message: 'Applied medium gap (20px).' }
				: { action: 'update_page', property: 'gap', value: 20, target_block: 'container', message: 'Applied medium gap (20px) to containers.' };
		}
		else if (suggestion === 'Large (40px)') {
			const prevMsg = messages.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 40, message: 'Applied large gap (40px).' }
				: { action: 'update_page', property: 'gap', value: 40, target_block: 'container', message: 'Applied large gap (40px) to containers.' };
		}

		// 8. BORDER STYLE PRESETS
		else if (['Solid Normal', 'Solid Fat', 'Dashed Normal', 'Dashed Fat', 'Dotted Normal', 'Dotted Fat'].includes(suggestion)) {
			const prevMsg = messages.findLast(m => m.borderColorChoice !== undefined);
			const borderColor = prevMsg?.borderColorChoice || 1;
			const targetBlock = prevMsg?.targetContext;
			
			const styleMap = {
				'Solid Normal': { width: 1, style: 'solid' },
				'Solid Fat': { width: 2, style: 'solid' },
				'Dashed Normal': { width: 1, style: 'dashed' },
				'Dashed Fat': { width: 2, style: 'dashed' },
				'Dotted Normal': { width: 1, style: 'dotted' },
				'Dotted Fat': { width: 2, style: 'dotted' }
			};
			
			const style = styleMap[suggestion];
			
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';

			directAction = {
				action: actionType,
				property: 'border',
				value: { ...style, color: borderColor },
				target_block: targetBlock,
				message: targetBlock ? `Applied ${suggestion} border to all ${targetBlock}s.` : `Applied ${suggestion} border.`
			};
		}

		// 9. SHADOW STYLE PRESETS - Only trigger if we have a shadow color choice in context
		else if (['Soft', 'Medium', 'Hard'].includes(suggestion)) {
			const prevMsg = messages.findLast(m => m.shadowColorChoice !== undefined);
			// Only handle as shadow preset if we have shadow context
			if (prevMsg?.shadowColorChoice !== undefined) {
				const shadowColor = prevMsg.shadowColorChoice;
				const targetBlock = prevMsg?.targetContext;

			const styleMap = {
				'Soft': { x: 0, y: 10, blur: 30, spread: -10, opacity: 50 },
				'Medium': { x: 0, y: 15, blur: 50, spread: -15 },
				'Hard': { x: 10, y: 10, blur: 0, spread: 0 }
			};

			const style = styleMap[suggestion];
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';

			directAction = {
				action: actionType,
				property: 'box_shadow',
				value: { ...style, color: shadowColor },
				target_block: targetBlock,
				message: targetBlock ? `Applied ${suggestion} shadow to all ${targetBlock}s.` : `Applied ${suggestion} shadow.`
			};
			} // Close inner if (prevMsg?.shadowColorChoice)
		} // Close else if (['Soft', 'Medium', 'Hard'])

		// 10. ICON LINE WIDTH PRESETS
		else if (['Thin', 'Medium', 'Thick'].includes(suggestion)) {
			const prevMsg = messages.findLast(m => m.lineWidthTarget !== undefined);
			// Only handle as line width preset if we have line width context
			if (prevMsg?.lineWidthTarget === 'icon') {
				const widthMap = {
					'Thin': 1,
					'Medium': 1.9,
					'Thick': 4
				};
				const strokeWidth = widthMap[suggestion];
				directAction = {
					action: 'update_page',
					property: 'svg_stroke_width',
					value: strokeWidth,
					target_block: 'svg-icon',
					message: `Applied ${suggestion} line width to all icons.`
				};
			}
		}

		if (directAction && scope === 'selection') {
			// Convert Page actions to Selection actions if we are in Selection tab
			if (directAction.action === 'update_page' || directAction.action === 'apply_responsive_spacing') {
				directAction.action = 'update_selection';
				directAction.message = directAction.message.replace('all', 'selected').replace('page', 'selection');
			}
		}

		if (directAction) {
			// Add User Message immediately
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setInput(''); // Clear input if any
            
			// Execute Action with fake loading for UX
            setIsLoading(true);
            
			// Use small delay to allow UI to update
			setTimeout(async () => {
			    try {
					console.log('[Maxi AI Intercept] Executing direct action:', directAction);
					const result = await parseAndExecuteAction(directAction);
					
					// Determine options for success message
					let nextOptions = undefined;
					if (directAction.property === 'responsive_padding') nextOptions = ['Yes, show me', 'No, thanks'];
					
					// Add AI Message
					setMessages(prev => [...prev, { 
						role: 'assistant', 
						content: result.message, 
						options: nextOptions,
						executed: true 
					}]);
				} catch (e) {
					console.error('Direct action failed:', e);
					setMessages(prev => [...prev, { role: 'assistant', content: 'Error executing action.', isError: true }]);
				} finally {
					setIsLoading(false);
				}
            }, 600); 
			return;
		}

		// Fallback: Just set input for manual sending (or generic prompts)
		setInput(suggestion);
	};

	if (!isOpen) return null;

	return (
		<div className='maxi-ai-chat-panel'>
			<div className='maxi-ai-chat-panel__header'>
				<h3>
					<span>✨</span>
					{__('Maxi AI', 'maxi-blocks')}
					{selectedBlock && `: ${selectedBlock.name
						.replace('maxi-blocks/', '')
						.replace('-maxi', '')
						.split('-')
						.map(word => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ')}`}
				</h3>
				<div className='maxi-ai-chat-panel__scope-options'>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'page' ? 'is-active' : ''}`}
						onClick={() => setScope('page')}
						title={__('Apply changes to the entire page', 'maxi-blocks')}
					>
						{__('Page', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'selection' ? 'is-active' : ''}`}
						onClick={() => setScope('selection')}
						title={__('Apply changes only to the selected block', 'maxi-blocks')}
					>
						{__('Selection', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'global' ? 'is-active' : ''}`}
						onClick={() => setScope('global')}
						title={__('Apply changes globally via Style Cards', 'maxi-blocks')}
					>
						{__('Style Card', 'maxi-blocks')}
					</button>
				</div>
				<button className='maxi-ai-chat-panel__close' onClick={onClose}>
					×
				</button>
			</div>



			<div className='maxi-ai-chat-panel__messages'>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`maxi-ai-chat-panel__message maxi-ai-chat-panel__message--${msg.role}${msg.isError ? ' maxi-ai-chat-panel__message--error' : ''}`}
					>
						{msg.content}
						{msg.options && (
							<div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
								{msg.optionsType === 'palette' ? (
									<>
										{/* Standard Palette Colors (1-8) */}
										{getPaletteColors().map((color, i) => (
											<button
												key={`std-${i}`}
												onClick={() => handleSuggestion(`Color ${i + 1}`)}
												className='maxi-ai-chat-panel__palette-swatch'
												style={{ backgroundColor: color }}
												title={`Color ${i + 1}`}
											/>
										))}
										
										{/* Divider if needed, or just append */}
										
										{/* Custom Colors */}
										{customColors && customColors.length > 0 && customColors.map((cc) => (
											<button
												key={`custom-${cc.id}`}
												onClick={() => handleSuggestion(`Color ${cc.id}`)}
												className='maxi-ai-chat-panel__palette-swatch maxi-ai-chat-panel__palette-swatch--custom'
												style={{ backgroundColor: cc.value }}
												title={cc.name || `Custom Color ${cc.id}`}
											/>
										))}
									</>
								) : (
									// Standard text button options
									msg.options.map((opt, i) => (
										<button
											key={i}
											onClick={() => handleSuggestion(opt)}
											className='maxi-ai-chat-panel__option-button'
										>
											{opt}
										</button>
									))
								)}
							</div>
						)}
						{msg.executed && (
							<div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
								<span style={{ fontSize: '11px', opacity: 0.8 }}>
									{msg.undone ? '↩ ' + __('Undone', 'maxi-blocks') : '✓ ' + __('Applied', 'maxi-blocks')}
								</span>
								{!msg.undone && (
									<button
										className='maxi-ai-chat-panel__undo'
										onClick={handleUndo}
										title={__('Undo changes', 'maxi-blocks')}
									>
										{__('Undo', 'maxi-blocks')}
									</button>
								)}
							</div>
						)}
					</div>
				))}
				{isLoading && (
					<div className='maxi-ai-chat-panel__message maxi-ai-chat-panel__message--assistant'>
						<div className='maxi-ai-chat-panel__typing'>
							<span />
							<span />
							<span />
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className='maxi-ai-chat-panel__input-area'>
				<input
					type='text'
					className='maxi-ai-chat-panel__input'
					placeholder={selectedBlock ? __('Ask Maxi...', 'maxi-blocks') : __('How can I help?', 'maxi-blocks')}
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={isLoading}
				/>
				<button
					className='maxi-ai-chat-panel__send'
					onClick={sendMessage}
					disabled={isLoading || !input.trim()}
				>
					<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
						<path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default AIChatPanel;
