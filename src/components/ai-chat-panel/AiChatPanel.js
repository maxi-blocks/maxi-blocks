/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { dispatch, select, useDispatch, useSelect, useRegistry } from '@wordpress/data';
import { cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import './editor.scss';
import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import { handleSetAttributes } from '@extensions/maxi-block';
import getCustomFormatValue from '@extensions/text/formats/getCustomFormatValue';
import { getLastBreakpointAttribute } from '@extensions/styles';
import { getSkillContextForBlock, getAllSkillsContext } from './skillContext';
import { findBestPattern, extractPatternQuery } from './patternSearch';
import { findBestIcon, findIconCandidates, extractIconQuery, extractIconQueries, extractIconStyleIntent, stripIconStylePhrases } from './iconSearch';
import { AI_BLOCK_PATTERNS, getAiHandlerForBlock, getAiHandlerForTarget, getAiPromptForBlockName } from './ai/registry';
import {
	buildContainerMetaAttributeChanges,
	getContainerMetaSidebarTarget,
} from './ai/utils/containerMeta';
import {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
} from './ai/utils/containerAGroup';
import {
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
} from './ai/utils/containerBGroup';
import {
	buildContainerCGroupAction,
	buildContainerCGroupAttributeChanges,
	getContainerCGroupSidebarTarget,
} from './ai/utils/containerCGroup';
import {
	buildContainerDGroupAction,
	buildContainerDGroupAttributeChanges,
	getContainerDGroupSidebarTarget,
} from './ai/utils/containerDGroup';
import {
	buildContainerEGroupAction,
	buildContainerEGroupAttributeChanges,
	getContainerEGroupSidebarTarget,
} from './ai/utils/containerEGroup';
import {
	buildContainerFGroupAction,
	buildContainerFGroupAttributeChanges,
	getContainerFGroupSidebarTarget,
} from './ai/utils/containerFGroup';
import {
	buildContainerHGroupAction,
	buildContainerHGroupAttributeChanges,
	getContainerHGroupSidebarTarget,
} from './ai/utils/containerHGroup';
import {
	buildContainerLGroupAction,
	buildContainerLGroupAttributeChanges,
	getContainerLGroupSidebarTarget,
} from './ai/utils/containerLGroup';
import {
	buildContainerMGroupAction,
	buildContainerMGroupAttributeChanges,
	getContainerMGroupSidebarTarget,
} from './ai/utils/containerMGroup';
import STYLE_CARD_MAXI_PROMPT from './ai/prompts/style-card';
import { STYLE_CARD_PATTERNS, useStyleCardData, createStyleCardHandlers, buildStyleCardContext } from './ai/style-card';
import onRequestInsertPattern from '../../editor/library/utils/onRequestInsertPattern';

const CONTAINER_BLOCK_INTENT_MAPPING_MODULE = [
	'### MODULE: CONTAINER BLOCK INTENT MAPPING',
	'Map these container-related requests to the Container block property names used by the AI handler.',
	'',
	'#### 1. WIDTH & LAYOUT ("Wide", "Narrow", "Full Width", "Boxed")',
	'* **Target Properties:** `width`, `max_width`, `full_width`',
	'* **Clarification Presets:**',
	'    * **A (Standard Boxed):** "Standard boxed content (1170px)."',
	'        * Action: set `full_width: false`, `width: "1170px"`',
	'    * **B (Narrow Reading):** "Narrow centered column (700px)."',
	'        * Action: set `full_width: false`, `width: "700px"`',
	'    * **C (Full Width):** "Edge-to-edge full width."',
	'        * Action: set `full_width: true`',
	'* **UI Target:** `dimension-panel`',
	'',
	'#### 2. BACKGROUND & STYLE ("Color", "Image", "Gradient")',
	'* **Target Properties:** `background_color`, `opacity`',
	'* **Clarification Presets:**',
	'    * **A (Theme Color):** "Apply Brand Background."',
	'        * Action: set `background_color: "var(--bg-2)"`',
	'    * **B (Dark Mode):** "Inverted Dark Background."',
	'        * Action: set `background_color: "var(--h1)"`',
	'    * **C (Glass):** "Glassmorphism (Translucent)."',
	'        * Action: set `background_color: "rgba(255,255,255,0.1)"`, optional `opacity: 0.9`',
	'* **UI Target:** `background-layer`',
	'',
	'#### 3. SHAPE DIVIDERS ("Wave", "Curve", "Slant", "Divider")',
	'* **Target Properties:** `shape_divider_top`, `shape_divider_bottom`',
	'* **Clarification:** "Where do you want the shape divider?"',
	'    * **A (Top):** "Add a Wave to the Top."',
	'        * Action: set `shape_divider_top: "wave"`',
	'    * **B (Bottom):** "Add a Curve to the Bottom."',
	'        * Action: set `shape_divider_bottom: "curve"`',
	'    * **C (Both):** "Add Slants to Top & Bottom."',
	'        * Action: set `shape_divider_top: "slant"`, `shape_divider_bottom: "slant"`',
	'* **UI Target:** `shape-divider-panel`',
	'',
	'#### 4. CONTEXT LOOP / DYNAMIC CONTENT ("Loop", "Query", "Repeater")',
	'* **Target Property:** `context_loop`',
	'* **Action:** This turns the container into a Loop Provider (like a Query Loop).',
	'* **Clarification Presets:**',
	'    * **A (Recent Posts):** "Loop recent Blog Posts."',
	'        * Action: `context_loop: { status: true, type: "post", perPage: 6 }`',
	'    * **B (Products):** "Loop WooCommerce Products."',
	'        * Action: `context_loop: { status: true, type: "product", perPage: 8 }`',
	'    * **C (Related):** "Loop Related Posts (Same Category)."',
	'        * Action: `context_loop: { status: true, relation: "related" }`',
	'* **Ordering & Filters:**',
	'    * "Newest first" -> `context_loop: { orderBy: "date", order: "desc" }`',
	'    * "Oldest first" -> `context_loop: { orderBy: "date", order: "asc" }`',
	'    * "Alphabetical A-Z" -> `context_loop: { orderBy: "title", order: "asc" }`',
	'    * "Random order" -> `context_loop: { orderBy: "rand" }`',
	'* **UI Target:** `context-loop-panel`',
	'',
	'#### 4.1 PAGINATION ("Pagination", "Page numbers", "Load more")',
	'* **Target Properties:** `pagination`, `pagination_type`, `pagination_show_pages`, `pagination_style`, `pagination_spacing`, `pagination_text`, `pagination_load_more_label`',
	'* **Enable:** "Add pagination." -> `pagination: true`',
	'* **Pagination Type Presets:**',
	'    * Numbers -> `pagination_type: "numbers"`',
	'    * Load More -> `pagination_type: "load_more"`',
	'    * Prev/Next only -> `pagination_type: "simple"`',
	'* **Load More label:** "Set load more text to Load more posts." -> `pagination_load_more_label: "Load more posts"`',
	'* **Vibe Presets:**',
	'    * Minimal text links -> `pagination_style: "minimal"`',
	'    * Boxed buttons -> `pagination_style: "boxed"`',
	'    * Pill buttons -> `pagination_style: "pills"`',
	'* **Spacing:** "Space out page numbers to 20px." -> `pagination_spacing: "20px"`',
	'* **Labels:** "Set pagination next text to Next >." -> `pagination_text: { next: "Next >" }`',
	'* **UI Target:** `context-loop-panel`',
	'',
	'#### 4.2 ADVANCED FILTERS ("Filter by author", "Specific IDs")',
	'* **Target Property:** `context_loop`',
	'* **Presets:**',
	'    * Filter by author -> `context_loop: { relation: "by-author", author: 12 }`',
	'    * Specific post ID -> `context_loop: { relation: "by-id", id: 123 }`',
	'* **Note:** Exclude-current is not supported yet; ask for clarification.',
	'* **UI Target:** `context-loop-panel`',
	'',
	'#### 4.3 DISPLAY ("Show", "Hide", "Display")',
	'* **Target Property:** `display`',
	'* **Examples:**',
	'    * "Hide this container." -> `display: "none"`',
	'    * "Show this container." -> `display: "flex"`',
	'    * "Set display to block." -> `display: "block"`',
	'* **UI Target:** `layout-flex-panel`',
	'',
	'#### 4.4 CUSTOM CLASSES ("CSS class", "Extra class")',
	'* **Target Property:** `extra_class_name`',
	'* **Examples:**',
	'    * "Add CSS class hero-section." -> `extra_class_name: "hero-section"`',
	'    * "Set custom classes to hero featured." -> `extra_class_name: "hero featured"`',
	'* **UI Target:** `add css classes` (Advanced tab)',
	'',
	'#### 4.5 FLEX SIZING ("Flex basis", "Flex grow", "Flex shrink")',
	'* **Target Properties:** `flex_basis`, `flex_grow`, `flex_shrink`',
	'* **Examples:**',
	'    * "Set flex basis to 40%." -> `flex_basis: "40%"`',
	'    * "Set flex grow to 1." -> `flex_grow: 1`',
	'    * "Set flex shrink to 0." -> `flex_shrink: 0`',
	'* **UI Target:** `flexbox` (Advanced tab)',
	'',
	'#### 4.6 ASPECT RATIO ("Force aspect ratio")',
	'* **Target Property:** `force_aspect_ratio`',
	'* **Examples:**',
	'    * "Force aspect ratio." -> `force_aspect_ratio: true`',
	'    * "Disable aspect ratio lock." -> `force_aspect_ratio: false`',
	'* **UI Target:** `size` (Advanced tab)',
	'',
	'#### 4.7 HEIGHT ("Height", "Tall")',
	'* **Target Property:** `height`',
	'* **Examples:**',
	'    * "Set height to 420px." -> `height: "420px"`',
	'    * "Set tablet height to 320px." -> `height: { value: 320, unit: "px", breakpoint: "m" }`',
	'* **UI Target:** `height / width`',
	'',
	'#### 4.8 CONTAINER LINKS ("Make clickable", "Link card")',
	'* **Target Properties:** `link_settings`, `dc_link`',
	'* **Presets:**',
	'    * Simple URL -> `link_settings: { url: "https://example.com", target: "_self", rel: "" }`',
	'    * External (New tab + nofollow) -> `link_settings: { url: "https://example.com", target: "_blank", rel: "nofollow noopener" }`',
	'    * Dynamic (Current post) -> `dc_link: { status: true, target: "entity" }`',
	'* **UI Target:** `link` (toolbar)',
	'',
	'#### 5. SPACING & MARGINS ("Padding", "Section Height", "Space")',
	'* **Target Property:** `responsive_padding`',
	'* **Responsive Logic:** always provide desktop/tablet/mobile values.',
	'* **Clarification Presets:**',
	'    * **A (Compact):** "Tight section (60px)."',
	'        * Action: `responsive_padding: { desktop: "60px", tablet: "40px", mobile: "20px" }`',
	'    * **B (Standard):** "Regular section (100px)."',
	'        * Action: `responsive_padding: { desktop: "100px", tablet: "60px", mobile: "40px" }`',
	'    * **C (Hero):** "Tall Hero section (180px)."',
	'        * Action: `responsive_padding: { desktop: "180px", tablet: "110px", mobile: "80px" }`',
	'* **UI Target:** `spacing-panel`',
	'',
	'#### 6. VISIBILITY & SCROLL EFFECTS ("Sticky", "Hide on mobile", "Fade in")',
	'* **Target Properties:** `position`, `position_top`, `z_index`, `display_mobile`, `scroll_fade`',
	'* **Clarification Presets:**',
	'    * **A (Sticky):** "Stick to top when scrolling."',
	'        * Action: set `position: "sticky"`, `position_top: "0px"`, `z_index: 100`',
	'    * **B (Mobile Hidden):** "Hide this container on phones."',
	'        * Action: set `display_mobile: "none"`',
	'    * **C (Fade In):** "Animate in when scrolled to."',
	'        * Action: set `scroll_fade: true`',
	'* **UI Target:** `advanced-panel` (or scroll effects)',
	'',
	'### Suggested "Quick Action" Chips for Container',
	'',
	'Add these to your UI when a Container block is selected:',
	'',
	'1. **"Make it full width"** (Triggers Layout Preset C)',
	'2. **"Add top wave divider"** (Triggers Shape Divider Preset A)',
	'3. **"Turn into Post Loop"** (Triggers Context Loop Preset A)',
	'4. **"Increase section padding"** (Triggers Spacing Preset C)',
	'5. **"Hide on mobile"** (Sets `display_mobile: none`)',
].join('\n');

const FLEX_LAYOUT_INTENT_MAPPING_MODULE = [
	'### MODULE: FLEX LAYOUT INTENT MAPPING',
	'Map "human" layout requests to the Flexbox properties used by the AI handler.',
	'',
	'#### 1. ALIGNMENT ("Center", "Middle", "Align")',
	'* **Target Properties:** `justify_content`, `align_items_flex`, `dead_center`',
	'* **Clarification Presets:**',
	'    * **A (Dead Center):** "Center everything perfectly in the middle."',
	'        * Action: set `dead_center: true`',
	'    * **B (Spread Apart):** "Push items to the far edges (Left & Right)."',
	'        * Action: set `justify_content: "space-between"`, `align_items_flex: "center"`',
	'    * **C (Top Left):** "Reset to top-left corner."',
	'        * Action: set `justify_content: "flex-start"`, `align_items_flex: "flex-start"`',
	'* **UI Target:** `layout-flex-panel`',
	'',
	'#### 2. DIRECTION ("Stack", "Row", "Column", "Side by Side")',
	'* **Target Property:** `flex_direction`',
	'* **Clarification Presets:**',
	'    * **A (Side-by-Side):** "Put items in a horizontal Row."',
	'        * Action: set `flex_direction: "row"`',
	'    * **B (Stack Vertical):** "Stack items in a vertical Column."',
	'        * Action: set `flex_direction: "column"`',
	'    * **C (Reverse):** "Flip the order (Swap Left/Right)."',
	'        * Action: set `flex_direction: "row-reverse"`',
	'* **UI Target:** `layout-flex-panel`',
	'',
	'#### 3. SPACING / GAP ("Space between", "Gap", "Breathing room")',
	'* **Target Property:** `gap` (number, px)',
	'* **Clarification Presets:**',
	'    * **A (Tight):** "Small 10px gap."',
	'        * Action: set `gap: 10`',
	'    * **B (Standard):** "Regular 30px gap."',
	'        * Action: set `gap: 30`',
	'    * **C (Wide):** "Large 60px gap."',
	'        * Action: set `gap: 60`',
	'* **UI Target:** `spacing-panel`',
	'',
	'#### 4. WRAPPING ("Wrap", "Fit on screen", "Multi-line")',
	'* **Target Property:** `flex_wrap`',
	'* **Clarification:** "If items run out of space, should they drop to the next line?"',
	'    * **A (Wrap):** "Yes, drop to next line (Multi-line)."',
	'        * Action: set `flex_wrap: "wrap"`',
	'    * **B (Squeeze):** "No, keep them on one line (Scroll/Squish)."',
	'        * Action: set `flex_wrap: "nowrap"`',
	'* **UI Target:** `layout-flex-panel`',
	'',
	'#### 5. STRETCHING ("Full Height", "Stretch items", "Equal Height")',
	'* **Target Property:** `align_items_flex`',
	'* **Clarification Presets:**',
	'    * **A (Stretch):** "Force all items to be the same height."',
	'        * Action: set `align_items_flex: "stretch"`',
	'    * **B (Natural):** "Let items be their natural size."',
	'        * Action: set `align_items_flex: "flex-start"`',
	'* **UI Target:** `layout-flex-panel`',
	'',
	'### Suggested "Quick Action" Chips for Flex Containers',
	'',
	'Add these to your UI when a Flex Container (Row/Column) is selected:',
	'',
	'1. **"Center Everything"** (Triggers Alignment Preset A)',
	'2. **"Stack Vertically"** (Triggers Direction Preset B)',
	'3. **"Push to Edges"** (Triggers Alignment Preset B - Space Between)',
	'4. **"Equal Height Items"** (Sets `align_items_flex: stretch`)',
	'5. **"Add Space Between"** (Triggers Gap Preset B)',
].join('\n');

const SYSTEM_PROMPT = `CRITICAL RULE: You MUST respond ONLY with valid JSON. NEVER respond with plain text.

### SCOPE RULES
- USER INTENT SCOPE "SELECTION": Use update_selection for selected block and its contents.
- USER INTENT SCOPE "PAGE": Use update_page for all matching blocks on page.
- USER INTENT SCOPE "GLOBAL":
  - Use update_style_card for specific Style Card token changes (typography, palette slots, heading/body/button fonts, sizes).
  - Use apply_theme only for overall aesthetic/theme/vibe or palette generation.

### BLOCK TARGETING
Include "target_block" when user mentions specific types:
- "all images" / "the images" ' target_block: "image"
- "all sections" / "containers" ' target_block: "container"

### INTENT MAPPING
1. "Round/Rounded/Corners" ' property: border_radius
2. "Shadow/Depth/Pop" ' property: box_shadow
3. "Space/Breathing Room/Padding" ' property: responsive_padding
4. "More space/Less cramped" ' property: responsive_padding

### RESPONSIVE SPACING PROTOCOL (CRITICAL)
When changing padding/margin/spacing, NEVER apply a single large value. Always use responsive_padding with auto-scaled values for all devices.

**Spacing presets:**
{"action":"CLARIFY","message":"How much spacing would you like?","options":[{"label":"Compact"},{"label":"Comfortable"},{"label":"Spacious"},{"label":"Remove"}]}

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
{"action":"CLARIFY","message":"What style of shadow would you like?","options":[{"label":"Soft"},{"label":"Crisp"},{"label":"Bold"},{"label":"Glow"}]}

When user says "make rounded" or "round corners":
{"action":"CLARIFY","message":"How rounded should the corners be?","options":[{"label":"Subtle (8px)"},{"label":"Soft (24px)"},{"label":"Full (50px)"}]}

When user says "add space" or "more padding":
{"action":"CLARIFY","message":"How much vertical spacing would you like?","options":[{"label":"Compact"},{"label":"Comfortable"},{"label":"Spacious"},{"label":"Remove"}]}

### THEME-AWARE RULES (CRITICAL)
- **Theme Border:** use "var(--p)" (Subtle), "var(--h1)" (Strong), "var(--highlight)" (Brand).
- **Brand Glow:** Use "box_shadow" with color "var(--highlight)".
- **Invert Section:** Set background "var(--h1)", color "white".

### OPTION TRIGGER MAPPING (CRITICAL)
IF user selects/types these options, YOU MUST use the corresponding property:
 
- "Compact" / "Comfortable" / "Spacious" -> ACTION: update_page, PROPERTY: responsive_padding
- "Remove" -> ACTION: update_page, PROPERTY: padding (set to 0) or margin (set to 0 if margin context)
- "Subtle (8px)" / "Soft (24px)" / "Full (50px)" -> ACTION: update_page, PROPERTY: border_radius
- "Soft" / "Crisp" / "Bold" / "Glow" / "Brand Glow" -> ACTION: update_page, PROPERTY: box_shadow
- "Subtle Border" / "Strong Border" / "Brand Border" -> ACTION: update_page, PROPERTY: border


### WHEN TO APPLY DIRECTLY
Only when user specifies EXACT style/preset name:
- "Soft shadow" ' Apply directly
- "Comfortable spacing" ' Apply responsive_padding directly
- "Subtle corners" ' Apply directly

### CRITICAL: NEVER ASSUME DEFAULTS
If user says "add shadow" (generic), DO NOT apply Soft shadow. ASK FIRST.
If user says "make rounded" (generic), DO NOT apply Subtle. ASK FIRST.
You MUST show the buttons for generic requests.

### VALUES
Shadow Soft: {"x":0,"y":10,"blur":30,"spread":0}
Shadow Crisp: {"x":0,"y":2,"blur":4,"spread":0}
Shadow Bold: {"x":0,"y":20,"blur":25,"spread":-5}
Shadow Glow: {"x":0,"y":0,"blur":15,"spread":2}
Rounded Subtle: 8, Soft: 24, Full: 50

### ACTION SCHEMAS

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

${CONTAINER_BLOCK_INTENT_MAPPING_MODULE}

${FLEX_LAYOUT_INTENT_MAPPING_MODULE}

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
	// EMERGENCY PRIORITY RULE

	// GROUP 1: DIRECTIONAL INTENT (flex-direction)
	{ regex: /side\s*by\s*side|horizontal(?!ly)|in\s*a\s*line|beside\s*(each\s*other)?|next\s*to\s*(each\s*other)?/, property: 'flex_direction', value: 'row', selectionMsg: 'Arranged items side by side (row layout).', pageMsg: 'Arranged containers horizontally.' },
	{ regex: /stack(ed)?|vertical(?!ly)|one\s*on\s*top|underneath|on\s*top\s*of|column\s*layout/, property: 'flex_direction', value: 'column', selectionMsg: 'Stacked items vertically (column layout).', pageMsg: 'Arranged containers in a stack.' },
	{ regex: /backwards?|right\s*to\s*left|reverse.*horizontal|flip.*order/, property: 'flex_direction', value: 'row-reverse', selectionMsg: 'Reversed horizontal order (row-reverse).', pageMsg: 'Reversed horizontal order.' },
	{ regex: /bottom\s*up|reverse.*vertical|reverse.*stack|upwards?\s*stack/, property: 'flex_direction', value: 'column-reverse', selectionMsg: 'Reversed vertical order (column-reverse).', pageMsg: 'Reversed vertical order.' },
	
	// GROUP 2: JUSTIFY CONTENT (main axis distribution)
	{ regex: /spread.*wall|space\s*between|first.*last.*edge|push.*apart|stretch.*apart|push.*edges|edges.*apart|to.*edges/, property: 'justify_content', value: 'space-between', selectionMsg: 'Spread items to edges (space-between).', pageMsg: 'Applied space-between layout.' },
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
	{ regex: /dead\s*cent(er|re)|perfect(ly)?\s*cent(er|re)(ed)?|absolute(ly)?\s*cent(er|re)|center.*everything|everything.*center/, property: 'dead_center', value: true, selectionMsg: 'Perfectly centred items (horizontally + vertically).', pageMsg: 'Dead-centred all containers.' },
	{ regex: /fill.*remaining|fill.*rest|take.*rest|expand.*fill|grow.*space|use.*remaining/, property: 'flex_grow', value: 1, selectionMsg: 'Set to fill remaining space (flex-grow: 1).', pageMsg: 'Set containers to fill remaining space.' },
	{ regex: /don'?t\s*shrink|no\s*shrink|keep.*fixed|fixed\s*size|prevent.*shrink/, property: 'flex_shrink', value: 0, selectionMsg: 'Prevented shrinking (flex-shrink: 0).', pageMsg: 'Prevented containers from shrinking.' },
	
	// GROUP 6: STACKING & POSITION
	{ regex: /bring.*front|put.*top|on\s*top|overlap|layer.*top|above.*other/, property: 'stacking', value: { zIndex: 10, position: 'relative' }, selectionMsg: 'Brought to front (z-index: 10).', pageMsg: 'Brought containers to front.' },
	{ regex: /send.*back|put.*behind|behind.*everything|layer.*back|below.*other/, property: 'stacking', value: { zIndex: -1, position: 'relative' }, selectionMsg: 'Sent to back (z-index: -1).', pageMsg: 'Sent containers to back.' },
	{ regex: /make.*sticky|sticky|follow.*scroll|stay.*scroll|stick.*top/, property: 'position', value: 'sticky', selectionMsg: 'Made sticky (follows scroll).', pageMsg: 'Made containers sticky.' },
	{ regex: /float.*corner|fixed\s*position|stay.*corner|pin.*corner|always\s*visible/, property: 'position', value: 'fixed', selectionMsg: 'Fixed to viewport (always visible).', pageMsg: 'Fixed containers to viewport.' },
	
	// GROUP 6.5: CALLOUT ARROW
	{ regex: /\b(callout|container|section)\s*arrow\b|\barrow\s*(?:on|at)\s*boundary\b|\bshow\s+(?:the\s+)?callout\s+arrow\b/i, property: 'arrow_status', value: true, selectionMsg: 'Enabled callout arrow.', pageMsg: 'Enabled callout arrows.', target: 'container' },
	{ regex: /\bhide\s+(?:the\s+)?callout\s+arrow\b|\bdisable\s+(?:the\s+)?callout\s+arrow\b/i, property: 'arrow_status', value: false, selectionMsg: 'Callout arrow hidden.', pageMsg: 'Callout arrows hidden.', target: 'container' },
	
	// GROUP 7: VISIBILITY
	{ regex: /hide\s*(this|it)?(?!.*mobile)(?!.*arrow)|make.*invisible(?!.*arrow)|disappear(?!.*arrow)|display.*none(?!.*arrow)|remove.*view(?!.*arrow)/, property: 'display', value: 'none', selectionMsg: 'Hidden from view (display: none).', pageMsg: 'Hidden containers.' },
	{ regex: /show\s*(this|it)?(?!.*mobile)(?!.*arrow)|make.*visible(?!.*arrow)|appear(?!.*arrow)|unhide(?!.*arrow)|display.*block(?!.*arrow)/, property: 'display', value: 'flex', selectionMsg: 'Made visible (display: flex).', pageMsg: 'Made containers visible.' },
	
	// GROUP 8: GAP CONTROL (special handling - remove only, add has clarification)
	{ regex: /remove\s*gap|no\s*gap|zero\s*gap|remove\s*gutter/, property: 'gap', value: 0, selectionMsg: 'Removed gaps between items.', pageMsg: 'Removed gaps from containers.' },
	
	// GROUP 9: OPACITY & TRANSPARENCY
	{ regex: /see.*through|transparent|ghostly|translucent|opacity.*half|semi.*transparent/, property: 'opacity', value: 0.5, selectionMsg: 'Made semi-transparent (opacity: 0.5).', pageMsg: 'Made containers semi-transparent.' },
	{ regex: /fade.*out.*complete|fully.*transparent|invisible|opacity.*zero|completely.*transparent/, property: 'opacity', value: 0, selectionMsg: 'Made fully transparent (opacity: 0).', pageMsg: 'Made containers invisible.' },
	{ regex: /fully.*opaque|not.*transparent|opacity.*full|remove.*transparency/, property: 'opacity', value: 1, selectionMsg: 'Made fully opaque (opacity: 1).', pageMsg: 'Restored full opacity.' },
	
	// GROUP 10: TRANSFORM EFFECTS
	{ regex: /tilt|askew|skew|slant/, property: 'transform_rotate', value: 5, selectionMsg: 'Tilted element (rotate: 5deg).', pageMsg: 'Tilted containers.' },
	{ regex: /rotate|spin|turn.*degrees/, property: 'transform_rotate', value: 45, selectionMsg: 'Rotated element (45deg).', pageMsg: 'Rotated containers.' },
	{ regex: /flip.*horizontal|mirror\s*(?:horizontally|vertically|image|this|that|the\s+(?:layout|section|block|container|element))\b/i, property: 'transform_scale', value: { x: -1, y: 1 }, selectionMsg: 'Flipped horizontally.', pageMsg: 'Flipped containers horizontally.' },
	{ regex: /flip.*vertical|upside.*down/, property: 'transform_scale', value: { x: 1, y: -1 }, selectionMsg: 'Flipped vertically.', pageMsg: 'Flipped containers vertically.' },
	{ regex: /zoom.*hover|bigger.*hover|enlarge.*hover|scale.*hover|grow.*hover/, property: 'transform_scale_hover', value: 1.1, selectionMsg: 'Added zoom on hover (scale: 1.1).', pageMsg: 'Added hover zoom effect.' },
	
	// GROUP 11: SCROLL EFFECTS
	{ regex: /fade.*scroll|scroll.*fade|entrance.*fade|fade.*in.*scroll/, property: 'scroll_fade', value: true, selectionMsg: 'Added scroll fade-in effect.', pageMsg: 'Added scroll fade to containers.' },
	{ regex: /parallax|slow.*background|background.*slower/, property: 'parallax', value: true, selectionMsg: 'Added parallax effect.', pageMsg: 'Added parallax to backgrounds.' },
	
	// GROUP 12: AESTHETIC STYLES (triggers apply_theme via special handling)
	...STYLE_CARD_PATTERNS,
	
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
	{ regex: /\bbackground\s*(?:colou?r|color)\b|\bbg\s*(?:colou?r|color)\b/i, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?' },
	{ regex: /(make|change|set|turn|paint|color|colour|give).*(red|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey|dark|light)|(\bred|blue|green|yellow|orange|purple|pink|teal|cyan|black|white|gray|grey)\b.*(background|text|heading|container|box|section|color|colour)/, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?' },
	{ regex: /\b(change|set|switch|update)\b.*\b(colou?r|color)\b|\b(colou?r|color)\b.*\b(change|set|switch|update)\b/i, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour from your palette?', pageMsg: 'Which colour from your palette?' },
	
	// GROUP 14: BACKGROUNDS & MEDIA
	{ regex: /video.*behind|movie.*behind|background.*video/, property: 'background_media', value: 'video', selectionMsg: 'Set video as background.', pageMsg: 'Applied video background.' },
	{ regex: /darken.*screen|overlay|dim.*background|dark.*overlay/, property: 'background_overlay', value: 0.5, selectionMsg: 'Added dark overlay (50%).', pageMsg: 'Darkened background with overlay.' },
	{ regex: /zoom.*photo|fill.*container|cover.*image|fit.*cover/, property: 'object_fit', value: 'cover', selectionMsg: 'Set image to cover container.', pageMsg: 'Applied cover fit to images.' },
	{ regex: /contain.*image|show.*whole|fit.*contain/, property: 'object_fit', value: 'contain', selectionMsg: 'Set image to contain.', pageMsg: 'Applied contain fit to images.' },
	{ regex: /pattern.*texture|tile.*background|repeat.*background|honeycomb/, property: 'background_tile', value: true, selectionMsg: 'Added tiled pattern.', pageMsg: 'Applied repeating pattern.' },
	
	// GROUP 15: SHAPES & DIVIDERS
	{ regex: /wave.*(top.*bottom|both)|(?:top.*bottom|both).*wave/, property: 'shape_divider_both', value: 'wave', selectionMsg: 'Added wave shape dividers to top and bottom.', pageMsg: 'Applied wave dividers to top and bottom.' },
	{ regex: /wave.*top|top.*wave|wavy.*top/, property: 'shape_divider_top', value: 'wave', selectionMsg: 'Added wave shape divider to the top.', pageMsg: 'Applied wave divider to the top.' },
	{ regex: /wave.*bottom|bottom.*wave|wavy.*bottom/, property: 'shape_divider_bottom', value: 'wave', selectionMsg: 'Added wave shape divider to the bottom.', pageMsg: 'Applied wave divider to the bottom.' },
	{ regex: /wavy.*edge|wave.*divider/, property: 'shape_divider_bottom', value: 'wave', selectionMsg: 'Added wave shape divider.', pageMsg: 'Applied wave divider.' },
	{ regex: /curve.*(top.*bottom|both)|(?:top.*bottom|both).*curve/, property: 'shape_divider_both', value: 'curve', selectionMsg: 'Added curve shape dividers to top and bottom.', pageMsg: 'Applied curve dividers to top and bottom.' },
	{ regex: /curve.*top|top.*curve/, property: 'shape_divider_top', value: 'curve', selectionMsg: 'Added curve shape divider to the top.', pageMsg: 'Applied curve divider to the top.' },
	{ regex: /curve.*bottom|bottom.*curve/, property: 'shape_divider_bottom', value: 'curve', selectionMsg: 'Added curve shape divider to the bottom.', pageMsg: 'Applied curve divider to the bottom.' },
	{ regex: /curve.*divider/, property: 'shape_divider_bottom', value: 'curve', selectionMsg: 'Added curve shape divider.', pageMsg: 'Applied curve divider.' },
	{ regex: /slant.*(top.*bottom|both)|(?:top.*bottom|both).*slant|angle.*(top.*bottom|both)|(?:top.*bottom|both).*angle/, property: 'shape_divider_both', value: 'slant', selectionMsg: 'Added slant shape dividers to top and bottom.', pageMsg: 'Applied slant dividers to top and bottom.' },
	{ regex: /slant.*top|top.*slant|angle.*top/, property: 'shape_divider_top', value: 'slant', selectionMsg: 'Added slant shape divider to the top.', pageMsg: 'Applied slant divider to the top.' },
	{ regex: /slant.*bottom|bottom.*slant|angle.*bottom/, property: 'shape_divider_bottom', value: 'slant', selectionMsg: 'Added slant shape divider to the bottom.', pageMsg: 'Applied slant divider to the bottom.' },
	{ regex: /slant.*edge|angle.*divider/, property: 'shape_divider_bottom', value: 'slant', selectionMsg: 'Added slant shape divider.', pageMsg: 'Applied slant divider.' },
	{ regex: /triangle.*(top.*bottom|both)|(?:top.*bottom|both).*triangle/, property: 'shape_divider_both', value: 'triangle', selectionMsg: 'Added triangle shape dividers to top and bottom.', pageMsg: 'Applied triangle dividers to top and bottom.' },
	{ regex: /triangle.*top|top.*triangle/, property: 'shape_divider_top', value: 'triangle', selectionMsg: 'Added triangle shape divider to the top.', pageMsg: 'Applied triangle divider to the top.' },
	{ regex: /triangle.*bottom|bottom.*triangle/, property: 'shape_divider_bottom', value: 'triangle', selectionMsg: 'Added triangle shape divider to the bottom.', pageMsg: 'Applied triangle divider to the bottom.' },
	{ regex: /triangle.*edge/, property: 'shape_divider_bottom', value: 'triangle', selectionMsg: 'Added triangle shape divider.', pageMsg: 'Applied triangle divider.' },
	{ regex: /cut.*triangle|triangle.*shape|clip.*triangle/, property: 'clip_path', value: 'polygon(50% 0%, 0% 100%, 100% 100%)', selectionMsg: 'Cut into triangle shape.', pageMsg: 'Applied triangle clip.' },
	{ regex: /cut.*circle|circle.*shape|round.*clip/, property: 'clip_path', value: 'circle(50%)', selectionMsg: 'Cut into circle shape.', pageMsg: 'Applied circle clip.' },
	{ regex: /cut.*diamond|diamond.*shape/, property: 'clip_path', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', selectionMsg: 'Cut into diamond shape.', pageMsg: 'Applied diamond clip.' },
	
	// GROUP 16: CONSTRAINTS & SIZING
	{ regex: /don'?t.*too.*wide|max.*width|limit.*width|constrain.*width/, property: 'max_width', value: 1200, selectionMsg: 'Constrained max width.', pageMsg: 'Limited maximum width.' },
	{ regex: /full.*width|stretch.*wide|100.*width/, property: 'full_width', value: true, selectionMsg: 'Set to full width.', pageMsg: 'Made containers full width.' },
	{ regex: /minimum.*height|at.*least.*tall|min.*height/, property: 'min_height', value: 400, selectionMsg: 'Set minimum height.', pageMsg: 'Applied minimum height.' },
	
	// GROUP 17: ROW PATTERNS
	{ regex: /zig.*zag|alternate|stagger|every.*other/, property: 'row_pattern', value: 'alternating', selectionMsg: 'Applied alternating row pattern.', pageMsg: 'Created zig-zag layout.' },
	{ regex: /masonry|pinterest|grid.*flow/, property: 'row_pattern', value: 'masonry', selectionMsg: 'Applied masonry layout.', pageMsg: 'Created masonry grid.' },
	
	// GROUP 18: RELATIVE SIZING (+/-20% adjustment)
	{ regex: /\b(bigger|larger)\b.*\b(text|font|heading|title|subtitle|headline|paragraph|body\s*text)\b|\b(text|font|heading|title|subtitle|headline|paragraph|body\s*text)\b.*\b(bigger|larger)\b|\bincrease\b.*\bfont\b|\b(text|font)\s*size\b.*\bincrease\b|\bincrease\b.*\b(text|font)\s*size\b/, property: 'font_size_relative', value: 1.2, selectionMsg: 'Increased font size by 20% across all breakpoints.', pageMsg: 'Enlarged text across all breakpoints.' },
	{ regex: /\b(smaller|tinier)\b.*\b(text|font|heading|title|subtitle|headline|paragraph|body\s*text)\b|\b(text|font|heading|title|subtitle|headline|paragraph|body\s*text)\b.*\b(smaller|tinier)\b|\b(decrease|reduce)\b.*\bfont\b|\b(text|font)\s*size\b.*\b(decrease|reduce)\b|\b(decrease|reduce)\b.*\b(text|font)\s*size\b|\breduce\b.*\btext\b/, property: 'font_size_relative', value: 0.8, selectionMsg: 'Decreased font size by 20% across all breakpoints.', pageMsg: 'Reduced text size across all breakpoints.' },
	{ regex: /bigger(?!.*hover)|larger|increase.*size|more.*size|scale.*up/, property: 'relative_size', value: 1.2, selectionMsg: 'Increased size by 20%.', pageMsg: 'Scaled up by 20%.' },
	{ regex: /smaller|reduce.*size|decrease.*size|less.*size|scale.*down/, property: 'relative_size', value: 0.8, selectionMsg: 'Decreased size by 20%.', pageMsg: 'Scaled down by 20%.' },
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
	
	// GROUP 24: CLOUD ICON SEARCH (Typesense)
	{ regex: /\b(icon|icons)\b.*\b(cloud|library)\b|\b(cloud|library)\b.*\bicon(s)?\b|\b(?:change|swap|replace|use|set|add|insert|make)\b[^.]*\bicons?\b[^.]*\b(?:to|with|as|of|for|called|named)\b\s+[^,.;]+|\bicons?\b\s*(?:to|with|as|of|for|called|named)\b\s+[^,.;]+|\b(?:use|set|add|insert|make|change|swap|replace)\b\s+(?:the\s+|a\s+|an\s+)?[^,.;]+?\s+icons?\b|\b(?:change|swap|replace|use|set|add|insert|make)\b\s+(?:to\s+)?(?:a\s+|an\s+|the\s+)?(?:different|another|alternative|new|other)\s+[^,.;]+|\ball\s+icons?\b|\b(?:theme|style|vibe|look)\b|\bmatch\b[^.]*\b(text|titles?|labels?|headings?)\b[^.]*\bicons?\b|\b(text|titles?|labels?|headings?)\b[^.]*\bmatch\b[^.]*\bicons?\b/i, property: 'cloud_icon', value: 'typesense', selectionMsg: 'Searching Cloud Library for icons...', pageMsg: 'Searching Cloud Library for icons...' },

	// GROUP 25: BLOCK ACTIONS (Imported)
	...AI_BLOCK_PATTERNS,

	// GROUP 26: CREATE BLOCK PATTERNS (from Cloud Library)
	// Must include pattern-related keywords to avoid matching style changes like "make button red"
	{ regex: /(create|make|add|insert|build|generate)\s+(a\s+|an\s+|me\s+a\s+)?(pricing|hero|testimonial|contact|feature|team|gallery|footer|header|nav|cta|about|services|portfolio|faq|blog|card|grid|section|template|pattern|layout)/i, property: 'create_block', value: 'cloud_library', pageMsg: 'Creating pattern from Cloud Library...' },
];

const ACTION_PROPERTY_ALIASES = {
	justifyContent: 'justify_content',
	alignItems: 'align_items_flex',
	alignItemsFlex: 'align_items_flex',
	alignContent: 'align_content',
	flexDirection: 'flex_direction',
	flexWrap: 'flex_wrap',
	rowGap: 'gap',
	columnGap: 'column_gap',
	arrowStatus: 'arrow_status',
	arrowSide: 'arrow_side',
	arrowPosition: 'arrow_position',
	arrowWidth: 'arrow_width',
	anchorLink: 'anchor_link',
	ariaLabel: 'aria_label',
	advancedCss: 'advanced_css',
	advancedCSS: 'advanced_css',
	customCss: 'custom_css',
	customCSS: 'custom_css',
	customLabel: 'custom_label',
	blockStyle: 'block_style',
	backgroundLayers: 'background_layers',
	backgroundLayersHover: 'background_layers_hover',
	blockBackgroundStatusHover: 'block_background_status_hover',
	borderHover: 'border_hover',
	borderRadiusHover: 'border_radius_hover',
	boxShadowHover: 'box_shadow_hover',
	paginationStyle: 'pagination_style',
	paginationSpacing: 'pagination_spacing',
	paginationText: 'pagination_text',
	paginationShowPages: 'pagination_show_pages',
	paginationType: 'pagination_type',
	paginationLoadMoreLabel: 'pagination_load_more_label',
	extraClassName: 'extra_class_name',
	extraClass: 'extra_class_name',
	customClassName: 'extra_class_name',
	customClasses: 'extra_class_name',
	flexBasis: 'flex_basis',
	flexGrow: 'flex_grow',
	flexShrink: 'flex_shrink',
	forceAspectRatio: 'force_aspect_ratio',
	fullWidth: 'full_width',
	height: 'height',
	maxWidth: 'max_width',
	minWidth: 'min_width',
	maxHeight: 'max_height',
	minHeight: 'min_height',
	marginTop: 'margin_top',
	marginBottom: 'margin_bottom',
	marginLeft: 'margin_left',
	marginRight: 'margin_right',
	maxiVersionCurrent: 'maxi_version_current',
	maxiVersionOrigin: 'maxi_version_origin',
	linkSettings: 'link_settings',
	linkSetting: 'link_settings',
	link: 'link_settings',
};

const AiChatPanelView = ({ isOpen, onClose }) => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [scope, setScope] = useState('page'); // 'selection', 'page', 'global'
	const [conversationContext, setConversationContext] = useState(null); // { flow: string, pendingTarget: string, data: object, currentOptions: array }
	const messagesEndRef = useRef(null);

	// Drag state for moveable panel
	const [position, setPosition] = useState(null); // null = use CSS default, otherwise { x, y }
	const [isDragging, setIsDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });

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
	const {
		activeStyleCard,
		allStyleCards,
		customColors,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
	} = useStyleCardData();

	const { handleUpdateStyleCard, handleApplyTheme } = createStyleCardHandlers({
		allStyleCards,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
	});

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

	const handleScopeChange = nextScope => {
		if (nextScope === scope) return;
		setScope(nextScope);
		if (conversationContext) setConversationContext(null);
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Drag handlers for moveable panel
	const handleMouseDown = useCallback((e) => {
		// Only drag from the header area, not from buttons inside header
		if (e.target.closest('button')) return;
		
		setIsDragging(true);
		const panelRect = e.currentTarget.closest('.maxi-ai-chat-panel').getBoundingClientRect();
		dragOffset.current = {
			x: e.clientX - panelRect.left,
			y: e.clientY - panelRect.top
		};
		e.preventDefault();
	}, []);

	const handleMouseMove = useCallback((e) => {
		if (!isDragging) return;
		
		const newX = e.clientX - dragOffset.current.x;
		const newY = e.clientY - dragOffset.current.y;
		
		// Keep panel within viewport bounds
		const maxX = window.innerWidth - 100; // At least 100px visible
		const maxY = window.innerHeight - 50;
		
		setPosition({
			x: Math.max(0, Math.min(newX, maxX)),
			y: Math.max(0, Math.min(newY, maxY))
		});
	}, [isDragging]);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Attach mousemove and mouseup to document for smooth dragging
	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	// Fix validation for handleSuggestion stale closure
	const messagesRef = useRef(messages);
	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	useEffect(() => {
		if (scope === 'global') {
			if (conversationContext) setConversationContext(null);
			return;
		}
		if (conversationContext?.mode && conversationContext.mode !== scope) {
			setConversationContext(null);
		}
	}, [scope, conversationContext]);

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

	const matchesTargetBlockName = (blockName, targetBlockArg) => {
		if (!targetBlockArg) return true;
		if (!blockName) return false;
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
		if (lowerTarget === 'divider') return lowerName.includes('divider');
		if (lowerTarget === 'row') return lowerName.includes('row');
		if (lowerTarget === 'column') return lowerName.includes('column');
		if (lowerTarget === 'group') return lowerName.includes('group');
		if (lowerTarget === 'accordion') return lowerName.includes('accordion');
		if (lowerTarget === 'pane') return lowerName.includes('pane');
		if (lowerTarget === 'slide') return lowerName.includes('slide') && !lowerName.includes('slider');
		if (lowerTarget === 'slider') return lowerName.includes('slider');
		if (lowerTarget === 'video') return lowerName.includes('video');
		if (lowerTarget === 'map') return lowerName.includes('map');
		if (lowerTarget === 'search') return lowerName.includes('search');
		if (lowerTarget === 'number-counter') return lowerName.includes('number-counter');
		return true;
	};

    // Recursive helper to find blocks regardless of nesting
    const collectBlocks = (blocks, matcher) => {
        const result = [];
        const walk = (list) => {
            list.forEach((block) => {
                if (matcher(block)) {
                    result.push(block);
                }
                if (block.innerBlocks && block.innerBlocks.length) {
                    walk(block.innerBlocks);
                }
            });
        };
        walk(blocks);
        return result;
    };

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

	const stripHtml = value =>
		String(value || '')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();

	const isIconBlock = block =>
		block?.name?.includes('icon-maxi') || block?.name?.includes('svg-icon');

	const isLabelBlock = blockName =>
		typeof blockName === 'string' &&
		(blockName.includes('text-maxi') ||
			blockName.includes('list-item-maxi') ||
			blockName.includes('heading') ||
			blockName.includes('paragraph'));

	const isHeadingTextBlock = block =>
		block?.name?.includes('heading') ||
		/^h[1-6]$/i.test(block?.attributes?.textLevel || '');

	const toTitleCase = value =>
		String(value || '')
			.toLowerCase()
			.split(' ')
			.filter(Boolean)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	const getBlockLabelText = block => {
		if (!block || !block.attributes || !isLabelBlock(block.name)) {
			return '';
		}
		const raw =
			block.attributes.content ||
			block.attributes.text ||
			block.attributes.title ||
			block.attributes.label ||
			'';
		return stripHtml(raw);
	};

	const findLabelInBlocks = blocks => {
		for (const block of blocks) {
			const direct = getBlockLabelText(block);
			if (direct) return direct;
			if (block.innerBlocks && block.innerBlocks.length > 0) {
				const nested = findLabelInBlocks(block.innerBlocks);
				if (nested) return nested;
			}
		}
		return '';
	};

	const findLabelBlockInBlocks = blocks => {
		for (const block of blocks) {
			if (isLabelBlock(block?.name)) {
				return block;
			}
			if (block.innerBlocks && block.innerBlocks.length > 0) {
				const nested = findLabelBlockInBlocks(block.innerBlocks);
				if (nested) return nested;
			}
		}
		return null;
	};

	const getSpacingIntent = (message = '') => {
		const lower = String(message || '').toLowerCase();
		if (!/(padding|margin)/.test(lower)) return null;

		const baseMatch = lower.match(/\b(padding|margin)\b/);
		if (!baseMatch) return null;

		const sidePattern = /\b(padding|margin)\b[\s-]*(top|right|bottom|left)\b|\b(top|right|bottom|left)\b[\s-]*(padding|margin)\b/;
		const sideMatch = lower.match(sidePattern);
		const base = sideMatch ? (sideMatch[1] || sideMatch[4]) : baseMatch[1];
		const side = sideMatch ? (sideMatch[2] || sideMatch[3]) : null;

		return { base, side };
	};

	const parseRemoveSpacingRequest = (message = '') => {
		const lower = String(message || '').toLowerCase();
		if (!/(padding|margin)/.test(lower)) return null;

		const removeMatch = /\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower)
			|| /\bno\s+(padding|margin)\b/.test(lower)
			|| /\bwithout\s+(padding|margin)\b/.test(lower);

		if (!removeMatch) return null;

		const intent = getSpacingIntent(message);
		if (!intent) return null;

		const property = intent.side ? `${intent.base}_${intent.side}` : intent.base;
		return { property, value: '0px' };
	};

	const parseNumericSpacingRequest = (message = '') => {
		const spacingIntent = getSpacingIntent(message);
		if (!spacingIntent) return null;

		const numberMatch = String(message || '').toLowerCase().match(/(-?\d+(?:\.\d+)?)\s*(px|%|em|rem|vh|vw)?/);
		if (!numberMatch) return null;

		const value = numberMatch[1];
		const unit = numberMatch[2] || 'px';
		const property = spacingIntent.side
			? `${spacingIntent.base}_${spacingIntent.side}`
			: spacingIntent.base;

		return { property, value: `${value}${unit}` };
	};

	const detectSpacingTarget = (message = '') => {
		const lower = String(message || '').toLowerCase();
		if (lower.includes('video')) return 'video';
		if (lower.includes('image') || lower.includes('photo') || lower.includes('picture')) return 'image';
		if (lower.includes('button')) return 'button';
		if (lower.includes('text') || lower.includes('heading')) return 'text';
		if (lower.includes('column')) return 'column';
		if (lower.includes('row')) return 'row';
		if (lower.includes('group')) return 'group';
		if (lower.includes('container') || lower.includes('section')) return 'container';
		return null;
	};

	const findLabelForIconBlock = iconBlock => {
		if (!iconBlock?.clientId) return '';
		const { getBlockParents, getBlock } = select('core/block-editor');
		const parentIds = getBlockParents(iconBlock.clientId) || [];
		for (const parentId of parentIds) {
			const parent = getBlock(parentId);
			if (!parent?.innerBlocks?.length) continue;
			const siblings = parent.innerBlocks;
			const index = siblings.findIndex(block => block.clientId === iconBlock.clientId);
			if (index === -1) continue;
			const after = siblings.slice(index + 1);
			const labelAfter = findLabelInBlocks(after);
			if (labelAfter) return labelAfter;
			const before = siblings.slice(0, index);
			const labelBefore = findLabelInBlocks(before);
			if (labelBefore) return labelBefore;
		}
		return '';
	};

	const findLabelBlockForIconBlock = iconBlock => {
		if (!iconBlock?.clientId) return null;
		const { getBlockParents, getBlock } = select('core/block-editor');
		const parentIds = getBlockParents(iconBlock.clientId) || [];
		for (const parentId of parentIds) {
			const parent = getBlock(parentId);
			if (!parent?.innerBlocks?.length) continue;
			const siblings = parent.innerBlocks;
			const index = siblings.findIndex(block => block.clientId === iconBlock.clientId);
			if (index === -1) continue;
			const after = siblings.slice(index + 1);
			const labelAfter = findLabelBlockInBlocks(after);
			if (labelAfter) return labelAfter;
			const before = siblings.slice(0, index);
			const labelBefore = findLabelBlockInBlocks(before);
			if (labelBefore) return labelBefore;
		}
		return null;
	};

	const findGroupRootForIconBlock = iconBlock => {
		if (!iconBlock?.clientId) return null;
		const { getBlockParents, getBlock } = select('core/block-editor');
		const parentIds = getBlockParents(iconBlock.clientId) || [];
		for (const parentId of parentIds) {
			const parent = getBlock(parentId);
			if (!parent?.innerBlocks?.length) continue;
			const hasDirectIconChild = parent.innerBlocks.some(
				block => block.clientId === iconBlock.clientId
			);
			if (!hasDirectIconChild) continue;
			const textBlocks = collectBlocks(parent.innerBlocks, block =>
				isLabelBlock(block?.name)
			);
			if (textBlocks.length > 0) return parent;
		}
		return null;
	};

	const extractSvgLabel = svgCode => {
		if (!svgCode) return '';
		const titleMatch = String(svgCode).match(/<title[^>]*>([^<]+)<\/title>/i);
		if (titleMatch?.[1]) return stripHtml(titleMatch[1]);
		const descMatch = String(svgCode).match(/<desc[^>]*>([^<]+)<\/desc>/i);
		if (descMatch?.[1]) return stripHtml(descMatch[1]);
		const ariaMatch = String(svgCode).match(/aria-label=["']([^"']+)["']/i);
		if (ariaMatch?.[1]) return stripHtml(ariaMatch[1]);
		return '';
	};

	const getIconLabelFromBlock = iconBlock => {
		if (!iconBlock?.attributes) return '';
		const altTitle = stripHtml(iconBlock.attributes.altTitle || '');
		if (altTitle) return altTitle;
		const altDescription = stripHtml(iconBlock.attributes.altDescription || '');
		if (altDescription) return altDescription;
		const ariaLabel = stripHtml(
			iconBlock.attributes.ariaLabels?.icon ||
				iconBlock.attributes.ariaLabels?.canvas ||
				''
		);
		if (ariaLabel) return ariaLabel;
		const svgContent =
			iconBlock.attributes.content ||
			iconBlock.attributes['icon-content'] ||
			'';
		return extractSvgLabel(svgContent);
	};

	const buildTextContentChange = (block, value) => {
		if (!block?.attributes) return null;
		const nextValue = stripHtml(value || '');
		if (!nextValue) return null;
		if (Object.prototype.hasOwnProperty.call(block.attributes, 'content')) {
			return { content: nextValue };
		}
		if (Object.prototype.hasOwnProperty.call(block.attributes, 'text')) {
			return { text: nextValue };
		}
		if (Object.prototype.hasOwnProperty.call(block.attributes, 'title')) {
			return { title: nextValue };
		}
		if (Object.prototype.hasOwnProperty.call(block.attributes, 'label')) {
			return { label: nextValue };
		}
		return { content: nextValue };
	};

	const buildIconRelatedText = (iconLabel, block, index) => {
		const rawLabel = stripHtml(iconLabel);
		if (!rawLabel) return '';
		const label = /^[A-Z0-9\s&+.-]+$/.test(rawLabel)
			? rawLabel
			: toTitleCase(rawLabel);

		if (isHeadingTextBlock(block)) {
			return label;
		}

		const currentText = getBlockLabelText(block);
		const lowerCurrent = currentText.toLowerCase();
		if (currentText && lowerCurrent.includes(label.toLowerCase())) {
			return currentText;
		}

		const hasNumber = /\d/.test(currentText);
		const statWordMatch = lowerCurrent.match(
			/\b(courses?|classes?|lessons?|events?|sessions?|programs?)\b/
		);
		if (hasNumber && statWordMatch) {
			const numberMatch = currentText.match(/\d+\+?|\d+%/);
			const numberPart = numberMatch ? numberMatch[0] : currentText;
			return `${numberPart} ${label} ${statWordMatch[1]}`;
		}
		if (hasNumber) {
			return `${label} ${currentText}`;
		}

		const templates = [
			`Explore ${label}.`,
			`Learn about ${label}.`,
			`Discover ${label}.`,
			`Find out more about ${label}.`,
		];
		return templates[index % templates.length];
	};

	const isBackgroundDebugEnabled = () => {
		if (typeof window === 'undefined') return false;
		if (window.__MAXI_AI_DEBUG_BG) return true;
		try {
			return window.localStorage?.getItem('maxiAiDebugBackground') === '1';
		} catch (e) {
			return false;
		}
	};

	const summarizeBackgroundLayers = layers => {
		if (!Array.isArray(layers)) return layers;
		return layers.map(layer => ({
			id: layer?.id,
			order: layer?.order,
			type: layer?.type,
			display: layer?.['display-general'],
			paletteStatus: layer?.['background-palette-status-general'],
			paletteColor: layer?.['background-palette-color-general'],
			color: layer?.['background-color-general'],
		}));
	};

	const logBackgroundDebug = (label, payload) => {
		if (!isBackgroundDebugEnabled()) return;
		// Keep payload small and readable.
		console.log(`[Maxi AI BG] ${label}`, payload);
	};

	const updateBackgroundColor = (clientId, color, currentAttributes, prefix = '') => {
		const newAttributes = {};
		const isPalette = typeof color === 'number';

		newAttributes[`${prefix}background-active-media-general`] = 'color';
		newAttributes[`${prefix}background-class-general`] = ''; // clear class based colors

		if (isPalette) {
			newAttributes[`${prefix}background-palette-status-general`] = true;
			newAttributes[`${prefix}background-palette-color-general`] = color;
			// Explicitly clear custom color to ensure editor UI reflects palette status
			newAttributes[`${prefix}background-color-general`] = '';
		} else {
			newAttributes[`${prefix}background-palette-status-general`] = false;
			newAttributes[`${prefix}background-color-general`] = color;
		}

		if (
			currentAttributes['background-layers'] &&
			Array.isArray(currentAttributes['background-layers'])
		) {
			const layers = cloneDeep(currentAttributes['background-layers']);
			if (layers.length > 0) {
				layers[0].type = 'color';
				layers[0]['display-general'] = 'block';

				if (isPalette) {
					layers[0]['background-palette-status-general'] = true;
					layers[0]['background-palette-color-general'] = color;
				} else {
					layers[0]['background-palette-status-general'] = false;
					layers[0]['background-color-general'] = color;
				}
				newAttributes['background-layers'] = layers;
			}
		}
		logBackgroundDebug('updateBackgroundColor', {
			clientId,
			prefix,
			color,
			isPalette,
			backgroundActiveMedia: newAttributes[`${prefix}background-active-media-general`],
			paletteStatus: newAttributes[`${prefix}background-palette-status-general`],
			paletteColor: newAttributes[`${prefix}background-palette-color-general`],
			customColor: newAttributes[`${prefix}background-color-general`],
			layers: summarizeBackgroundLayers(newAttributes['background-layers']),
		});
		return newAttributes;
	};

	const updateTextColor = (color, prefix = '') => {
		const normalizedPrefix = prefix === 'button-' ? '' : prefix;
		const isPalette = typeof color === 'number';
		if (isPalette) {
			return {
				[`${normalizedPrefix}palette-status-general`]: true,
				[`${normalizedPrefix}palette-color-general`]: color,
				[`${normalizedPrefix}color-general`]: '', // Clear custom color
			};
		}
		return {
			[`${normalizedPrefix}color-general`]: color,
			[`${normalizedPrefix}palette-status-general`]: false,
		};
	};

	const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/;

	const extractHexColor = message => {
		if (!message) return null;
		const match = message.match(HEX_COLOR_REGEX);
		return match ? match[0] : null;
	};

	const extractQuotedText = message => {
		if (!message) return null;
		const match = message.match(/["']([^"']+)["']/);
		return match ? match[1].trim() : null;
	};

	const extractUrl = message => {
		if (!message) return null;
		const match = message.match(/https?:\/\/[^\s"'<>]+/i);
		if (match) return match[0];
		const wwwMatch = message.match(/\bwww\.[^\s"'<>]+/i);
		if (wwwMatch) return `https://${wwwMatch[0]}`;
		const relativeMatch = message.match(/(?:to|link)\s+(\/[^\s"'<>]+)/i);
		if (relativeMatch) return relativeMatch[1];
		return null;
	};

	const extractValueFromPatterns = (message, patterns) => {
		for (const pattern of patterns) {
			const match = message.match(pattern);
			if (match && match[1]) return match[1].trim();
		}
		return null;
	};

	const extractNumericValue = (message, patterns) => {
		for (const pattern of patterns) {
			const match = message.match(pattern);
			if (match && match[1]) {
				const num = Number.parseFloat(match[1]);
				if (Number.isFinite(num)) return num;
			}
		}
		return null;
	};

	// A-group helpers moved to ai/utils/containerAGroup.

	const extractButtonText = message => {
		const quoted = extractQuotedText(message);
		if (quoted) return quoted;
		return extractValueFromPatterns(message, [
			/(?:button\s*)?(?:text|label|copy)\s*(?:to|=|is|:)\s*(.+)$/i,
			/(?:button\s*)?(?:text|label|copy)\s+(?!colou?r\b)(.+)$/i,
			/(?:rename|change)\s*button\s*(?:to|as)\s*(.+)$/i,
			/(?:button\s*)?(?:says|say|reads)\s*(.+)$/i,
		]);
	};

	const extractCaptionText = message => {
		const quoted = extractQuotedText(message);
		if (quoted) return quoted;
		return extractValueFromPatterns(message, [
			/(?:caption|description)\s*(?:to|=|is|:)\s*(.+)$/i,
		]);
	};

	const extractAltText = message => {
		const quoted = extractQuotedText(message);
		if (quoted) return quoted;
		return extractValueFromPatterns(message, [
			/(?:alt\s*text|alt)\s*(?:to|=|is|:)\s*(.+)$/i,
		]);
	};

	const resolveImageRatioValue = (width, height) => {
		const ratioKey = `${width}/${height}`;
		const ratioMap = {
			'1/1': 'ar11',
			'4/3': 'ar43',
			'16/9': 'ar169',
			'3/2': 'ar32',
			'2/3': 'ar23',
			'9/16': 'custom:9/16',
			'4/5': 'custom:4/5',
			'5/4': 'custom:5/4',
		};

		return ratioMap[ratioKey] || `custom:${ratioKey}`;
	};

	const resolvePromptValue = (property, message) => {
		if (!message) return null;
		switch (property) {
			case 'button_text':
				return extractButtonText(message);
			case 'captionContent':
				return extractCaptionText(message);
			case 'mediaAlt':
				return extractAltText(message);
			case 'button_url':
			case 'mediaURL':
				return extractUrl(message);
			default:
				return null;
		}
	};

	const getColorTargetFromMessage = lowerMessage => {
		const isButtonContext =
			lowerMessage.includes('button') ||
			selectedBlock?.name?.includes('button');
		const isHover = lowerMessage.includes('hover');
		const isActive =
			lowerMessage.includes('active') || lowerMessage.includes('pressed');
		const isText =
			lowerMessage.includes('text') ||
			lowerMessage.includes('label') ||
			lowerMessage.includes('font');
		const isBackground =
			lowerMessage.includes('background') || lowerMessage.includes('bg');
		const isShapeKeyword =
			lowerMessage.includes('shape divider') ||
			lowerMessage.includes('shape-divider') ||
			lowerMessage.includes('wave') ||
			lowerMessage.includes('waves') ||
			lowerMessage.includes('curve') ||
			lowerMessage.includes('slant') ||
			lowerMessage.includes('triangle');
		const isContainer = selectedBlock?.name?.includes('container');
		const hasShapeDivider =
			!!selectedBlock?.attributes?.['shape-divider-top-status'] ||
			!!selectedBlock?.attributes?.['shape-divider-bottom-status'];
		const wantsTop = lowerMessage.includes('top');
		const wantsBottom = lowerMessage.includes('bottom');
		const isDivider =
			lowerMessage.includes('divider') ||
			selectedBlock?.name?.includes('divider');

		if (isShapeKeyword || (isDivider && isContainer)) {
			if (wantsTop && !wantsBottom) return 'shape-divider-top';
			if (wantsBottom && !wantsTop) return 'shape-divider-bottom';
			if (wantsTop && wantsBottom) return 'shape-divider';
			if (hasShapeDivider) {
				const hasTop = !!selectedBlock?.attributes?.['shape-divider-top-status'];
				const hasBottom = !!selectedBlock?.attributes?.['shape-divider-bottom-status'];
				if (hasTop && !hasBottom) return 'shape-divider-top';
				if (hasBottom && !hasTop) return 'shape-divider-bottom';
			}
			return 'shape-divider';
		}

		if (isDivider) return 'divider';
		if (lowerMessage.includes('border') && isButtonContext) return 'button-border';
		if (isHover && isButtonContext) {
			if (isText) return 'button-hover-text';
			if (isBackground) return 'button-hover-background';
		}
		if (isActive && isButtonContext) return 'button-active-background';
		if (isButtonContext && isText) return 'button-text';
		if (isButtonContext && isBackground) return 'button-background';
		if (isButtonContext) return 'button-background';
		if (isBackground) return 'background';
		if (isText) return 'text';
		if (lowerMessage.includes('border')) return 'border';
		return 'element';
	};

	const getColorTargetLabel = colorTarget => {
		if (colorTarget === 'shape-divider') return 'shape divider';
		if (colorTarget === 'shape-divider-top') return 'shape divider (top)';
		if (colorTarget === 'shape-divider-bottom') return 'shape divider (bottom)';
		return colorTarget.replace('button-', '');
	};

	const buildColorUpdate = (colorTarget, colorValue) => {
		let property = '';
		let targetBlock = 'container';
		let value = colorValue;
		let msgText = '';

		if (colorTarget === 'button' || colorTarget === 'button-background') {
			property = 'background_color';
			targetBlock = 'button';
			msgText = 'button background';
		} else if (colorTarget === 'button-text') {
			property = 'text_color';
			targetBlock = 'button';
			msgText = 'button text';
		} else if (colorTarget === 'button-border') {
			property = 'border';
			targetBlock = 'button';
			msgText = 'button border';
		} else if (colorTarget === 'button-hover-background') {
			property = 'button_hover_bg';
			targetBlock = 'button';
			msgText = 'button hover background';
		} else if (colorTarget === 'button-hover-text') {
			property = 'button_hover_text';
			targetBlock = 'button';
			msgText = 'button hover text';
		} else if (colorTarget === 'button-active-background') {
			property = 'button_active_bg';
			targetBlock = 'button';
			msgText = 'button active background';
		} else if (colorTarget === 'button-icon-fill') {
			property = 'icon_color';
			targetBlock = 'button';
			value = { target: 'fill', color: colorValue };
			msgText = 'button icon fill';
		} else if (colorTarget === 'button-icon-stroke') {
			property = 'icon_color';
			targetBlock = 'button';
			value = { target: 'stroke', color: colorValue };
			msgText = 'button icon stroke';
		} else if (colorTarget === 'background') {
			property = 'background_color';
			targetBlock = 'container';
			msgText = 'background';
		} else if (['group', 'row', 'column', 'accordion', 'pane', 'slide', 'slider', 'video', 'map', 'search', 'number-counter'].includes(colorTarget)) {
			property = 'background_color';
			targetBlock = colorTarget;
			msgText = `${colorTarget.replace('-', ' ')} background`;
		} else if (colorTarget === 'text') {
			property = 'text_color';
			targetBlock = 'text';
			msgText = 'text';
		} else if (colorTarget === 'shape-divider-top') {
			property = 'shape_divider_color_top';
			targetBlock = 'container';
			msgText = 'shape divider (top)';
		} else if (colorTarget === 'shape-divider-bottom') {
			property = 'shape_divider_color_bottom';
			targetBlock = 'container';
			msgText = 'shape divider (bottom)';
		} else if (colorTarget === 'shape-divider') {
			property = 'shape_divider_color';
			targetBlock = 'container';
			msgText = 'shape divider';
		} else if (colorTarget === 'divider') {
			property = 'divider_color';
			targetBlock = 'divider';
			msgText = 'divider';
		} else if (colorTarget === 'element') {
			property = 'background_color';
			targetBlock = selectedBlock?.name?.includes('button')
				? 'button'
				: 'container';
			msgText = 'element';
		}

		if (!property) {
			property = 'background_color';
			targetBlock = 'container';
			msgText = 'background';
		}

		return { property, targetBlock, value, msgText };
	};

	const updatePadding = (value, side = null, prefix = '') => {
		const parsed = parseUnitValue(value);
		const sideLower = side ? side.toLowerCase() : null;
		const values = buildResponsiveScaledValues({
			value: parsed.value,
			unit: parsed.unit,
		});
		const changes = {};
		const sides = sideLower && ['top', 'bottom', 'left', 'right'].includes(sideLower)
			? [sideLower]
			: ['top', 'bottom', 'left', 'right'];
		const syncValue = sides.length === 1 ? 'none' : 'all';

		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			const suffix = `-${bp}`;
			sides.forEach(sideKey => {
				changes[`${prefix}padding-${sideKey}${suffix}`] = values[bp];
				changes[`${prefix}padding-${sideKey}-unit${suffix}`] = parsed.unit;
			});
			changes[`${prefix}padding-sync${suffix}`] = syncValue;
		});

		return changes;
	};

	const updateFontSize = (value) => ({
		'font-size-general': Number(value),
		'typography-unit-general': 'px',
	});

	// Margin - same pattern as padding
	// Margin - same pattern as padding
	const updateMargin = (value, side = null, prefix = '') => {
		const parsed = parseUnitValue(value);
		const sideLower = side ? side.toLowerCase() : null;
		const values = buildResponsiveScaledValues({
			value: parsed.value,
			unit: parsed.unit,
		});
		const changes = {};
		const sides = sideLower && ['top', 'bottom', 'left', 'right'].includes(sideLower)
			? [sideLower]
			: ['top', 'bottom', 'left', 'right'];
		const syncValue = sides.length === 1 ? 'none' : 'all';

		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			const suffix = `-${bp}`;
			sides.forEach(sideKey => {
				changes[`${prefix}margin-${sideKey}${suffix}`] = values[bp];
				changes[`${prefix}margin-${sideKey}-unit${suffix}`] = parsed.unit;
			});
			changes[`${prefix}margin-sync${suffix}`] = syncValue;
		});

		return changes;
	};



	// Border Radius
	// Border Radius
	// Border Radius
	const updateBorderRadius = (value, corner = null, prefix = '') => {
		const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
		// Fix: Allow 0 to be passed validly
		let finalValue = (rawValue === undefined || rawValue === null || rawValue === '') ? 8 : Number(rawValue);
		if (isNaN(finalValue)) finalValue = 8;

		const maxiStore = select('maxiBlocks');
		const activeBreakpoint = maxiStore?.receiveMaxiDeviceType?.() || 'general';
		const baseBreakpoint = maxiStore?.receiveBaseBreakpoint?.() || null;
		const breakpoints = breakpoint ? [breakpoint] : [activeBreakpoint];
		if (breakpoint === 'general' && activeBreakpoint !== 'general') {
			breakpoints.push(activeBreakpoint);
		}
		if (breakpoint === 'general' && baseBreakpoint) {
			breakpoints.push(baseBreakpoint);
		} else if (!breakpoint && activeBreakpoint === 'general' && baseBreakpoint) {
			breakpoints.push(baseBreakpoint);
		}
		const uniqueBreakpoints = Array.from(new Set(breakpoints));

		const corners = {
			'top-left': 'border-top-left-radius',
			'top-right': 'border-top-right-radius',
			'bottom-left': 'border-bottom-left-radius',
			'bottom-right': 'border-bottom-right-radius',
		};

		const lowerCorner = corner?.toLowerCase?.() || null;
		const changes = {};
		uniqueBreakpoints.forEach(bp => {
			const suffix = `-${bp}`;
			if (lowerCorner && corners[lowerCorner]) {
				changes[`${prefix}${corners[lowerCorner]}${suffix}`] = finalValue;
				changes[`${prefix}border-sync-radius${suffix}`] = 'none';
				changes[`${prefix}border-unit-radius${suffix}`] = 'px';
			} else {
				changes[`${prefix}border-top-left-radius${suffix}`] = finalValue;
				changes[`${prefix}border-top-right-radius${suffix}`] = finalValue;
				changes[`${prefix}border-bottom-left-radius${suffix}`] = finalValue;
				changes[`${prefix}border-bottom-right-radius${suffix}`] = finalValue;
				changes[`${prefix}border-sync-radius${suffix}`] = 'all';
				changes[`${prefix}border-unit-radius${suffix}`] = 'px';
			}
		});

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

	const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
		if (rawValue === null || rawValue === undefined) {
			return { value: 0, unit: fallbackUnit };
		}

		if (typeof rawValue === 'number') {
			return { value: rawValue, unit: fallbackUnit };
		}

		const raw = String(rawValue).trim();
		const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?$/i);
		if (match) {
			return { value: Number(match[1]), unit: match[2] || fallbackUnit };
		}

		const parsed = Number.parseFloat(raw);
		return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
	};

	const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	const getResponsiveScaleFactor = breakpoint => {
		if (breakpoint === 'm' || breakpoint === 's') return 0.6;
		if (breakpoint === 'xs') return 0.4;
		return 1;
	};

	const roundResponsiveValue = (value, unit) => {
		const numeric = Number(value);
		if (!Number.isFinite(numeric)) return value;
		const normalizedUnit = String(unit || '').toLowerCase();
		if (normalizedUnit === 'px') {
			if (Math.abs(numeric) < 2) return Math.round(numeric * 100) / 100;
			return Math.round(numeric);
		}
		return Math.round(numeric * 100) / 100;
	};

	const shouldScaleResponsiveUnit = (unit, forceScale) => {
		if (forceScale) return true;
		const normalizedUnit = String(unit || '').toLowerCase();
		return !['', '-', '%', 'vw', 'vh', 'ch'].includes(normalizedUnit);
	};

	const buildResponsiveScaledValues = ({ value, unit, forceScale = false, min = null } = {}) => {
		const numericValue = Number(value);
		const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
		const canScale = shouldScaleResponsiveUnit(unit, forceScale);
		const values = {};

		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			const factor = canScale ? getResponsiveScaleFactor(bp) : 1;
			let nextValue = safeValue * factor;
			if (Number.isFinite(nextValue) && min !== null) {
				nextValue = Math.max(min, nextValue);
			}
			values[bp] = roundResponsiveValue(nextValue, unit);
		});

		return values;
	};

	const buildResponsiveBooleanChanges = (prefix, key, value) => {
		const changes = {};
		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			changes[`${prefix}${key}-${bp}`] = value;
		});
		return changes;
	};

	const buildResponsiveValueChanges = (key, value) => {
		const changes = {};
		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			changes[`${key}-${bp}`] = value;
		});
		return changes;
	};

	const normalizeValueWithBreakpoint = rawValue => {
		if (
			rawValue &&
			typeof rawValue === 'object' &&
			!Array.isArray(rawValue) &&
			Object.prototype.hasOwnProperty.call(rawValue, 'value')
		) {
			return {
				value: rawValue.value,
				breakpoint: rawValue.breakpoint || null,
			};
		}

		return { value: rawValue, breakpoint: null };
	};

	const buildResponsiveSizeChanges = (
		prefix,
		key,
		value,
		unit,
		includeAdvancedOptions = false,
		options = {}
	) => {
		const values = buildResponsiveScaledValues({
			value,
			unit,
			forceScale: options.forceScale,
			min: options.min,
		});
		const changes = {};

		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			changes[`${prefix}${key}-${bp}`] = values[bp];
			changes[`${prefix}${key}-unit-${bp}`] = unit;
		});

		if (includeAdvancedOptions) {
			changes[`${prefix}size-advanced-options`] = true;
		}

		return changes;
	};

	const getActiveBreakpoint = () => {
		const maxiStore = select('maxiBlocks');
		return maxiStore?.receiveMaxiDeviceType?.() || 'general';
	};

	const getBaseBreakpoint = () => {
		const maxiStore = select('maxiBlocks');
		return maxiStore?.receiveBaseBreakpoint?.() || null;
	};

	const buildBreakpointChanges = (prefix, key, value) => {
		const bp = getActiveBreakpoint();
		const base = getBaseBreakpoint();
		const changes = {
			[`${prefix}${key}-${bp}`]: value,
		};

		if (bp === 'general' && base) {
			changes[`${prefix}${key}-${base}`] = value;
		}

		return changes;
	};

	const buildSizeChanges = (prefix, key, value, unit, includeAdvancedOptions = false) => {
		const bp = getActiveBreakpoint();
		const base = getBaseBreakpoint();
		const strValue = String(value);
		const changes = {
			[`${prefix}${key}-${bp}`]: strValue,
			[`${prefix}${key}-unit-${bp}`]: unit,
		};

		if (includeAdvancedOptions) {
			changes[`${prefix}size-advanced-options`] = true;
		}

		if (bp === 'general' && base) {
			changes[`${prefix}${key}-${base}`] = strValue;
			changes[`${prefix}${key}-unit-${base}`] = unit;
		}

		return changes;
	};

	const buildWidthChanges = (rawValue, prefix = '') => {
		if (typeof rawValue === 'string') {
			const normalized = rawValue.trim().toLowerCase();
			if (normalized === 'auto' || normalized === 'fit-content' || normalized === 'fit content') {
				return buildResponsiveBooleanChanges(prefix, 'width-fit-content', true);
			}
		}

		const parsed = parseUnitValue(rawValue);
		return {
			...buildResponsiveSizeChanges(prefix, 'width', parsed.value, parsed.unit, false),
			...buildResponsiveBooleanChanges(prefix, 'width-fit-content', false),
		};
	};

	const buildHeightChanges = (rawValue, prefix = '') => {
		const parsed = parseUnitValue(rawValue);
		return buildResponsiveSizeChanges(prefix, 'height', parsed.value, parsed.unit, false);
	};

	const buildContextLoopChanges = (value = {}) => {
		if (!value || typeof value !== 'object') return null;

		const changes = {
			'cl-status': value.status === undefined ? true : Boolean(value.status),
			'cl-source': value.source,
			'cl-type': value.type,
			'cl-relation': value.relation,
			'cl-id': value.id,
			'cl-author': value.author,
			'cl-order-by': value.orderBy,
			'cl-order': value.order,
			'cl-pagination': value.pagination,
		};

		if (value.perPage !== undefined) {
			changes['cl-pagination-per-page'] = Number(value.perPage);
		}

		return Object.fromEntries(
			Object.entries(changes).filter(([, val]) => val !== undefined)
		);
	};

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

	const updateLineHeight = (value, unit = '-') => {
		const parsed = parseUnitValue(value, unit);
		const values = buildResponsiveScaledValues({
			value: parsed.value,
			unit: parsed.unit,
			forceScale: true,
			min: 1,
		});
		const changes = {};
		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			changes[`line-height-${bp}`] = values[bp];
			changes[`line-height-unit-${bp}`] = parsed.unit;
		});
		return changes;
	};

	const updateLetterSpacing = (value, unit = 'px') => {
		const parsed = parseUnitValue(value, unit);
		const values = buildResponsiveScaledValues({
			value: parsed.value,
			unit: parsed.unit,
		});
		const changes = {};
		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			changes[`letter-spacing-${bp}`] = values[bp];
			changes[`letter-spacing-unit-${bp}`] = parsed.unit;
		});
		return changes;
	};

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

	const updateAlignContent = (value) => ({
		'align-content-general': value,
	});

	const updateGap = (value, unit = 'px') => {
		const parsed = parseUnitValue(value, unit);
		const values = buildResponsiveScaledValues({
			value: parsed.value,
			unit: parsed.unit,
		});
		const changes = {};
		RESPONSIVE_BREAKPOINTS.forEach(bp => {
			const suffix = `-${bp}`;
			changes[`row-gap${suffix}`] = values[bp];
			changes[`row-gap-unit${suffix}`] = parsed.unit;
			changes[`column-gap${suffix}`] = values[bp];
			changes[`column-gap-unit${suffix}`] = parsed.unit;
		});
		return changes;
	};

	const clampNumber = (value, min, max) => {
		const numeric = Number(value);
		if (Number.isNaN(numeric)) return min;
		return Math.min(Math.max(numeric, min), max);
	};

	const normalizeShapeDividerStyle = (position, rawStyle) => {
		const base = String(rawStyle || '').trim().toLowerCase();
		if (!base) return '';

		const map = {
			wave: 'wave',
			waves: 'waves',
			curve: 'curve',
			slant: 'slant',
			triangle: 'triangle',
		};
		const mapped = map[base] || base;
		if (mapped.endsWith(`-${position}`)) return mapped;
		return `${mapped}-${position}`;
	};

	const buildShapeDividerChanges = (position, rawValue) => {
		if (rawValue === undefined || rawValue === null) return null;

		const normalized = String(rawValue).trim().toLowerCase();
		if (['none', 'off', 'remove'].includes(normalized)) {
			return { [`shape-divider-${position}-status`]: false };
		}

		const valueObj = rawValue && typeof rawValue === 'object' ? rawValue : null;
		const styleInput = valueObj?.style || valueObj?.shape || valueObj?.value || rawValue;
		const style = normalizeShapeDividerStyle(position, styleInput);
		if (!style) return null;

		const changes = {
			[`shape-divider-${position}-status`]: true,
			[`shape-divider-${position}-shape-style`]: style,
		};

		if (valueObj?.color !== undefined) {
			const isPalette = typeof valueObj.color === 'number';
			changes[`shape-divider-${position}-palette-status-general`] = isPalette;
			changes[`shape-divider-${position}-palette-color-general`] = isPalette ? valueObj.color : '';
			changes[`shape-divider-${position}-color-general`] = isPalette ? '' : valueObj.color;
		}

		if (valueObj?.opacity !== undefined) {
			changes[`shape-divider-${position}-opacity-general`] = clampNumber(valueObj.opacity, 0, 1);
		}

		return changes;
	};

	const buildShapeDividerColorChanges = (position, colorValue) => {
		if (colorValue === undefined || colorValue === null || colorValue === '') return null;
		const isPalette = typeof colorValue === 'number';
		return {
			[`shape-divider-${position}-palette-status-general`]: isPalette,
			[`shape-divider-${position}-palette-color-general`]: isPalette ? colorValue : '',
			[`shape-divider-${position}-color-general`]: isPalette ? '' : colorValue,
		};
	};

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

	const updateDisplay = value => {
		let rawValue = value;
		let breakpoint = null;
		if (
			value &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			Object.prototype.hasOwnProperty.call(value, 'value')
		) {
			rawValue = value.value;
			breakpoint = value.breakpoint || null;
		}

		if (breakpoint) {
			return { [`display-${breakpoint}`]: rawValue };
		}

		return { 'display-general': rawValue };
	};

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

	/*
	 * ============================================================================
	 * UNIVERSAL BLOCK UPDATER
	 * ============================================================================
	 * Applies updates to a list of blocks recursively.
	 * Used by both Page changes (allBlocks) and Selection changes ([selectedBlock]).
	 */
	const applyUpdatesToBlocks = (blocksToUpdate, property, value, targetBlock = null, specificClientId = null) => {
		let count = 0;

		const recursiveUpdate = (blocks) => {
			if (!Array.isArray(blocks)) {
				return;
			}
			
			blocks.forEach(block => {
				let changes = null;
				const isMaxi = block.name.startsWith('maxi-blocks/');
				
				const prefix = getBlockPrefix(block.name);
				
				// MATCHING LOGIC
				const isMatch = specificClientId ? block.clientId === specificClientId : matchesTargetBlockName(block.name, targetBlock);

				// console.log(`[Maxi AI Debug] Checking block: ${block.name} (${block.clientId}). isMaxi: ${isMaxi}, isMatch: ${isMatch}, Target: ${targetBlock}`);

				if (isMaxi && isMatch) {
					// console.log(`[Maxi AI Debug] MATCH: ${block.name} (${block.clientId}). Updating ${property}...`);
					
					switch (property) {

						case 'background_color':
							// Apply to containers, rows, columns, buttons OR if it's a direct clientId match (Selection)
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('button') || block.name.includes('group') || block.name.includes('accordion') || block.name.includes('pane') || block.name.includes('slide') || block.name.includes('slider') || block.name.includes('video') || block.name.includes('map') || block.name.includes('search') || block.name.includes('number-counter')) {
								// Fix: Pass prefix to ensure buttons get button-background-color-general
								changes = updateBackgroundColor(block.clientId, value, block.attributes, prefix);
							}
							break;
						case 'background_layers': {
							const layers = Array.isArray(value)
								? value
								: (value && Array.isArray(value.layers) ? value.layers : null);
							if (layers && (specificClientId || (block.attributes && 'background-layers' in block.attributes))) {
								changes = { 'background-layers': layers };
							}
							break;
						}
						case 'background_layers_hover': {
							const layers = Array.isArray(value)
								? value
								: (value && Array.isArray(value.layers) ? value.layers : null);
							if (layers && (specificClientId || (block.attributes && 'background-layers-hover' in block.attributes))) {
								changes = { 'background-layers-hover': layers };
							}
							break;
						}
						case 'block_background_status_hover': {
							if (specificClientId || (block.attributes && 'block-background-status-hover' in block.attributes)) {
								changes = buildContainerBGroupAttributeChanges(property, value);
							}
							break;
						}
						case 'divider_color': {
							if (specificClientId || block.name.includes('divider')) {
								const isPalette = typeof value === 'number';
								changes = {
									'divider-border-palette-status-general': isPalette,
									'divider-border-palette-color-general': isPalette ? value : '',
									'divider-border-color-general': isPalette ? '' : value,
								};
							}
							break;
						}
						case 'text_color':
							// Apply to text and buttons OR direct selection
							if (specificClientId || block.name.includes('text-maxi') || block.name.includes('button-maxi')) {
								changes = updateTextColor(value, prefix);
							}
							break;
						case 'heading_color':
							// Apply only to headings (h1-h6)
							if (block.name.includes('text-maxi') && ['h1','h2','h3','h4','h5','h6'].includes(block.attributes.textLevel)) {
								changes = updateTextColor(value, prefix);
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
						case 'border_radius_hover':
							changes = buildContainerBGroupAttributeChanges(property, value);
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
						case 'border_hover':
							changes = buildContainerBGroupAttributeChanges(property, value);
							break;
						case 'box_shadow':
							// value is expected to be object {x, y, blur, spread, color}
							if (value === 'none') {
								changes = removeBoxShadow(prefix);
							} else if (typeof value === 'object') {
								changes = updateBoxShadow(value.x, value.y, value.blur, value.spread, value.color, prefix, value.opacity);
							}
							break;
						case 'box_shadow_hover':
							changes = buildContainerBGroupAttributeChanges(property, value);
							break;
						case 'apply_responsive_spacing':
							// value is the preset name: 'compact' | 'comfortable' | 'spacious'
							changes = createResponsiveSpacing(value, prefix);
							break;
						case 'width':
							changes = buildWidthChanges(value, prefix);
							break;
						case 'height':
							changes =
								buildContainerHGroupAttributeChanges(property, value) ||
								buildHeightChanges(value, prefix);
							break;
						case 'block_style':
							changes = buildContainerBGroupAttributeChanges(property, value);
							break;
						case 'breakpoints':
							changes = buildContainerBGroupAttributeChanges(property, value);
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
								changes = buildContainerAGroupAttributeChanges(property, value, {
									block,
									attributes: block.attributes,
								});
							}
							break;
						case 'align_content':
							// Apply to layout containers
							if (specificClientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column') || block.name.includes('group')) {
								changes = buildContainerAGroupAttributeChanges(property, value, {
									block,
									attributes: block.attributes,
								});
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
								changes = updateGap(value);
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
						case 'z_index':
							changes = updateZIndex(value);
							break;
						case 'position':
							changes = updatePosition(value);
							break;
						case 'position_top':
							{
								const posTop = parseUnitValue(value);
								changes = {
									'position-top-general': posTop.value,
									'position-top-unit-general': posTop.unit,
									'position-sync-general': 'none',
								};
							}
							break;
						case 'position_right':
							{
								const posRight = parseUnitValue(value);
								changes = {
									'position-right-general': posRight.value,
									'position-right-unit-general': posRight.unit,
									'position-sync-general': 'none',
								};
							}
							break;
						case 'position_bottom':
							{
								const posBottom = parseUnitValue(value);
								changes = {
									'position-bottom-general': posBottom.value,
									'position-bottom-unit-general': posBottom.unit,
									'position-sync-general': 'none',
								};
							}
							break;
						case 'position_left':
							{
								const posLeft = parseUnitValue(value);
								changes = {
									'position-left-general': posLeft.value,
									'position-left-unit-general': posLeft.unit,
									'position-sync-general': 'none',
								};
							}
							break;
						case 'display':
							changes =
								buildContainerDGroupAttributeChanges(property, value) ||
								updateDisplay(value);
							break;
						case 'extra_class_name':
						case 'extra_class':
							changes = buildContainerEGroupAttributeChanges(property, value);
							break;
						case 'flex_basis':
						case 'flex_grow':
						case 'flex_shrink':
						case 'flex_direction':
						case 'flex_wrap':
						case 'force_aspect_ratio':
						case 'full_width':
							changes = buildContainerFGroupAttributeChanges(property, value);
							break;
						case 'link_settings':
						case 'dc_link':
						case 'dc_link_status':
						case 'dc_link_target':
						case 'dc_link_url':
							changes = buildContainerLGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
							break;
						// ======= CALLOUT ARROW =======
						case 'arrow_status':
						case 'arrow_side':
						case 'arrow_position':
						case 'arrow_width': {
							changes = buildContainerAGroupAttributeChanges(property, value, {
								block,
								attributes: block.attributes,
							});
							break;
						}
						// ======= META / ACCESSIBILITY =======
						case 'anchor_link':
						case 'aria_label': {
							const metaChanges = buildContainerMetaAttributeChanges(
								property,
								value,
								block?.attributes
							);
							if (metaChanges) {
								changes = metaChanges;
							}
							break;
						}
						case 'advanced_css': {
							changes = buildContainerAGroupAttributeChanges(property, value, {
								block,
								attributes: block.attributes,
							});
							break;
						}
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

						// ======= BLOCK ACTIONS (Delegated) =======
						default:
							if (property && String(property).startsWith('cl_')) {
								changes = buildContainerCGroupAttributeChanges(property, value, {
									attributes: block.attributes,
								});
								if (changes) break;
							}
							// Try delegating to block-specific handlers
							const blockHandler = getAiHandlerForBlock(block);
							if (blockHandler) {
								const handlerChanges = blockHandler(block, property, value, prefix);
								if (handlerChanges) {
									changes = handlerChanges;
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
						case 'line_height': {
							const parsed = parseUnitValue(value, '-');
							const values = buildResponsiveScaledValues({
								value: parsed.value,
								unit: parsed.unit,
								forceScale: true,
								min: 1,
							});
							changes = {};
							RESPONSIVE_BREAKPOINTS.forEach(bp => {
								changes[`line-height-${bp}`] = values[bp];
								changes[`line-height-unit-${bp}`] = parsed.unit;
							});
							break;
						}
						case 'letter_spacing': {
							const parsed = parseUnitValue(value, 'px');
							const values = buildResponsiveScaledValues({
								value: parsed.value,
								unit: parsed.unit,
							});
							changes = {};
							RESPONSIVE_BREAKPOINTS.forEach(bp => {
								changes[`letter-spacing-${bp}`] = values[bp];
								changes[`letter-spacing-unit-${bp}`] = parsed.unit;
							});
							break;
						}
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
							changes = buildShapeDividerChanges('bottom', value);
							break;
						case 'shape_divider_top':
							changes = buildShapeDividerChanges('top', value);
							break;
						case 'shape_divider_bottom':
							changes = buildShapeDividerChanges('bottom', value);
							break;
						case 'shape_divider_both': {
							const topChanges = buildShapeDividerChanges('top', value);
							const bottomChanges = buildShapeDividerChanges('bottom', value);
							if (topChanges || bottomChanges) {
								changes = { ...topChanges, ...bottomChanges };
							}
							break;
						}
						case 'shape_divider_color_top':
							changes = buildShapeDividerColorChanges('top', value);
							break;
						case 'shape_divider_color_bottom':
							changes = buildShapeDividerColorChanges('bottom', value);
							break;
						case 'shape_divider_color': {
							const topChanges = buildShapeDividerColorChanges('top', value);
							const bottomChanges = buildShapeDividerColorChanges('bottom', value);
							if (topChanges || bottomChanges) {
								changes = { ...topChanges, ...bottomChanges };
							}
							break;
						}
						case 'clip_path':
							changes = { 
								'clip-path-general': value,
								'clip-path-status-general': value !== 'none',
							};
							break;
						// ======= CONSTRAINTS & SIZING =======
						case 'max_width':
							{
								const maxWidth = parseUnitValue(value);
								changes = buildResponsiveSizeChanges(prefix, 'max-width', maxWidth.value, maxWidth.unit, true);
							}
							break;
						case 'min_width':
							{
								const minWidth = parseUnitValue(value);
								changes = buildResponsiveSizeChanges(prefix, 'min-width', minWidth.value, minWidth.unit, true);
							}
							break;
						case 'max_height':
							{
								const maxHeight = parseUnitValue(value);
								changes = buildResponsiveSizeChanges(prefix, 'max-height', maxHeight.value, maxHeight.unit, true);
							}
							break;
						case 'full_width': {
							const isFull = value === undefined ? true : Boolean(value);
							changes = {
								...buildBreakpointChanges(prefix, 'full-width', isFull),
								[`${prefix}size-advanced-options`]: true,
							};
							break;
						}
						case 'min_height':
							{
								const minHeight = parseUnitValue(value);
								changes = buildResponsiveSizeChanges(prefix, 'min-height', minHeight.value, minHeight.unit, true);
							}
							break;
						case 'maxi_version_current':
						case 'maxi_version_origin':
							changes = buildContainerMGroupAttributeChanges(property, value);
							break;
						// ======= ROW PATTERNS =======
						case 'row_pattern':
							// Row patterns are complex - just set a marker attribute
							changes = { 'row-pattern-general': value };
							break;
						// ======= CONTEXT LOOP =======
						case 'context_loop':
							changes =
								buildContainerCGroupAttributeChanges(property, value, {
									attributes: block.attributes,
								}) || buildContextLoopChanges(value);
							break;
						case 'pagination':
						case 'pagination_type':
						case 'pagination_load_more_label':
						case 'pagination_show_pages':
						case 'pagination_spacing':
						case 'pagination_style':
						case 'pagination_text':
						case 'custom_css':
						case 'custom_label':
						case 'column_gap':
						case 'cl_attributes':
							changes = buildContainerCGroupAttributeChanges(property, value, {
								attributes: block.attributes,
							});
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
						case 'font_size_relative': {
							const textLevel = block.attributes?.textLevel || 'p';
							const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
							const multiplier = Number(value);
							const getNumeric = raw => {
								const num = Number(raw);
								return Number.isFinite(num) && num > 0 ? num : null;
							};
							const getSizeForBreakpoint = bp => {
								const fromCustom = getCustomFormatValue({
									typography: block.attributes,
									prop: 'font-size',
									breakpoint: bp,
									textLevel,
								});
								const customSize = getNumeric(fromCustom);
								if (customSize !== null) return customSize;

								const fallbackSize = getLastBreakpointAttribute({
									target: 'font-size',
									breakpoint: bp,
									attributes: block.attributes,
									forceSingle: true,
									forceUseBreakpoint: true,
									avoidXXL: false,
								});
								return getNumeric(fallbackSize);
							};
							const getUnitForBreakpoint = bp => {
								const fromCustom = getCustomFormatValue({
									typography: block.attributes,
									prop: 'font-size-unit',
									breakpoint: bp,
									textLevel,
								});
								if (fromCustom) return fromCustom;

								const fallbackUnit = getLastBreakpointAttribute({
									target: 'font-size-unit',
									breakpoint: bp,
									attributes: block.attributes,
									forceSingle: true,
									forceUseBreakpoint: true,
									avoidXXL: false,
								});
								return fallbackUnit || 'px';
							};
							const roundSize = (size, unit) => {
								if (!Number.isFinite(size)) return size;
								const normalizedUnit = String(unit || 'px').toLowerCase();
								if (normalizedUnit === 'px') return Math.round(size);
								return Math.round(size * 100) / 100;
							};

							changes = {};
							breakpoints.forEach(bp => {
								const currentSize = getSizeForBreakpoint(bp) ?? 16;
								const unit = getUnitForBreakpoint(bp);
								const nextSize = roundSize(currentSize * multiplier, unit);
								changes[`font-size-${bp}`] = nextSize;
								if (unit) {
									changes[`font-size-unit-${bp}`] = unit;
								}
							});
							break;
						}
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
							changes = updateMargin(value, 'top', prefix);
							break;
						case 'margin_bottom':
							changes = updateMargin(value, 'bottom', prefix);
							break;
						case 'margin_left':
							changes = updateMargin(value, 'left', prefix);
							break;
						case 'margin_right':
							changes = updateMargin(value, 'right', prefix);
							break;
						// ======= DIRECTIONAL PADDING =======
						case 'padding_top':
							changes = updatePadding(value, 'top', prefix);
							break;
						case 'padding_bottom':
							changes = updatePadding(value, 'bottom', prefix);
							break;
						case 'padding_left':
							changes = updatePadding(value, 'left', prefix);
							break;
						case 'padding_right':
							changes = updatePadding(value, 'right', prefix);
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

				// Fallback: let block-specific handlers process unsupported properties
				if (isMaxi && isMatch && !changes && !String(property || '').startsWith('flow_')) {
					const blockHandler = getAiHandlerForBlock(block);
					if (blockHandler) {
						const handlerResult = blockHandler(block, property, value, prefix, { mode: scope });
						if (handlerResult?.action === 'apply') {
							changes = handlerResult.attributes;
						} else if (handlerResult && !handlerResult.action) {
							changes = handlerResult;
						}
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

	const SHAPE_DIVIDER_PROPERTIES = new Set([
		'shape_divider',
		'shape_divider_top',
		'shape_divider_bottom',
		'shape_divider_both',
		'shape_divider_color',
		'shape_divider_color_top',
		'shape_divider_color_bottom',
	]);

	const normalizeTargetBlock = (property, targetBlock) =>
		SHAPE_DIVIDER_PROPERTIES.has(property) ? 'container' : targetBlock;

	const handleUpdatePage = (property, value, targetBlock = null, clientId = null) => {
		let count = 0;
		const normalizedTarget = normalizeTargetBlock(property, targetBlock);
		// Wrap in batch to prevent multiple re-renders
		registry.batch(() => {
			count = applyUpdatesToBlocks(allBlocks, property, value, normalizedTarget, clientId);
		});
		return `Updated ${count} blocks on the page.`;
	};

	const handleUpdateSelection = (property, value, targetBlock = null) => {
		if (!selectedBlock) return __('Please select a block first.', 'maxi-blocks');
		
		let count = 0;
		let usedParentFallback = false;
		const parentFallbackProps = new Set([
			'align_items_flex',
			'justify_content',
			'flex_direction',
			'flex_wrap',
			'gap',
			'dead_center',
			'align_everything',
		]);
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
		const normalizedTarget = normalizeTargetBlock(property, targetBlock);
		
		// Wrap in batch
		registry.batch(() => {
			count = applyUpdatesToBlocks(blocksToProcess, property, value, normalizedTarget);
		});

		if (count === 0 && (parentFallbackProps.has(property) || normalizedTarget)) {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(selectedBlock.clientId) || [];
			const parentBlocks = parentIds
				.map(parentId => getBlock(parentId))
				.filter(Boolean);

			let fallbackParent = null;
			if (normalizedTarget) {
				fallbackParent = parentBlocks.find(parent =>
					matchesTargetBlockName(parent.name, normalizedTarget)
				);
			}

			if (!fallbackParent && normalizedTarget && String(normalizedTarget).toLowerCase() === 'container') {
				fallbackParent = parentBlocks.find(parent =>
					parent &&
					(parent.name.includes('column') ||
						parent.name.includes('row') ||
						parent.name.includes('group') ||
						parent.name.includes('container'))
				);
			}

			if (!fallbackParent && parentFallbackProps.has(property)) {
				fallbackParent = parentBlocks.find(parent =>
					parent &&
					(parent.name.includes('column') ||
						parent.name.includes('row') ||
						parent.name.includes('group') ||
						parent.name.includes('container'))
				);
			}

			if (fallbackParent) {
				registry.batch(() => {
					count = applyUpdatesToBlocks([fallbackParent], property, value, null, fallbackParent.clientId);
				});
				usedParentFallback = count > 0;
			}
		}


		if (count === 0) {
			return __('No matching components found in selection.', 'maxi-blocks');
		}

		if (usedParentFallback) {
			return __('Updated the parent layout block.', 'maxi-blocks');
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

	const normalizeActionProperty = (property, value) => {
		if (!property) return { property, value };

		let nextProperty = ACTION_PROPERTY_ALIASES[property] || property;
		nextProperty = String(nextProperty).replace(/-/g, '_');
		if (nextProperty.startsWith('cl_') || nextProperty.startsWith('dc_')) {
			return { property: nextProperty, value };
		}

		const breakpointMatch = nextProperty.match(/_(general|xxl|xl|l|m|s|xs)$/);
		const breakpoint = breakpointMatch ? breakpointMatch[1] : null;
		const baseProperty = breakpoint
			? nextProperty.slice(0, -(`_${breakpoint}`.length))
			: nextProperty;

		if (
			baseProperty === 'background_palette_color' ||
			baseProperty === 'background_color'
		) {
			let nextValue = value;
			if (typeof nextValue === 'string') {
				const trimmed = nextValue.trim();
				if (/^\d+$/.test(trimmed)) {
					nextValue = Number(trimmed);
				} else {
					const paletteMatch = trimmed.match(
						/^var\(--(?:bg|maxi-light-color|maxi-color)-(\d+)\)$/
					);
					if (paletteMatch) {
						nextValue = Number(paletteMatch[1]);
					}
				}
			}
			return {
				property: 'background_color',
				value: breakpoint ? { value: nextValue, breakpoint } : nextValue,
			};
		}

		if (baseProperty === 'border_radius' && breakpoint) {
			return {
				property: 'border_radius',
				value: { value, breakpoint },
			};
		}

		if (
			[
				'arrow_status',
				'arrow_side',
				'arrow_position',
				'arrow_width',
				'advanced_css',
				'custom_css',
				'column_gap',
				'flex_basis',
				'flex_grow',
				'flex_shrink',
				'flex_direction',
				'flex_wrap',
				'force_aspect_ratio',
				'full_width',
				'height',
			].includes(baseProperty) &&
			breakpoint
		) {
			return {
				property: baseProperty,
				value: { value, breakpoint },
			};
		}

		if (baseProperty === 'display' && breakpoint) {
			return {
				property: 'display',
				value: { value, breakpoint },
			};
		}

		if (baseProperty === 'breakpoints' && breakpoint) {
			return {
				property: 'breakpoints',
				value: { value, breakpoint },
			};
		}

		if (baseProperty === 'link_target') {
			let targetValue = value;
			if (typeof targetValue === 'string') {
				const lowered = targetValue.toLowerCase();
				if (lowered.includes('blank') || lowered.includes('new')) {
					targetValue = '_blank';
				} else if (lowered.includes('self') || lowered.includes('same')) {
					targetValue = '_self';
				}
			}
			return { property: 'link_settings', value: { target: targetValue } };
		}

		if (baseProperty === 'link_rel') {
			return { property: 'link_settings', value: { rel: value } };
		}

		if (baseProperty === 'link_url') {
			return { property: 'link_settings', value: { url: value } };
		}

		return { property: baseProperty, value };
	};

	const parseAndExecuteAction = async responseText => {
		const openSidebarForProperty = rawProperty => {
			if (!rawProperty) return;
			const property = String(rawProperty).replace(/-/g, '_');
			const baseProperty = property.replace(/_(general|xxl|xl|l|m|s|xs)$/, '');
			const normalizedProperty = baseProperty;
			const aGroupTarget = getContainerAGroupSidebarTarget(normalizedProperty);
			if (aGroupTarget) {
				openSidebarAccordion(aGroupTarget.tabIndex, aGroupTarget.accordion);
				return;
			}
			const bGroupTarget = getContainerBGroupSidebarTarget(normalizedProperty);
			if (bGroupTarget) {
				openSidebarAccordion(bGroupTarget.tabIndex, bGroupTarget.accordion);
				return;
			}
			const cGroupTarget = getContainerCGroupSidebarTarget(normalizedProperty);
			if (cGroupTarget) {
				openSidebarAccordion(cGroupTarget.tabIndex, cGroupTarget.accordion);
				return;
			}
			const dGroupTarget = getContainerDGroupSidebarTarget(normalizedProperty);
			if (dGroupTarget) {
				openSidebarAccordion(dGroupTarget.tabIndex, dGroupTarget.accordion);
				return;
			}
			const eGroupTarget = getContainerEGroupSidebarTarget(normalizedProperty);
			if (eGroupTarget) {
				openSidebarAccordion(eGroupTarget.tabIndex, eGroupTarget.accordion);
				return;
			}
			const fGroupTarget = getContainerFGroupSidebarTarget(normalizedProperty);
			if (fGroupTarget) {
				openSidebarAccordion(fGroupTarget.tabIndex, fGroupTarget.accordion);
				return;
			}
			const hGroupTarget = getContainerHGroupSidebarTarget(normalizedProperty);
			if (hGroupTarget) {
				openSidebarAccordion(hGroupTarget.tabIndex, hGroupTarget.accordion);
				return;
			}
			const lGroupTarget = getContainerLGroupSidebarTarget(normalizedProperty);
			if (lGroupTarget) {
				openSidebarAccordion(lGroupTarget.tabIndex, lGroupTarget.accordion);
				return;
			}
			const mGroupTarget = getContainerMGroupSidebarTarget(normalizedProperty);
			if (mGroupTarget) {
				openSidebarAccordion(mGroupTarget.tabIndex, mGroupTarget.accordion);
				return;
			}

			switch (normalizedProperty) {
				case 'responsive_padding':
				case 'padding':
				case 'margin':
					openSidebarAccordion(0, 'margin / padding');
					return;
				case 'size':
				case 'width':
				case 'height':
				case 'min_width':
				case 'max_width':
				case 'min_height':
				case 'max_height':
				case 'full_width':
				case 'width_fit_content':
				case 'height_fit_content':
					openSidebarAccordion(0, 'height / width');
					return;
				case 'background_color':
				case 'background_palette_color':
				case 'background_palette_status':
				case 'background_palette_opacity':
				case 'background':
				case 'background_layers':
				case 'background_layers_hover':
				case 'block_background_status_hover':
					openSidebarAccordion(0, 'background / layer');
					return;
				case 'border':
				case 'border_radius':
				case 'border_hover':
					openSidebarAccordion(0, 'border');
					return;
				case 'box_shadow':
				case 'box_shadow_hover':
				case 'hover_glow':
					openSidebarAccordion(0, 'box shadow');
					return;
				case 'shape_divider':
				case 'shape_divider_top':
				case 'shape_divider_bottom':
				case 'shape_divider_both':
				case 'shape_divider_color':
				case 'shape_divider_color_top':
				case 'shape_divider_color_bottom':
					openSidebarAccordion(0, 'shape divider');
					return;
				case 'context_loop':
					openSidebarAccordion(0, 'context loop');
					return;
				case 'arrow_status':
				case 'arrow_side':
				case 'arrow_position':
				case 'arrow_width':
					openSidebarAccordion(0, 'callout arrow');
					return;
				case 'anchor_link':
				case 'aria_label': {
					const sidebarTarget = getContainerMetaSidebarTarget(property);
					if (sidebarTarget) {
						openSidebarAccordion(
							sidebarTarget.tabIndex,
							sidebarTarget.accordion
						);
					}
					return;
				}
				case 'custom_css':
					openSidebarAccordion(1, 'custom css');
					return;
				case 'advanced_css':
					openSidebarAccordion(1, 'advanced css');
					return;
				case 'scroll_fade':
					openSidebarAccordion(1, 'scroll effects');
					return;
				case 'transform':
				case 'transform_scale_hover':
				case 'hover_effect':
				case 'hover_lift':
					openSidebarAccordion(1, 'transform');
					return;
				case 'transition':
					openSidebarAccordion(1, 'hover transition');
					return;
				case 'display':
				case 'display_mobile':
				case 'display_tablet':
				case 'display_desktop':
				case 'show_mobile_only':
					openSidebarAccordion(1, 'show/hide block');
					return;
				case 'opacity':
				case 'opacity_hover':
				case 'opacity_status_hover':
				case 'hover_darken':
				case 'hover_lighten':
					openSidebarAccordion(1, 'opacity');
					return;
				case 'position':
				case 'position_top':
				case 'position_right':
				case 'position_bottom':
				case 'position_left':
					openSidebarAccordion(1, 'position');
					return;
				case 'overflow':
					openSidebarAccordion(1, 'overflow');
					return;
				case 'z_index':
					openSidebarAccordion(1, 'z-index');
					return;
				case 'align_items':
				case 'align_items_flex':
				case 'align_content':
				case 'justify_content':
				case 'flex_direction':
				case 'flex_wrap':
				case 'gap':
				case 'row_gap':
				case 'column_gap':
					openSidebarAccordion(1, 'flexbox');
					return;
				default:
			}
		};

		const extractJsonChunks = text => {
			if (typeof text !== 'string') return [];
			const chunks = [];
			let depth = 0;
			let start = -1;
			let inString = false;
			let escapeNext = false;

			for (let i = 0; i < text.length; i += 1) {
				const ch = text[i];

				if (escapeNext) {
					escapeNext = false;
					continue;
				}

				if (ch === '\\\\') {
					escapeNext = true;
					continue;
				}

				if (ch === '"') {
					inString = !inString;
					continue;
				}

				if (inString) continue;

				if (ch === '{' || ch === '[') {
					if (depth === 0) start = i;
					depth += 1;
				} else if (ch === '}' || ch === ']') {
					depth -= 1;
					if (depth === 0 && start !== -1) {
						chunks.push(text.slice(start, i + 1));
						start = -1;
					}
				}
			}

			return chunks;
		};

		try {
			if (typeof responseText === 'string') {
				const chunks = extractJsonChunks(responseText);
				if (chunks.length > 1) {
					const parsedChunks = [];
					chunks.forEach(chunk => {
						try {
							parsedChunks.push(JSON.parse(chunk));
						} catch (parseError) {
							console.warn(
								'[Maxi AI Debug] Failed to parse JSON chunk:',
								parseError
							);
						}
					});

					let lastResult = { executed: false };
					for (const item of parsedChunks) {
						lastResult = await parseAndExecuteAction(item);
					}
					return lastResult;
				}
			}

			let action;
			
			// If already an object (from client-side interception), use it directly
			if (typeof responseText === 'object' && responseText !== null) {
				action = responseText;
			} else {
				try {
					action = JSON.parse(responseText.trim());
				} catch {
					const chunks = extractJsonChunks(responseText);
					if (chunks.length === 1) {
						try {
							action = JSON.parse(chunks[0]);
						} catch (parseError) {
							console.warn('[Maxi AI Debug] Failed to parse JSON from response:', parseError);
						}
					} else if (chunks.length > 1) {
						const parsedChunks = [];
						chunks.forEach(chunk => {
							try {
								parsedChunks.push(JSON.parse(chunk));
							} catch (parseError) {
								console.warn('[Maxi AI Debug] Failed to parse JSON chunk:', parseError);
							}
						});
						if (parsedChunks.length === 1) action = parsedChunks[0];
						else if (parsedChunks.length > 1) action = parsedChunks;
					}
				}
			}

			if (action?.actions && Array.isArray(action.actions)) {
				action = action.actions;
			}

			if (Array.isArray(action)) {
				let lastResult = { executed: false };
				for (const item of action) {
					lastResult = await parseAndExecuteAction(item);
				}
				return lastResult;
			}

			if (action?.property) {
				const normalized = normalizeActionProperty(action.property, action.value);
				action.property = normalized.property;
				action.value = normalized.value;
			}

			// FALLBACK: If AI returned plain text for known clarification patterns, synthesize the response
			if (!action || !action.action) {
				const responseString = typeof responseText === 'string'
					? responseText
					: JSON.stringify(responseText || '');
				const lowerText = responseString.toLowerCase();
				
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
						options: ['Soft', 'Crisp', 'Bold', 'Glow']
					};
				}

				// Detect spacing/padding clarification
				if (lowerText.includes('spacing') || lowerText.includes('padding') || lowerText.includes('space')) {
					console.log('[Maxi AI Debug] Fallback: Detected spacing clarification in plain text');
					return {
						executed: false,
						message: 'How much vertical spacing would you like?',
						options: ['Compact', 'Comfortable', 'Spacious', 'Remove']
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
				return { executed: false, message: responseString };
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
				// ORCHESTRATION LAYER: Determine target blocks based on scope
				let targetBlocks = [];
				let prefix = ''; // Prefix logic might need to be per-block if they differ, but usually consistent for buttons

				if (scope === 'selection') {
					if (selectedBlock) {
						targetBlocks = [selectedBlock];
						prefix = getBlockPrefix(selectedBlock.name);
					} else {
						return {
							executed: false,
							message: __('Please select a block first.', 'maxi-blocks'),
						};
					}
				} else if (scope === 'page') {
					// Recursive search for ALL buttons on the page
					targetBlocks = collectBlocks(allBlocks, (b) => b.name.includes('button'));
					
					if (targetBlocks.length === 0) {
						return {
							executed: false,
							message: __('There are no Maxi buttons on this page to update.', 'maxi-blocks'),
						};
					}
					// Note: prefix might vary if we supported mixed block types, but for "buttons" it's usually button-
					// We'll calculate prefix inside the loop for safety.
				}

				let changes = {};
				const allBulkUpdates = {}; // clientId -> attributes

				console.log('[Maxi AI Debug] MODIFY_BLOCK - Scope:', scope, 'Targets:', targetBlocks.length);

				// Helper to collect changes for a single block (REFACTORED to take block argument)
				const getChangesForBlock = (targetBlock, prop, val) => {
					let c = null;
					const blkPrefix = getBlockPrefix(targetBlock.name);
					
					// Detect removal commands
					const isRemoval = val === null || val === 'none' || val === 'remove' || val === 0 || val === '0' || val === 'square';
					
					switch (prop) {
						case 'padding': c = updatePadding(val, null, prefix); break;
						case 'margin': c = updateMargin(val, null, prefix); break;
						case 'spacing_preset': c = createResponsiveSpacing(val, prefix); break;
						case 'background_color': c = updateBackgroundColor(targetBlock.clientId, val, targetBlock.attributes, blkPrefix); break;
						case 'border': 
							if (isRemoval) c = updateBorder(0, 'none', null, blkPrefix);
							else if (typeof val === 'object') c = updateBorder(val.width, val.style, val.color, blkPrefix);
							else {
								const parts = String(val).split(' ');
								if (parts.length >= 3) c = updateBorder(parseInt(parts[0]), parts[1], parts.slice(2).join(' '), blkPrefix);
								else if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('var')) c = updateBorder(1, 'solid', val, blkPrefix);
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
							c = updateBorderRadius(rVal, null, blkPrefix); 
							break;
						case 'shadow':
						case 'box_shadow':
						case 'box-shadow':
							if (isRemoval) c = removeBoxShadow(blkPrefix);
							else if (typeof val === 'object') c = updateBoxShadow(val.x, val.y, val.blur, val.spread, val.color, blkPrefix);
							else c = { [`${blkPrefix}box-shadow-general`]: val, [`${blkPrefix}box-shadow-status-general`]: true };
							break;
						case 'width': c = buildWidthChanges(val, blkPrefix); break;
						case 'height': c = buildHeightChanges(val, blkPrefix); break;
						case 'objectFit':
						case 'object_fit': c = updateImageFit(val); break;
						case 'opacity': c = updateOpacity(val); break;
						// Typography properties
						case 'text_color':
						case 'color':
							// Apply to text, headings, buttons, etc.
							c = updateTextColor(val, blkPrefix);
							break;
						case 'font_size':
						case 'fontSize':
							c = updateFontSize(val);
							break;
						case 'font_weight':
						case 'fontWeight':
							c = updateFontWeight(val);
							break;
						// ======= BLOCK ACTIONS (Delegated) =======
						default:
							// Pass current conversation data if this flow matches the active conversation
							// Check payload for explicit data override (from handleSuggestion loop)
							const payloadData = action.payload?._conversationData;
							
							const currentData = payloadData || ((conversationContext && conversationContext.flow === prop) 
								? conversationContext.data 
								: {});
							
							// Add mode to context (Standardized)
							const updateContext = { ...currentData, mode: scope };

							// Call handler for THIS SPECIFIC BLOCK
							const blockHandler = getAiHandlerForBlock(targetBlock);
							const result = blockHandler
								? blockHandler(targetBlock, prop, val, blkPrefix, updateContext)
								: null;
							let handlerChanges = null;

							if (result) {
								if (result.action === 'apply') {
									handlerChanges = result.attributes;
									if (result.done) {
                                        // Mark flow as finishing, but we might have other blocks.
                                        // Wait, if one block says done, are they all done? Usually yes for same flow.
                                        // We'll set a flag to clear context later.
                                        conversationStep = { executed: true, done: true }; 
                                    }
								} else if (result.action) {
									// Interaction Request (Step in Flow)
									console.log('[Maxi AI Conversation] Interaction Request from block:', targetBlock.clientId, result);
									return { 
										_isConversationStep: true, 
										...result,
										flow: prop
									};
								} else {
                                    // Legacy/Simple return (just changes)
                                    handlerChanges = result;
                                }
							}
							
							if (handlerChanges) c = handlerChanges;
							break;
					}
					
					// If we got a conversation step trigger, pass it up instantly
					if (c && c._isConversationStep) return c;
					
					// If we got a bulk update result (executed: true), pass it up
					if (c && c.executed) return c;

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
					let hasUpdates = false;
					let conversationStep = null;

					// LOOP 1: Properties
					for (const [prop, val] of Object.entries(p)) {
						
						// LOOP 2: Target Blocks
						for (const block of targetBlocks) {
							// Special handling for spacing object
							let c = null;
							if (prop === 'spacing' && typeof val === 'object') {
								if (val.padding) {
									const res = getChangesForBlock(block, 'padding', val.padding);
									if (res && res._isConversationStep) conversationStep = res;
									else if (res) Object.assign(allBulkUpdates[block.clientId] || (allBulkUpdates[block.clientId] = {}), res);
								}
								if (val.margin) {
									const res = getChangesForBlock(block, 'margin', val.margin);
									if (res && res._isConversationStep) conversationStep = res;
									else if (res) Object.assign(allBulkUpdates[block.clientId] || (allBulkUpdates[block.clientId] = {}), res);
								}
							} else {
								const res = getChangesForBlock(block, prop, val);
								
								// Check for Conversation Step
								if (res && res._isConversationStep) {
									conversationStep = res;
									break; // Stop processing blocks, return to user
								}

								console.log('[Maxi AI Debug] getChangesForBlock result:', block.clientId, prop, val, '->', res);
								if (res) {
									if (!allBulkUpdates[block.clientId]) allBulkUpdates[block.clientId] = {};
									Object.assign(allBulkUpdates[block.clientId], res);
									hasUpdates = true;
								}
							}
						}
						
						if (conversationStep) break; // Stop processing properties
					}

					// Handle Conversation Step Return
					if (conversationStep) {
						const c = conversationStep;
						console.log('[Maxi AI Conversation] Setting Context:', c);
						setConversationContext({
							flow: c.flow,
							pendingTarget: c.target,
							data: conversationContext?.data || {},
							currentOptions: c.options || []
						});
						
						let displayOptions = c.options;
						if (Array.isArray(c.options) && typeof c.options[0] === 'object') {
							displayOptions = c.options.map(o => o.label);
						}

						return {
							executed: false,
							message: c.msg,
							options: displayOptions,
							optionsType: c.action === 'ask_palette' ? 'palette' : 'text'
						};
					}

                    // Check for Completion
                    if (conversationStep && conversationStep.done) {
                         // Flow completed successfully
						setConversationContext(null); // CLEAR STATE
                    }

					// If we reached here, the flow is either finished or not active
					if (conversationContext && !conversationStep) {
                        // Inherit old behavior: if no explicit step returned, maybe we are done?
                        // But we want explicit control now.
                        // For now we keep this as fallback clearing if nothing returned.
						setConversationContext(null);
					}

					console.log('[Maxi AI Debug] Final Bulk Updates:', Object.keys(allBulkUpdates).length, 'blocks');
					
					if (Object.keys(allBulkUpdates).length > 0) {
						// Batch Update
						Object.entries(allBulkUpdates).forEach(([clientId, attrs]) => {
							dispatch('core/block-editor').updateBlockAttributes(clientId, attrs);
						});
						console.log('[Maxi AI Debug] dispatch updateBlockAttributes called for all blocks');
						return { executed: true, message: scope === 'page' ? 'Updated all buttons on page.' : 'Updated selection.' };
					} else {
						return { executed: true, message: 'No changes needed.' };
					}
				}

				// 3. Handle Direct Property/Value
				if (action.property && action.value !== undefined) {
					const c = getChangesForSelection(action.property, action.value);
					
					// Check for Conversation Step (Direct Property)
					if (c && c._isConversationStep) {
						console.log('[Maxi AI Conversation] Setting Context (Direct):', c);
						setConversationContext({
							flow: c.flow,
							pendingTarget: c.target,
							data: conversationContext?.data || {},
							currentOptions: c.options || []
						});
						
						let displayOptions = c.options;
						if (Array.isArray(c.options) && typeof c.options[0] === 'object') {
							displayOptions = c.options.map(o => o.label);
						}

						return {
							executed: false,
							message: c.msg,
							options: displayOptions,
							optionsType: c.action === 'ask_palette' ? 'palette' : 'text'
						};
					}

                    // Check for Bulk/Direct Execution
                    if (c && c.executed) {
                        return c;
                    }

					if (c) {
						dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, c);
						if (conversationContext) setConversationContext(null); // Cleanup
					}
				}

				// 4. Trigger Sidebar Expand based on properties (Enhanced Selection Feedback)
				const targetProp = action.property || (action.payload ? Object.keys(action.payload)[0] : null);
				if (action.payload?.spacing_preset) {
					openSidebarForProperty('responsive_padding');
				} else if (action.payload?.shadow) {
					openSidebarForProperty('box_shadow');
				} else if (action.payload?.border) {
					openSidebarForProperty('border');
				} else {
					openSidebarForProperty(targetProp);
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

				if (property) {
					const normalized = normalizeActionProperty(property, value);
					property = normalized.property;
					value = normalized.value;
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
				openSidebarForProperty(property);

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
				
				if (property) {
					const normalized = normalizeActionProperty(property, value);
					property = normalized.property;
					value = normalized.value;
				}
				
				// Normalizations
				if (property === 'border_radius' && typeof value === 'string') {
					if (value.includes('subtle') || value === '8px') value = 8;
					else if (value.includes('soft') || value === '24px') value = 24;
					else if (value.includes('full') || value === '50px') value = 50;
					else if (value.includes('square') || value === '0px') value = 0;
					else value = parseInt(value) || 8;
				}

				const isLinkProperty =
					property === 'link_settings' ||
					String(property || '').startsWith('dc_link');
				const resultMsg = handleUpdateSelection(
					property,
					value,
					isLinkProperty ? null : action.target_block
				);
				console.log('[Maxi AI Debug] handleUpdateSelection result:', resultMsg);

				// EXPAND SIDEBAR
				openSidebarForProperty(property);

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

	// Helper to summarize block structure recursively (to save tokens)
	const summarizeBlockStructure = (block, depth = 0) => {
		if (!block || depth > 4) return null; // Limit depth

		const summary = {
			name: block.name,
			clientId: block.clientId,
			// Include key attributes that affect layout/style
			attributes: {
				...(block.attributes.layout ? { layout: block.attributes.layout } : {}),
				...(block.attributes.style ? { style: block.attributes.style } : {}),
				...(block.attributes.tagName ? { tagName: block.attributes.tagName } : {}),
				...(block.attributes.className ? { className: block.attributes.className } : {}),
				// Add Maxi specific attrs if needed
				...(block.attributes.containerWidth ? { containerWidth: block.attributes.containerWidth } : {}),
				...(block.attributes.contentWidth ? { contentWidth: block.attributes.contentWidth } : {}),
			}
		};

		// Recursively summarize inner blocks
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			summary.innerBlocks = block.innerBlocks
				.map(child => summarizeBlockStructure(child, depth + 1))
				.filter(Boolean);
		}

		return summary;
	};

	const sendMessage = async () => {
		if (!input.trim()) return;

		const rawMessage = input;
		const userMessage = { role: 'user', content: rawMessage };
		setMessages(prev => [...prev, userMessage]);
		setInput('');

		// === FLOW STATE MACHINE BYPASS ===
		// If we are in an active flow, do NOT run standard pattern matching.
		// Instead, assume the user's input is the answer to the previous question and route it back to MODIFY_BLOCK.
		if (conversationContext && conversationContext.flow) {
			if (scope === 'global') {
				setConversationContext(null);
			} else {
				console.log('[Maxi AI Conversation] Active flow detected:', conversationContext.flow);
			
				// FSM Strict Mode: Ignore natural language during flow, require selection
				// UNLESS it's a valid option text that matches our current options?
				// The user requirement says "Pause NLU". 
				// But if they type "Soft", we should probably accept it if it matches an option.
				
				const options = conversationContext.currentOptions;
				const hasOptions = Array.isArray(options) && options.length > 0;
				const isOptionMatch = hasOptions && options.some(o =>
					(typeof o === 'string' ? o.toLowerCase() : o.label.toLowerCase()) === input.toLowerCase()
				);

				if (isOptionMatch || !hasOptions) {
					// Let handleSuggestion handle it via the standard flow re-entry
					handleSuggestion(input);
					return;
				}

				setMessages(prev => [...prev, { 
					role: 'assistant', 
					content: "Please select an option or colour to continue.", 
					executed: false 
				}]);
				setIsLoading(false);
				return;
			}
		}

		// Process predefined flows (client-side interception)
		const lowerMessage = rawMessage.toLowerCase();
		const hexColor = extractHexColor(rawMessage);
		const currentScope = scope === 'global' ? 'global' : (conversationContext?.mode || scope); // Use context mode if in a flow, or tab state
		const isGlobalScope = currentScope === 'global';
		const lastClarificationMsg = messagesRef.current?.findLast(
			m => m.role === 'assistant' && m.options
		);
		const lastClarifyContent =
			typeof lastClarificationMsg?.content === 'string'
				? lastClarificationMsg.content.toLowerCase()
				: '';
		
		// 0. SELECTION CHECK: If in Selection mode, enforce that a block MUST be selected
		if (currentScope === 'selection' && !selectedBlock) {
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: 'Please select a block on the page first so I know what to modify.',
					executed: false,
					testId: 'maxi-ai-selection-required',
				},
			]);
			return;
		}

		setIsLoading(true);

		const queueDirectAction = directAction => {
			setIsLoading(true);
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: result.message,
						executed: result.executed,
					},
				]);
				setIsLoading(false);
			}, 50);
		};

		const actionType = currentScope === 'page' ? 'update_page' : 'update_selection';
		const actionTarget =
			actionType === 'update_page' ? { target_block: 'container' } : {};

		const isTextSelection =
			selectedBlock?.name?.includes('text-maxi') ||
			selectedBlock?.name?.includes('list-item-maxi');
		const textLinkUrl = isTextSelection ? extractUrl(rawMessage) : null;
		if (isTextSelection && textLinkUrl) {
			const lowerRaw = rawMessage.toLowerCase();
			const opensInNewTab = /new\s*tab|_blank|external/.test(lowerRaw);
			const noFollow = /nofollow/.test(lowerRaw);
			const sponsored = /sponsored/.test(lowerRaw);
			const ugc = /\bugc\b/.test(lowerRaw);
			const relParts = [];
			if (noFollow) relParts.push('nofollow');
			if (sponsored) relParts.push('sponsored');
			if (ugc) relParts.push('ugc');
			const rel = relParts.join(' ');

			queueDirectAction({
				action: actionType,
				property: 'text_link',
				value: {
					url: textLinkUrl,
					target: opensInNewTab ? '_blank' : '_self',
					...(rel ? { rel } : {}),
					...(noFollow ? { noFollow: true } : {}),
					...(sponsored ? { sponsored: true } : {}),
					...(ugc ? { ugc: true } : {}),
				},
				message: 'Applied link settings to the selected text.',
				...(actionType === 'update_page' ? { target_block: 'text' } : {}),
			});
			return;
		}

		// L-group: container links (explicit phrasing)
		const lGroupAction = buildContainerLGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (lGroupAction) {
			queueDirectAction(lGroupAction);
			return;
		}

		// A-group: anchor, aria, advanced CSS, arrows, align content/items (explicit phrasing)
		const aGroupAction = buildContainerAGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (aGroupAction) {
			queueDirectAction(aGroupAction);
			return;
		}

		// B-group: backgrounds, borders, shadows, block style, breakpoints (explicit phrasing)
		const bGroupAction = buildContainerBGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (bGroupAction) {
			queueDirectAction(bGroupAction);
			return;
		}

		// C-group: context loop, pagination, column gap, custom css/label (explicit phrasing)
		const cGroupAction = buildContainerCGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (cGroupAction) {
			queueDirectAction(cGroupAction);
			return;
		}

		// D-group: display / visibility (explicit phrasing)
		const dGroupAction = buildContainerDGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (dGroupAction) {
			queueDirectAction(dGroupAction);
			return;
		}

		// E-group: custom classes (explicit phrasing)
		const eGroupAction = buildContainerEGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (eGroupAction) {
			queueDirectAction(eGroupAction);
			return;
		}

		// F-group: flex sizing / aspect ratio / full width (explicit phrasing)
		const fGroupAction = buildContainerFGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (fGroupAction) {
			queueDirectAction(fGroupAction);
			return;
		}

		// H-group: height (explicit phrasing)
		const hGroupAction = buildContainerHGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (hGroupAction) {
			queueDirectAction(hGroupAction);
			return;
		}

		// M-group: margin + min/max sizing + versions (explicit phrasing)
		const mGroupAction = buildContainerMGroupAction(rawMessage, {
			scope: currentScope,
		});
		if (mGroupAction) {
			queueDirectAction(mGroupAction);
			return;
		}

		// CLIENT-SIDE INTERCEPTION: Detect vague requests and show clarification immediately
		// const lowerMessage = userMessage.toLowerCase(); // Removed, already declared above
		

		

		
		// Spacing removals (explicit remove/clear/reset)
		if (!isGlobalScope) {
			const removeSpacing = parseRemoveSpacingRequest(rawMessage);
			if (removeSpacing) {
				const actionType = currentScope === 'selection' ? 'update_selection' : 'update_page';
				const targetBlock = currentScope === 'page' ? (detectSpacingTarget(rawMessage) || 'container') : null;
				const propertyParts = removeSpacing.property.split('_');
				const spacingLabel = propertyParts.length === 2
					? `${propertyParts[1]} ${propertyParts[0]}`
					: removeSpacing.property;
				const directAction = {
					action: actionType,
					property: removeSpacing.property,
					value: removeSpacing.value,
					...(targetBlock ? { target_block: targetBlock } : {}),
					message: `Removed ${spacingLabel}.`,
				};

				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}
		}

		// Spacing requests - detect target from user message
		const hasExplicitNumericValue = /\b\d+(?:\.\d+)?\s*(px|%|em|rem|vh|vw)?\b/.test(lowerMessage);
		const spacingIntent = getSpacingIntent(rawMessage);
		if ((lowerMessage.includes('spacing') || lowerMessage.includes('space') || lowerMessage.includes('padding') || lowerMessage.includes('margin') || lowerMessage.includes('taller')) 
			&& !hasExplicitNumericValue
			&& !lowerMessage.includes('compact') && !lowerMessage.includes('comfortable') && !lowerMessage.includes('spacious') && !lowerMessage.includes('square')) {
			// Detect what the user wants to target
			let target = null;
			if (lowerMessage.includes('video')) target = 'video';
			else if (lowerMessage.includes('image')) target = 'image';
			else if (lowerMessage.includes('button')) target = 'button';
			else if (lowerMessage.includes('container') || lowerMessage.includes('section')) target = 'container';

			if (!target && currentScope === 'selection' && selectedBlock?.name?.includes('video')) {
				target = 'video';
			}

			const spacingBase = spacingIntent?.base || (lowerMessage.includes('margin') ? 'margin' : 'padding');
			const spacingSide = spacingIntent?.side || null;
			const spacingLabel = spacingSide ? `${spacingSide} ${spacingBase}` : spacingBase;

			setMessages(prev => [...prev, {
				role: 'assistant',
				content: target
					? `How much ${spacingLabel} for the ${target}s?`
					: `How much ${spacingLabel} would you like?`,
				options: ['Compact', 'Comfortable', 'Spacious', 'Remove'],
				targetContext: target || 'container', // Default to container for spacing
				spacingBase,
				spacingSide,
				executed: false
			}]);
			return;
		}

		// Numeric padding/margin: apply directly when a number is provided
		const numericSpacing = parseNumericSpacingRequest(rawMessage);
		if (numericSpacing) {
			const actionType = currentScope === 'selection' ? 'update_selection' : 'update_page';
			const targetBlock = currentScope === 'page' ? (detectSpacingTarget(rawMessage) || 'container') : null;
			const propertyParts = numericSpacing.property.split('_');
			const spacingLabel = propertyParts.length === 2
				? `${propertyParts[1]} ${propertyParts[0]}`
				: numericSpacing.property;
			const directAction = {
				action: actionType,
				property: numericSpacing.property,
				value: numericSpacing.value,
				...(targetBlock ? { target_block: targetBlock } : {}),
				message: `Applied ${numericSpacing.value} ${spacingLabel}.`,
			};

			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
			return;
		}

		// Image numeric overrides (width/height/ratio)
		const isImageClarifyContext =
			lastClarifyContent.includes('image') ||
			lastClarifyContent.includes('images') ||
			lastClarifyContent.includes('photo') ||
			lastClarifyContent.includes('picture');
		const isImageRequest =
			lowerMessage.includes('image') ||
			lowerMessage.includes('photo') ||
			lowerMessage.includes('picture') ||
			selectedBlock?.name?.includes('image') ||
			isImageClarifyContext;
		if (isImageRequest) {
			const ratioMatch = lowerMessage.match(/(\d+)\s*[:/]\s*(\d+)/);
			if (ratioMatch) {
				const ratioValue = resolveImageRatioValue(ratioMatch[1], ratioMatch[2]);
				const directAction = currentScope === 'selection'
					? { action: 'update_selection', property: 'image_ratio', value: ratioValue, target_block: 'image', message: `Aspect ratio set to ${ratioMatch[1]}:${ratioMatch[2]}.` }
					: { action: 'update_page', property: 'image_ratio', value: ratioValue, target_block: 'image', message: `Aspect ratio set to ${ratioMatch[1]}:${ratioMatch[2]}.` };
				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}

			const widthMatch = lowerMessage.match(/(?:image|img).*(?:width|wide)\s*(?:to|=|is)?\s*(\d+)\s*(px|%)/i);
			if (widthMatch) {
				const value = Number(widthMatch[1]);
				const unit = widthMatch[2];
				const prop = unit === '%' ? 'img_width' : 'width';
				const directAction = currentScope === 'selection'
					? { action: 'update_selection', property: prop, value, target_block: 'image', message: `Image width set to ${value}${unit}.` }
					: { action: 'update_page', property: prop, value, target_block: 'image', message: `Image width set to ${value}${unit}.` };
				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}

			const heightMatch = lowerMessage.match(/(?:image|img).*(?:height|tall)\s*(?:to|=|is)?\s*(\d+)\s*(px|%)/i);
			if (heightMatch) {
				const value = Number(heightMatch[1]);
				const unit = heightMatch[2];
				const directAction = currentScope === 'selection'
					? { action: 'update_selection', property: 'height', value, target_block: 'image', message: `Image height set to ${value}${unit}.` }
					: { action: 'update_page', property: 'height', value, target_block: 'image', message: `Image height set to ${value}${unit}.` };
				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}
		}

		// Container sizing overrides (min/max width/height)
		const resolveSizeTarget = () => {
			if (lowerMessage.includes('image') || lowerMessage.includes('photo') || lowerMessage.includes('picture')) return 'image';
			if (lowerMessage.includes('button')) return 'button';
			if (lowerMessage.includes('container') || lowerMessage.includes('section') || lowerMessage.includes('row') || lowerMessage.includes('column')) return 'container';

			if (selectedBlock?.name) {
				if (selectedBlock.name.includes('image')) return 'image';
				if (selectedBlock.name.includes('button')) return 'button';
				if (selectedBlock.name.includes('container')) return 'container';
			}

			return 'container';
		};

		const limitMatch = lowerMessage.match(/\b(max(?:imum)?|min(?:imum)?)\s*[- ]*(width|height)\b[^0-9-]*(-?\d+(?:\.\d+)?)\s*(px|%|vh|vw|em|rem)?/i);
		const limitMatchAlt = lowerMessage.match(/\b(width|height)\s*(max(?:imum)?|min(?:imum)?)\b[^0-9-]*(-?\d+(?:\.\d+)?)\s*(px|%|vh|vw|em|rem)?/i);

		if (limitMatch || limitMatchAlt) {
			const match = limitMatch || limitMatchAlt;
			const isAlt = Boolean(limitMatchAlt);
			const limitTypeRaw = isAlt ? match[2] : match[1];
			const dimension = isAlt ? match[1] : match[2];
			const numberValue = Number(match[3]);
			const unitValue = match[4];

			if (!Number.isNaN(numberValue)) {
				const limitType = limitTypeRaw.toLowerCase().startsWith('max') ? 'max' : 'min';
				const prop = `${limitType}_${dimension.toLowerCase()}`;
				const value = unitValue ? `${numberValue}${unitValue}` : numberValue;
				const targetBlock = resolveSizeTarget();
				const labelUnit = unitValue || 'px';
				const directAction = currentScope === 'selection'
					? { action: 'update_selection', property: prop, value, target_block: targetBlock, message: `${limitType.toUpperCase()} ${dimension} set to ${numberValue}${labelUnit}.` }
					: { action: 'update_page', property: prop, value, target_block: targetBlock, message: `${limitType.toUpperCase()} ${dimension} set to ${numberValue}${labelUnit}.` };
				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}
		}

		// Rounded corners requests - numeric values should apply directly (no clarify)
		const radiusMatch = lowerMessage.match(
			/\b(?:corner|corners|radius|rounded)\b[^0-9-]*(-?\d+(?:\.\d+)?)\s*(px|%|em|rem)?/i
		);
		if (radiusMatch) {
			const numericValue = Number(radiusMatch[1]);
			if (!Number.isNaN(numericValue)) {
				setIsLoading(true);
				const directAction = currentScope === 'selection'
					? { action: 'update_selection', property: 'border_radius', value: numericValue, message: `Applied border radius (${numericValue}px).` }
					: { action: 'update_page', property: 'border_radius', value: numericValue, message: `Applied border radius (${numericValue}px).` };

				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}
		}

		// Rounded corners requests - detect target from user message (exclude removal commands)

		
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
		if (lowerMessage.includes('align') && (lowerMessage.includes('everything') || lowerMessage.includes('all')) && !lowerMessage.includes('left') && !lowerMessage.includes('right') && !lowerMessage.includes('center') && !lowerMessage.includes('bottom') && !lowerMessage.includes('top')) {
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'How would you like to align everything?',
				options: ['Align Left', 'Align Center', 'Align Right'],
				executed: false
			}]);
			return;
		}

		const hasRoundIntent = /\bround(?:ed|ing|er)?\b/.test(lowerMessage);
		// DIRECT ACTION: "Make it square" / "remove rounded corners" / "remove border radius"
		if (lowerMessage.includes('square') || (lowerMessage.includes('remove') && (hasRoundIntent || lowerMessage.includes('radius')))) {
			setIsLoading(true);
			const directAction = currentScope === 'selection' 
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
			const directAction = currentScope === 'selection'
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
			let explicitTarget = null;
			if (lowerMessage.includes('image')) explicitTarget = 'image';
			else if (lowerMessage.includes('button')) explicitTarget = 'button';
			else if (lowerMessage.includes('container') || lowerMessage.includes('section')) explicitTarget = 'container';

			setIsLoading(true);
			const directAction = currentScope === 'selection'
				? { action: 'update_selection', property: 'border', value: 'none', target_block: explicitTarget, message: 'Removed border from selected block.' }
				: { action: 'update_page', property: 'border', value: 'none', target_block: explicitTarget, message: 'Removed borders.' };
			
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
			return;
		}

		// HEX COLOUR: apply directly when hex is present (skip palette)
		if (hexColor) {
			const isFlowIntent =
				lowerMessage.includes('border') ||
				lowerMessage.includes('outline') ||
				lowerMessage.includes('shadow') ||
				lowerMessage.includes('glow');

			if (!isFlowIntent) {
				const colorTarget = getColorTargetFromMessage(lowerMessage);
				const colorUpdate = buildColorUpdate(colorTarget, hexColor);

				if (colorUpdate.property) {
					setIsLoading(true);
					const directAction = currentScope === 'selection'
						? { action: 'update_selection', property: colorUpdate.property, value: colorUpdate.value, target_block: colorUpdate.targetBlock, message: `Applied custom colour to ${colorUpdate.msgText}.` }
						: { action: 'update_page', property: colorUpdate.property, value: colorUpdate.value, target_block: colorUpdate.targetBlock, message: `Applied custom colour to ${colorUpdate.msgText}.` };

					setTimeout(async () => {
						const result = await parseAndExecuteAction(directAction);
						setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
						setIsLoading(false);
					}, 50);
					return;
				}
			}
		}

		const hasShapeDividerIntent = /\bshape\s*-?\s*divider\b/.test(lowerMessage);
		const hasShapeDividerStyle = /\b(wave|waves|curve|slant|triangle)\b/.test(lowerMessage);
		if (hasShapeDividerIntent && !hasShapeDividerStyle) {
			const wantsTop = /\btop\b/.test(lowerMessage);
			const wantsBottom = /\bbottom\b/.test(lowerMessage);

			if (!wantsTop && !wantsBottom) {
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Where do you want the shape divider?',
					options: ['Top', 'Bottom', 'Both'],
					shapeDividerLocation: true,
					executed: false
				}]);
				setIsLoading(false);
				return;
			}

			const location = wantsTop && wantsBottom ? 'both' : (wantsTop ? 'top' : 'bottom');
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Which shape style should the divider use?',
				options: ['Wave', 'Curve', 'Slant', 'Triangle'],
				shapeDividerTarget: location,
				executed: false
			}]);
			setIsLoading(false);
			return;
		}



		const getRequestedTarget = () => {
			if (lowerMessage.includes('video')) return 'video';
			if (lowerMessage.includes('image') || lowerMessage.includes('photo') || lowerMessage.includes('picture')) return 'image';
			if (lowerMessage.includes('button')) return 'button';
			if (hasShapeDividerIntent) return 'container';
			if (lowerMessage.includes('divider')) return 'divider';
			if (lowerMessage.includes('text') || lowerMessage.includes('heading') || lowerMessage.includes('paragraph')) return 'text';
			if (/\brow\b/.test(lowerMessage)) return 'row';
			if (/\bcolumn\b/.test(lowerMessage)) return 'column';
			if (/\bgroup\b/.test(lowerMessage)) return 'group';
			if (lowerMessage.includes('container') || lowerMessage.includes('section')) return 'container';

			if (selectedBlock?.name) {
				if (selectedBlock.name.includes('video')) return 'video';
				if (selectedBlock.name.includes('image')) return 'image';
				if (selectedBlock.name.includes('button')) return 'button';
				if (selectedBlock.name.includes('divider')) return 'divider';
				if (selectedBlock.name.includes('text') || selectedBlock.name.includes('heading')) return 'text';
				if (selectedBlock.name.includes('row')) return 'row';
				if (selectedBlock.name.includes('column')) return 'column';
				if (selectedBlock.name.includes('group')) return 'group';
				if (selectedBlock.name.includes('container')) return 'container';
			}

			return null;
		};

		const resolveCloudIconTarget = () => {
			const selectedName = selectedBlock?.name || '';
			if (selectedName.includes('button')) {
				return { targetBlock: 'button', property: 'button_icon_svg', svgTarget: 'icon' };
			}
			if (selectedName.includes('icon-maxi') || selectedName.includes('svg-icon')) {
				return { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
			}

			const wantsButton = /\bbutton\b/.test(lowerMessage);
			const wantsIconBlock = /\b(icon block|svg icon|svg-icon|icon maxi)\b/.test(lowerMessage);
			const mentionsIcons = /\bicons?\b/.test(lowerMessage);

			if (wantsButton) {
				return { targetBlock: 'button', property: 'button_icon_svg', svgTarget: 'icon' };
			}
			if (wantsIconBlock) {
				return { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
			}
			if (mentionsIcons) {
				return { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
			}

			return { targetBlock: 'button', property: 'button_icon_svg', svgTarget: 'icon' };
		};

		const resolveSelectionLayoutTarget = () => {
			if (!selectedBlock) return null;

			const hasChild = (block, name) =>
				block?.innerBlocks?.some(child => child.name.includes(name));

			if (selectedBlock.name.includes('row')) return 'row';
			if (selectedBlock.name.includes('column')) return 'column';
			if (selectedBlock.name.includes('group')) return 'group';
			if (selectedBlock.name.includes('container')) {
				if (hasChild(selectedBlock, 'row')) return 'row';
				if (hasChild(selectedBlock, 'column')) return 'column';
				if (hasChild(selectedBlock, 'group')) return 'group';
				return 'container';
			}

			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(selectedBlock.clientId) || [];
			const parentBlocks = parentIds.map(parentId => getBlock(parentId)).filter(Boolean);
			const layoutParent = parentBlocks.find(parent =>
				parent.name.includes('column') ||
				parent.name.includes('row') ||
				parent.name.includes('group') ||
				parent.name.includes('container')
			);

			if (!layoutParent) return null;
			if (layoutParent.name.includes('column')) return 'column';
			if (layoutParent.name.includes('row')) return 'row';
			if (layoutParent.name.includes('group')) return 'group';
			if (layoutParent.name.includes('container')) return 'container';
			return null;
		};

		// ============================================================
		// LAYOUT INTENT INTERCEPTION (Lookup Table Pattern Matching)
		// ============================================================
		// Uses LAYOUT_PATTERNS constant for zero-latency, maintainable pattern matching
		const requestedTarget = getRequestedTarget();
		const skipLayoutPatterns = requestedTarget === 'border';

		if (!skipLayoutPatterns) for (const pattern of LAYOUT_PATTERNS) {
			if (isGlobalScope) {
				break;
			}
			if (requestedTarget === 'image' && !pattern.target) {
				if (pattern.property === 'hover_effect' || pattern.property.startsWith('hover_')) {
					continue;
				}
			}
			if (lowerMessage.match(pattern.regex)) {
				if (hasShapeDividerIntent && pattern.target === 'divider') {
					continue;
				}
				const isTargetedPattern = ['button', 'image', 'container', 'divider', 'text', 'video'].includes(pattern.target);
				if (requestedTarget && isTargetedPattern && pattern.target !== requestedTarget) {
					continue;
				}

				setIsLoading(true);

				// === FSM FLOW TRIGGER ===
				if (pattern.property.startsWith('flow_')) {
					
					// 1. Resolve Blocks based on Scope
					let targetBlocks = [];
					let flowScope = currentScope;
					if (/all|page|everywhere/i.test(lowerMessage)) flowScope = 'page';
					
					const matchName = pattern.target || requestedTarget || 'container';
					const selectionRoot = selectedBlock
						? findBlockByClientId(allBlocks, selectedBlock.clientId) || selectedBlock
						: null;
					const isTextTarget = matchName === 'text';
					const wantsHeading = /\b(heading|headline|title|subheading|h[1-6])\b/.test(lowerMessage);
					const wantsParagraph = /\b(paragraph|body\s*text|body)\b/.test(lowerMessage);
					const getTextLevel = block =>
						String(block?.attributes?.textLevel || '').toLowerCase();
					const collectTextBlocks = blocks => {
						const textBlocks = collectBlocks(blocks, block =>
							block?.name &&
							(block.name.includes('text') || block.name.includes('heading'))
						);
						if (!textBlocks.length) return textBlocks;

						if (wantsHeading) {
							const headingBlocks = textBlocks.filter(block => {
								if (block?.name?.includes('heading')) return true;
								const level = getTextLevel(block);
								return /^h[1-6]$/.test(level);
							});
							if (headingBlocks.length) return headingBlocks;
						}

						if (wantsParagraph) {
							const paragraphBlocks = textBlocks.filter(block => getTextLevel(block) === 'p');
							if (paragraphBlocks.length) return paragraphBlocks;
						}

						return textBlocks;
					};
					
					if (flowScope === 'selection') {
						if (!selectedBlock) {
							setMessages(prev => [...prev, { 
								role: 'assistant', 
								content: "Please select a block first.", 
								executed: false 
							}]);
							setIsLoading(false);
							return;
						}
						if (isTextTarget) {
							const textBlocks = selectionRoot ? collectTextBlocks([selectionRoot]) : [];
							if (!textBlocks.length) {
								setMessages(prev => [...prev, {
									role: 'assistant',
									content: "Please select a text or heading block.",
									executed: false
								}]);
								setIsLoading(false);
								return;
							}
							targetBlocks = textBlocks;
						} else {
							if (matchName && selectedBlock?.name && !selectedBlock.name.includes(matchName)) {
								setIsLoading(false);
								continue;
							}
							targetBlocks = [selectionRoot || selectedBlock];
						}
					} else {
						// Page Scope: Find ALL matching blocks
						targetBlocks = isTextTarget
							? collectTextBlocks(allBlocks)
							: collectBlocks(allBlocks, b => b.name.includes(matchName));
						
						if (targetBlocks.length === 0) {
							setMessages(prev => [...prev, { 
								role: 'assistant', 
								content: isTextTarget
									? "No text blocks found on this page."
									: `No ${matchName}s found on this page.`,
								executed: false 
							}]);
							setIsLoading(false);
							return;
						}
					}

					// 2. Start Flow (using first block to generate initial question)
					// We assume all blocks of same type respond to flow same way.
					const primaryBlock = targetBlocks[0];
					const prefix = getBlockPrefix(primaryBlock.name);
					const flowHandler = getAiHandlerForBlock(primaryBlock) || getAiHandlerForTarget(matchName);
					const flowData = {};
					const inferTextAlignment = message => {
						if (/\bjustif(y|ied)\b/.test(message)) return 'justify';
						if (/\b(center|centre|centered|centred)\b/.test(message)) return 'center';
						if (/\bright\b/.test(message)) return 'right';
						if (/\bleft\b/.test(message)) return 'left';
						return null;
					};

					if (hexColor) {
						if (pattern.property === 'flow_outline' || pattern.property === 'flow_border') {
							flowData.border_color = hexColor;
						}
						if (pattern.property === 'flow_shadow') {
							flowData.shadow_color = hexColor;
						}
					}
					if (pattern.property === 'flow_text_align') {
						const inferredAlignment = inferTextAlignment(lowerMessage);
						if (inferredAlignment) {
							flowData.text_align = inferredAlignment;
						}
					}

					const startResponse = flowHandler
						? flowHandler(primaryBlock, pattern.property, 'start', prefix, flowData)
						: null;

					if (!startResponse) {
						setIsLoading(false);
						continue;
					}

					if (startResponse.action === 'apply') {
						let didApply = false;
						registry.batch(() => {
							targetBlocks.forEach(blk => {
								const p = getBlockPrefix(blk.name);
								const handler = getAiHandlerForBlock(blk) || getAiHandlerForTarget(matchName);
								const res = handler
									? handler(blk, pattern.property, null, p, flowData)
									: null;
								if (res && res.action === 'apply' && res.attributes) {
									updateBlockAttributes(blk.clientId, res.attributes);
									didApply = true;
								}
							});
						});

						const fallbackMsg = flowScope === 'selection' ? pattern.selectionMsg : pattern.pageMsg;
						const finalMsg = startResponse.message || fallbackMsg || 'Done.';
						setMessages(prev => [...prev, {
							role: 'assistant',
							content: finalMsg,
							executed: didApply
						}]);
						setIsLoading(false);
						return;
					}

					// Setup Context with ALL block IDs
					setConversationContext({
						flow: pattern.property,
						pendingTarget: startResponse.target || null,
						data: flowData,
						mode: flowScope,
						currentOptions: startResponse.options || [],
						blockIds: targetBlocks.map(b => b.clientId) // Track all targets
					});
					
					// Show Trigger Message
					setMessages(prev => [...prev, {
						role: 'assistant',
						content: startResponse.msg,
						options: startResponse.options ? startResponse.options.map(o => o.label || o) : (startResponse.action === 'ask_palette' ? ['palette'] : []),
						optionsType: startResponse.action === 'ask_palette' ? 'palette' : 'text',
						colorTarget: startResponse.target, 
						executed: false
					}]);
					
					setIsLoading(false);
					return;
				}
				
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

				// SPECIAL: Cloud icon search - search Cloud Library and apply icon
				if (pattern.property === 'cloud_icon') {
					const isIconColorIntent =
						/\b(colou?r|fill|stroke)\b/.test(lowerMessage) ||
						/\bline\s*width\b/.test(lowerMessage);
					const selectedName = selectedBlock?.name || '';
					const hasIconKeyword = /\bicons?\b/.test(lowerMessage);
					const hasCloudKeyword = /\b(cloud|library)\b/.test(lowerMessage);
					const hasThemeIntent = /\b(?:theme|style|vibe|look)\b/.test(lowerMessage);
					const hasPronounIntent = /\b(this|these|those|them)\b/.test(lowerMessage);
					const hasChangeIntent = /\b(change|swap|replace|use|set|add|insert|make|give|update)\b/.test(lowerMessage);
					const matchTitlesIntent =
						/\b(match|use|set|make|change|swap|replace)\b[^.]*\b(title|titles|label|labels|text|heading|headings)\b[^.]*\b(below|under|beneath|underneath|following|next)\b/.test(lowerMessage);
					const matchTitlesToIconsIntent =
						/\b(match|sync|update|set|make|change|swap|replace)\b[^.]*\b(title|titles|label|labels|text|heading|headings)\b[^.]*\bicons?\b/.test(lowerMessage) ||
						/\b(title|titles|label|labels|text|heading|headings)\b[^.]*\b(match|sync|update|set|make|change)\b[^.]*\bicons?\b/.test(lowerMessage);
					const mentionsOtherTargets = /\b(text|heading|paragraph|container|section|background|layout|spacing|padding|margin|row|column|group|divider|image|video|button)\b/.test(lowerMessage);

					if (isIconColorIntent) {
						setIsLoading(false);
						continue;
					}

					const selectionRoot = currentScope === 'selection' && selectedBlock
						? findBlockByClientId(allBlocks, selectedBlock.clientId) || selectedBlock
						: null;
					const scopeBlocks = currentScope === 'selection' && selectionRoot
						? [selectionRoot]
						: allBlocks;
					const iconBlocksInScope = collectBlocks(scopeBlocks, block =>
						block.name.includes('icon-maxi') || block.name.includes('svg-icon'));
					const buttonBlocksInScope = collectBlocks(scopeBlocks, block =>
						block.name.includes('button'));
					const hasIconBlocksInScope = iconBlocksInScope.length > 0;
					const hasIconSelection =
						selectedName.includes('button') ||
						selectedName.includes('icon-maxi') ||
						selectedName.includes('svg-icon');
					const shouldTreatAsIconTheme =
						hasIconBlocksInScope &&
						hasThemeIntent &&
						(hasPronounIntent || hasChangeIntent) &&
						!mentionsOtherTargets;

					if (!hasIconKeyword && !hasCloudKeyword && !hasIconSelection && !shouldTreatAsIconTheme && !matchTitlesIntent && !matchTitlesToIconsIntent) {
						setIsLoading(false);
						continue;
					}

					const wantsMultipleIcons =
						/\ball\b.*\bicons?\b|\bicons\b/.test(lowerMessage) ||
						(shouldTreatAsIconTheme && iconBlocksInScope.length > 1);

					const cloudStatusMessage = matchTitlesToIconsIntent
						? 'Matching text to icons...'
						: 'Searching Cloud Library for icons...';
					setMessages(prev => [...prev, { role: 'assistant', content: cloudStatusMessage }]);

					setTimeout(async () => {
						try {
							const formatList = items =>
								items.length > 3
									? `${items.slice(0, 3).join(', ')} and ${items.length - 3} more`
									: items.join(', ');

							const styleIntent = extractIconStyleIntent(rawMessage);
							const styleLabel = styleIntent
								? styleIntent === 'line'
									? 'line'
									: styleIntent === 'shape'
									? 'shape'
									: 'filled'
								: '';
							const messageForQuery = styleIntent
								? stripIconStylePhrases(rawMessage)
								: rawMessage;

							const explicitQueries = extractIconQueries(messageForQuery);
							const hasExplicitList = explicitQueries.length > 1;
							const searchQuery = extractIconQuery(messageForQuery);

							if (matchTitlesToIconsIntent) {
								if (!hasIconBlocksInScope || iconBlocksInScope.length === 0) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: currentScope === 'selection'
												? 'No icon blocks found in the selection.'
												: 'No icon blocks found on this page.',
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								const updates = [];
								const missingIconLabels = [];
								const missingTextTargets = [];
								const processedTextBlocks = new Set();

								iconBlocksInScope.forEach((iconBlock, index) => {
									const iconLabel = getIconLabelFromBlock(iconBlock);
									if (!iconLabel) {
										missingIconLabels.push(`icon ${index + 1}`);
										return;
									}

									const groupRoot = findGroupRootForIconBlock(iconBlock);
									const groupTextBlocks = groupRoot
										? collectBlocks(groupRoot.innerBlocks || [], block =>
												isLabelBlock(block?.name)
											)
										: [];

									if (groupTextBlocks.length === 0) {
										missingTextTargets.push(iconLabel);
										return;
									}

									let bodyIndex = 0;
									groupTextBlocks.forEach(textBlock => {
										if (processedTextBlocks.has(textBlock.clientId)) {
											return;
										}
										const nextText = buildIconRelatedText(
											iconLabel,
											textBlock,
											bodyIndex
										);
										const changes = buildTextContentChange(textBlock, nextText);
										if (changes) {
											updates.push({ block: textBlock, changes });
											processedTextBlocks.add(textBlock.clientId);
										}
										if (!isHeadingTextBlock(textBlock)) {
											bodyIndex += 1;
										}
									});
								});

								if (updates.length === 0) {
									let message = 'I could not match titles to the icons.';
									if (missingIconLabels.length) {
										message += ` Missing icon labels for ${formatList(missingIconLabels)}.`;
									}
									if (missingTextTargets.length) {
										message += ` Missing text blocks for: ${formatList(missingTextTargets)}.`;
									}
									setMessages(prev => [
										...prev,
										{ role: 'assistant', content: message, executed: false },
									]);
									setIsLoading(false);
									return;
								}

								registry.batch(() => {
									updates.forEach(({ block, changes }) => {
										updateBlockAttributes(block.clientId, changes);
									});
								});

								let message = currentScope === 'selection'
									? `Updated ${updates.length} text blocks to match the icons.`
									: `Updated ${updates.length} text blocks on the page to match the icons.`;
								if (missingIconLabels.length) {
									message += ` Missing icon labels for ${formatList(missingIconLabels)}.`;
								}
								if (missingTextTargets.length) {
									message += ` Missing text blocks for: ${formatList(missingTextTargets)}.`;
								}

								setMessages(prev => [
									...prev,
									{ role: 'assistant', content: message, executed: true },
								]);
								setIsLoading(false);
								return;
							}

							if (matchTitlesIntent) {
								if (!hasIconBlocksInScope || iconBlocksInScope.length === 0) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: currentScope === 'selection'
												? 'No icon blocks found in the selection.'
												: 'No icon blocks found on this page.',
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								const labeledBlocks = [];
								const missingLabels = [];
								iconBlocksInScope.forEach((block, index) => {
									const label = findLabelForIconBlock(block);
									if (label) {
										labeledBlocks.push({ block, label });
									} else {
										missingLabels.push(`icon ${index + 1}`);
									}
								});

								if (labeledBlocks.length === 0) {
									let message = 'I could not find any text labels below the icons. Make sure each icon has a text or heading block beneath it.';
									if (missingLabels.length) {
										message += ` Missing labels for ${formatList(missingLabels)}.`;
									}
									setMessages(prev => [
										...prev,
										{ role: 'assistant', content: message, executed: false },
									]);
									setIsLoading(false);
									return;
								}

								const results = await Promise.all(
									labeledBlocks.map(item =>
										findBestIcon(item.label, {
											target: 'svg',
											requireStrongMatch: true,
											style: styleIntent,
											requireStyleMatch: Boolean(styleIntent),
										})
									)
								);

								const updates = [];
								const missingMatches = [];
								const proOnly = [];
								const missingStyles = [];

								results.forEach((result, index) => {
									const { block, label } = labeledBlocks[index];
									if (!result || !result.svgCode || result.noStrongMatch) {
										missingMatches.push(label);
										return;
									}
									if (result.noStyleMatch) {
										missingStyles.push(label);
										return;
									}
									if (result.isPro) {
										proOnly.push(label);
										return;
									}
									updates.push({ block, result, label });
								});

								if (updates.length === 0) {
									let message = 'I could not find matching icons for the titles below in the Cloud Library.';
									if (missingLabels.length) {
										message += ` Missing labels for ${formatList(missingLabels)}.`;
									}
									if (missingMatches.length) {
										message += ` No matches for: ${formatList(missingMatches)}.`;
									}
									if (missingStyles.length) {
										message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
									}
									if (proOnly.length) {
										message += ` Pro only: ${formatList(proOnly)}.`;
									}
									setMessages(prev => [
										...prev,
										{ role: 'assistant', content: message, executed: false },
									]);
									setIsLoading(false);
									return;
								}

								let updatedCount = 0;
								registry.batch(() => {
									updates.forEach(({ block, result, label }) => {
										const blockHandler = getAiHandlerForBlock(block);
										if (!blockHandler) return;
										const prefix = getBlockPrefix(block.name);
										const handlerResult = blockHandler(
											block,
											'icon_svg',
											{
												svgCode: result.svgCode,
												svgType: result.svgType,
												title: result.title || label,
											},
											prefix,
											{ mode: currentScope }
										);
										let changes = null;
										if (handlerResult?.action === 'apply') {
											changes = handlerResult.attributes;
										} else if (handlerResult && !handlerResult.action) {
											changes = handlerResult;
										}
										if (changes) {
											updateBlockAttributes(block.clientId, changes);
											updatedCount += 1;
										}
									});
								});

								let message = currentScope === 'selection'
									? `Updated ${updatedCount} icons to match the titles below.`
									: `Updated ${updatedCount} icons on the page to match the titles below.`;
								if (missingLabels.length) {
									message += ` Missing labels for ${formatList(missingLabels)}.`;
								}
								if (missingMatches.length) {
									message += ` No matches for: ${formatList(missingMatches)}.`;
								}
								if (missingStyles.length) {
									message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
								}
								if (proOnly.length) {
									message += ` Pro only: ${formatList(proOnly)}.`;
								}

								setMessages(prev => [
									...prev,
									{ role: 'assistant', content: message, executed: true },
								]);
								setIsLoading(false);
								return;
							}
							if (!searchQuery && !hasExplicitList) {
								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: 'Which icon should I search for in the Cloud Library?',
										executed: false,
									},
								]);
								setIsLoading(false);
								return;
							}

							const wantsDifferent = /\b(different|another|alternative|new|other)\b/.test(lowerMessage);
							let targetMeta = resolveCloudIconTarget();

							if (shouldTreatAsIconTheme && hasIconBlocksInScope && !selectedName.includes('button')) {
								targetMeta = { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
							}

							const isButtonTarget = targetMeta.targetBlock === 'button';
							const isIconTarget = targetMeta.targetBlock === 'icon';
							const currentSvg = isButtonTarget
								? selectedBlock?.attributes?.['icon-content']
								: selectedBlock?.attributes?.content;
							const excludeSvgCodes =
								wantsDifferent && currentSvg ? [currentSvg] : [];

							const isMultiIconRequest = wantsMultipleIcons || hasExplicitList;
							const targetBlocks = isMultiIconRequest
								? (isButtonTarget ? buttonBlocksInScope : iconBlocksInScope)
								: [];

							if (currentScope === 'selection' && !isMultiIconRequest) {
								const mismatch = (isButtonTarget && !selectedName.includes('button')) ||
									(isIconTarget && !selectedName.includes('icon'));
								if (mismatch) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: isButtonTarget
												? 'Please select a button block to change its icon.'
												: 'Please select an Icon block to change its icon.',
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}
							}

							if (isMultiIconRequest && targetBlocks.length === 0) {
								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: currentScope === 'selection'
											? 'No icon blocks found in the selection.'
											: 'No icon blocks found on this page.',
										executed: false,
									},
								]);
								setIsLoading(false);
								return;
							}

							console.log('[Maxi AI] Searching Cloud Library icons for:', searchQuery);

							if (hasExplicitList && isMultiIconRequest && targetBlocks.length > 1) {
								const maxQueries = Math.min(12, explicitQueries.length);
								const queryList = explicitQueries.slice(0, maxQueries);
								const results = await Promise.all(
									queryList.map(query =>
										findBestIcon(query, {
											target: targetMeta.svgTarget,
											requireStrongMatch: true,
											style: styleIntent,
											requireStyleMatch: Boolean(styleIntent),
										})
									)
								);

								const usable = [];
								const missing = [];
								const proOnly = [];
								const missingStyles = [];

								results.forEach((result, index) => {
									const query = queryList[index];
									if (!result || !result.svgCode) {
										missing.push(query);
										return;
									}
									if (result.noStrongMatch) {
										missing.push(query);
										return;
									}
									if (result.noStyleMatch) {
										missingStyles.push(query);
										return;
									}
									if (result.isPro) {
										proOnly.push(query);
										return;
									}
									usable.push({
										title: result.title,
										svgCode: result.svgCode,
										svgType: result.svgType,
									});
								});

								const normalizeSvgCode = value =>
									String(value || '').replace(/\s+/g, ' ').trim();
								const uniqueUsable = [];
								const seenSvg = new Set();
								for (const item of usable) {
									const key = normalizeSvgCode(item.svgCode);
									if (!key || seenSvg.has(key)) {
										continue;
									}
									seenSvg.add(key);
									uniqueUsable.push(item);
								}

								if (uniqueUsable.length < 2) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: `I could only find one matching icon for that list. Try different keywords.`,
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								let updatedCount = 0;
								registry.batch(() => {
									targetBlocks.forEach((block, index) => {
										const choice = uniqueUsable[index % uniqueUsable.length];
										const blockHandler = getAiHandlerForBlock(block);
										if (!blockHandler) return;
										const prefix = getBlockPrefix(block.name);
										const result = blockHandler(
											block,
											targetMeta.property,
											{ svgCode: choice.svgCode, svgType: choice.svgType, title: choice.title },
											prefix,
											{ mode: currentScope }
										);
										let changes = null;
										if (result?.action === 'apply') {
											changes = result.attributes;
										} else if (result && !result.action) {
											changes = result;
										}
										if (changes) {
											updateBlockAttributes(block.clientId, changes);
											updatedCount += 1;
										}
									});
								});

								let message = currentScope === 'selection'
									? `Updated ${updatedCount} icons using the requested list.`
									: `Updated ${updatedCount} icons on the page using the requested list.`;
								if (missing.length) {
									message += ` Missing: ${formatList(missing)}.`;
								}
								if (missingStyles.length) {
									message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
								}
								if (proOnly.length) {
									message += ` Pro only: ${formatList(proOnly)}.`;
								}

								setMessages(prev => [
									...prev,
									{ role: 'assistant', content: message, executed: true },
								]);
								setIsLoading(false);
								return;
							}

							if (isMultiIconRequest && targetBlocks.length > 1) {
								const candidateLimit = Math.min(
									24,
									Math.max(12, targetBlocks.length * 3)
								);
								const candidateResult = await findIconCandidates(searchQuery, {
									target: targetMeta.svgTarget,
									limit: candidateLimit,
									style: styleIntent,
									requireStyleMatch: Boolean(styleIntent),
								});

								if (candidateResult?.noStyleMatch) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: `I couldn't find ${styleLabel} icons for "${searchQuery}" in the Cloud Library. Try a different keyword.`,
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								if (candidateResult?.hasOnlyPro) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: `Found icons for "${searchQuery}" but they are Pro. Upgrade to MaxiBlocks Pro to use them.`,
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								if (!candidateResult?.icons || candidateResult.icons.length === 0) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: `I couldn't find icons for "${searchQuery}" in the Cloud Library. Try a different keyword.`,
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								if (candidateResult.icons.length <= 1) {
									setMessages(prev => [
										...prev,
										{
											role: 'assistant',
											content: `I only found one icon for "${searchQuery}" in the Cloud Library.`,
											executed: false,
										},
									]);
									setIsLoading(false);
									return;
								}

								let updatedCount = 0;
								registry.batch(() => {
									targetBlocks.forEach((block, index) => {
										const choice = candidateResult.icons[index % candidateResult.icons.length];
										const blockHandler = getAiHandlerForBlock(block);
										if (!blockHandler) return;
										const prefix = getBlockPrefix(block.name);
										const result = blockHandler(
											block,
											targetMeta.property,
											{ svgCode: choice.svgCode, svgType: choice.svgType, title: choice.title },
											prefix,
											{ mode: currentScope }
										);
										let changes = null;
										if (result?.action === 'apply') {
											changes = result.attributes;
										} else if (result && !result.action) {
											changes = result;
										}
										if (changes) {
											updateBlockAttributes(block.clientId, changes);
											updatedCount += 1;
										}
									});
								});

								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: currentScope === 'selection'
											? `Updated ${updatedCount} icons with "${searchQuery}" variations.`
											: `Updated ${updatedCount} icons on the page with "${searchQuery}" variations.`,
										executed: true,
									},
								]);
								setIsLoading(false);
								return;
							}

							const fallbackQuery =
								hasExplicitList && explicitQueries.length > 0
									? explicitQueries[0]
									: searchQuery;
							const iconResult = await findBestIcon(fallbackQuery, {
								target: targetMeta.svgTarget,
								excludeSvgCodes,
								preferDifferent: wantsDifferent && excludeSvgCodes.length > 0,
								style: styleIntent,
								requireStyleMatch: Boolean(styleIntent),
							});

							if (iconResult?.noStyleMatch) {
								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: `I couldn't find ${styleLabel} icons for "${fallbackQuery}" in the Cloud Library. Try a different keyword.`,
										executed: false,
									},
								]);
								setIsLoading(false);
								return;
							}

							if (wantsDifferent && (iconResult?.noAlternative || iconResult?.total === 1)) {
								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: `I only found one icon for "${fallbackQuery}" in the Cloud Library.`,
										executed: false,
									},
								]);
								setIsLoading(false);
								return;
							}

							if (!iconResult || !iconResult.svgCode) {
								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: `I couldn't find an icon for "${fallbackQuery}" in the Cloud Library. Try a different keyword.`,
										executed: false,
									},
								]);
								setIsLoading(false);
								return;
							}

							if (iconResult.isPro) {
								setMessages(prev => [
									...prev,
									{
										role: 'assistant',
										content: `Found "${iconResult.title}" but it's a Pro icon. Upgrade to MaxiBlocks Pro to use it.`,
										executed: false,
									},
								]);
								setIsLoading(false);
								return;
							}

							const actionType = currentScope === 'selection' ? 'update_selection' : 'update_page';
							const targetLabel = isIconTarget ? 'icon blocks' : 'button icons';
							const directAction = {
								action: actionType,
								property: targetMeta.property,
								value: {
									svgCode: iconResult.svgCode,
									svgType: iconResult.svgType,
									title: iconResult.title,
								},
								target_block: targetMeta.targetBlock,
								message: actionType === 'selection'
									? `Updated icon to "${iconResult.title}".`
									: `Updated ${targetLabel} to "${iconResult.title}".`,
							};

							const result = await parseAndExecuteAction(directAction);
							setMessages(prev => [
								...prev,
								{ role: 'assistant', content: result.message, executed: result.executed },
							]);
						} catch (error) {
							console.error('[Maxi AI] Cloud icon error:', error);
							setMessages(prev => [
								...prev,
								{
									role: 'assistant',
									content: 'Sorry, there was an error searching the Cloud Library for icons.',
									executed: false,
								},
							]);
						}
						setIsLoading(false);
					}, 100);
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
									content: ` Created "${patternResult.title}"! The pattern has been inserted.`,
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
					// Prioity 1: Use specific target from pattern (e.g. 'button-background')
					// Priority 2: Heuristic detection from message
					const colorTarget = pattern.colorTarget || getColorTargetFromMessage(lowerMessage);

					if (hexColor) {
						const colorUpdate = buildColorUpdate(colorTarget, hexColor);
						const directAction = currentScope === 'selection'
							? { action: 'update_selection', property: colorUpdate.property, value: colorUpdate.value, target_block: colorUpdate.targetBlock, message: `Applied custom colour to ${colorUpdate.msgText}.` }
							: { action: 'update_page', property: colorUpdate.property, value: colorUpdate.value, target_block: colorUpdate.targetBlock, message: `Applied custom colour to ${colorUpdate.msgText}.` };

						setTimeout(async () => {
							const result = await parseAndExecuteAction(directAction);
							setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
							setIsLoading(false);
						}, 50);
						return;
					}
					
					setMessages(prev => [...prev, { 
						role: 'assistant', 
						content: `Choose a colour for the ${getColorTargetLabel(colorTarget)}:`,
						options: true, // Signals that we have options
						optionsType: 'palette', // Use palette swatches (rendered at lines 3348-3373)
						colorTarget: colorTarget,
						originalMessage: userMessage,
					}]);
					setIsLoading(false);
					return;
				}

				// Handle use_prompt patterns (text/url/color parsing)
				let resolvedValue = pattern.value;
				if (pattern.value === 'use_prompt') {
					const promptValue = resolvePromptValue(pattern.property, rawMessage);
					if (!promptValue) {
						const missingMsg = pattern.property === 'button_text'
							? 'Please include the button text, e.g. "Set button text to Buy now".'
							: pattern.property === 'button_url'
								? 'Please include the URL, e.g. "Link the button to https://example.com".'
								: pattern.property === 'captionContent'
									? 'Please include the caption text, e.g. "Set caption to Summer Sale".'
									: pattern.property === 'mediaAlt'
										? 'Please include the alt text, e.g. "Set alt text to smiling customer".'
										: pattern.property === 'mediaURL'
											? 'Please include the image URL, e.g. "Replace image with https://example.com/photo.jpg".'
											: 'Please include the value in your request.';

						setMessages(prev => [...prev, { role: 'assistant', content: missingMsg, executed: false }]);
						setIsLoading(false);
						return;
					}

					resolvedValue = promptValue;
					if (pattern.property === 'icon_color') {
						resolvedValue = { target: resolveButtonIconTarget(lowerMessage), color: promptValue };
					}
				}
				
				// Standard pattern handling
				const isLayoutAlign = pattern.property === 'align_items_flex' || pattern.property === 'justify_content';
				let resolvedTarget = pattern.target || requestedTarget || 'container';
				if (!pattern.target && currentScope === 'selection' && isLayoutAlign) {
					const selectionLayoutTarget = resolveSelectionLayoutTarget();
					if (selectionLayoutTarget) resolvedTarget = selectionLayoutTarget;
				}
				if (pattern.property.startsWith('shape_divider')) {
					resolvedTarget = 'container';
				}
				const directAction = currentScope === 'selection'
					? { action: 'update_selection', property: pattern.property, value: resolvedValue, target_block: resolvedTarget, message: pattern.selectionMsg }
					: { action: 'update_page', property: pattern.property, value: resolvedValue, target_block: resolvedTarget, message: pattern.pageMsg };

				setTimeout(async () => {
					const result = await parseAndExecuteAction(directAction);
					setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
					setIsLoading(false);
				}, 50);
				return;
			}
		}
		
		if (!isGlobalScope) {
			// SPECIAL: Gap with number extraction (not in lookup table)
			const gapMatch = lowerMessage.match(/(\d+)\s*(?:px)?\s*(?:gap|gutter|air\s*between|space\s*between\s*items)/i);
			if (gapMatch) {
				const gapValue = parseInt(gapMatch[1]);
				setIsLoading(true);
				const directAction = currentScope === 'selection'
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
					gapTarget: currentScope === 'selection' ? 'selection' : 'container',
					executed: false
				}]);
				return;
			}
		}

		setIsLoading(true);

		try {
			// Build context with scope info
			let context = '';
			context += `\n\nUSER INTENT SCOPE: ${scope.toUpperCase()}`;
			context += `\n- SELECTION: Apply change only to the selected block.`;
			context += `\n- PAGE: Apply change to all relevant blocks on the entire page (use update_page).`;
			context += `\n- GLOBAL: Apply change to the site-wide Style Card (use update_style_card for specific tokens; apply_theme for vibes/palettes).`;
			context += `\n\nIMPORTANT: The user has explicitly selected to apply changes to "${scope.toUpperCase()}".`;
			
			if (scope === 'global') {
				context += `\nUse "update_style_card" for specific token changes (fonts, sizes, heading/body/button colors, palette slots).`;
				context += `\nUse "apply_theme" only for overall theme/aesthetic or palette generation requests.`;
				context += `\nExample: { "action": "update_style_card", "updates": { "headings": { "font-family-general": "Cormorant Garamond" } }, "message": "Updated heading font." }`;
			} else if (scope === 'selection') {
				context += `\n\nCRITICAL: You are in SELECTION mode. You MUST use the "update_selection" action.`;
				context += `\nThis targets the selected block AND its inner blocks (recursively).`;
				context += `\nDo not use update_page (would affect unselected) or apply_responsive_spacing (use update_selection instead).`;
				if (selectedBlock) {
					const blockSummary = summarizeBlockStructure(selectedBlock);
					console.log('[Maxi AI Debug] Context Loop - Block Summary:', blockSummary);
					context += `\n\nUser has selected: ${selectedBlock.name}\nAttributes: ${JSON.stringify(selectedBlock.attributes, null, 2)}`;
					if (blockSummary && blockSummary.innerBlocks && blockSummary.innerBlocks.length > 0) {
						context += `\n\nInner Structure (Recursive): ${JSON.stringify(blockSummary.innerBlocks, null, 2)}`;
					}
				} else {
					context += '\n\nNo block is currently selected.';
				}
			} else if (scope === 'page') {
				context += `\n\nCRITICAL: You are in PAGE mode. You SHOULD use "update_page" or "apply_responsive_spacing" to affect multiple blocks if requested.`;
			}



			if (selectedBlock) {
				const blockSummary = summarizeBlockStructure(selectedBlock);
				console.log('[Maxi AI Debug] Context Loop - Block Summary:', blockSummary);
				context += `\n\nUser has selected: ${selectedBlock.name}\nAttributes: ${JSON.stringify(selectedBlock.attributes, null, 2)}`;
				if (blockSummary && blockSummary.innerBlocks && blockSummary.innerBlocks.length > 0) {
					context += `\n\nInner Structure (Recursive): ${JSON.stringify(blockSummary.innerBlocks, null, 2)}`;
				}
			} else {
				context += '\n\nNo block is currently selected.';
			}
			// Add Style Card Context
			const styleCardContext = buildStyleCardContext(activeStyleCard);
			if (styleCardContext) {
				context += styleCardContext;
			}

			const blockPrompt = selectedBlock ? getAiPromptForBlockName(selectedBlock.name) : '';
			const scopePrompt = scope === 'global' ? STYLE_CARD_MAXI_PROMPT : blockPrompt;
			const systemPrompt = scopePrompt ? `${SYSTEM_PROMPT}\n\n${scopePrompt}` : SYSTEM_PROMPT;

			const response = await fetch(`${window.wpApiSettings?.root || '/wp-json/'}maxi-blocks/v1.0/ai/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(window.wpApiSettings?.nonce ? { 'X-WP-Nonce': window.wpApiSettings.nonce } : {}),
				},
				body: JSON.stringify({
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'system', content: 'Context: ' + context + (selectedBlock ? '\n\nBlock Skills: ' + getSkillContextForBlock(selectedBlock.name) : '') },
						...messages.filter(m => m.role !== 'assistant' || !m.executed).slice(-6).map(m => ({ 
							role: m.role === 'assistant' ? 'assistant' : 'user', 
							content: typeof m.content === 'string' ? m.content : String(m.content || '')
						})),
						{ role: 'user', content: rawMessage },
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
					const allowedGlobalActions = new Set(['apply_theme', 'update_style_card', 'message']);
					if (parsed.action && !allowedGlobalActions.has(parsed.action)) {
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


			const { executed, message, options, optionsType } = await parseAndExecuteAction(assistantContent);
			console.log('[Maxi AI] Parsed action result:', { executed, message, options });

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: message,
					options,
					optionsType,
					executed,
				},
			]);
		} catch (error) {
			console.error('AI Chat error:', error);
			const rawError = String(error?.message || '');
			let parsedError = null;
			if (rawError.trim().startsWith('{')) {
				try {
					parsedError = JSON.parse(rawError);
				} catch (parseError) {
					parsedError = null;
				}
			}

			const errorCode = parsedError?.code;
			const errorText = parsedError?.message || rawError;

			// Attempt to show a more helpful error message
			let errorMessage = __(
				'Error: I could not match that request to a supported prompt. Try rephrasing or update the prompt mapping.',
				'maxi-blocks'
			);

			if (errorCode === 'no_api_key' || /OpenAI API key/i.test(errorText)) {
				errorMessage = __('Error: Please check your OpenAI API key in Maxi AI settings.', 'maxi-blocks');
			} else if (errorCode === 'unsupported_provider') {
				errorMessage = __('Error: Unsupported AI provider configured.', 'maxi-blocks');
			} else if (errorCode === 'openai_api_error') {
				errorMessage = __('Error: The AI provider returned an error. Check your API key, model, or quota.', 'maxi-blocks');
			} else if (errorCode === 'invalid_messages' || errorCode === 'invalid_prompt') {
				errorMessage = __('Error: The AI request payload was invalid. Try rephrasing or check prompt mappings.', 'maxi-blocks');
			} else if (errorText) {
				// Don't show entire HTML responses if something crashed badly
				if (errorText.includes('<') && errorText.includes('>')) {
					errorMessage = __('Server Error: Received HTML instead of JSON. Check server logs.', 'maxi-blocks');
				} else if (errorText.length < 150) {
					errorMessage = `Error: ${errorText}`;
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

	const handleSuggestion = async (suggestion) => {
		// 1. Handle Active Conversation Flow
		if (conversationContext) {
			console.log('[Maxi AI Conversation] Handling input:', suggestion);
			console.log('[Maxi AI Conversation] Current Context:', JSON.stringify(conversationContext, null, 2));
			
			let value = suggestion;

			// Map "Color X" to numeric X
			if (typeof suggestion === 'string' && suggestion.startsWith('Color ')) {
				const num = parseInt(suggestion.replace('Color ', ''));
				if (!isNaN(num)) value = num;
				console.log('[Maxi AI Conversation] Mapped Color to:', value);
			}
			// Map Option Labels to Values (if stored in context)
			else if (conversationContext.currentOptions && conversationContext.currentOptions.length > 0) {
				console.log('[Maxi AI Conversation] Looking for option match. Options:', JSON.stringify(conversationContext.currentOptions));
				const match = conversationContext.currentOptions.find(o => {
					if (typeof o === 'object' && o.label) {
						return o.label === suggestion;
					}
					return o === suggestion;
				});
				console.log('[Maxi AI Conversation] Match found:', match);
				if (match && typeof match === 'object' && match.value !== undefined) {
					value = match.value;
					console.log('[Maxi AI Conversation] Mapped to value:', value);
				}
			}

			// Capture data for the pending target
			const updatedData = { 
				...conversationContext.data,
				[conversationContext.pendingTarget]: value
			};

			console.log('[Maxi AI Conversation] Updated Data:', updatedData);

			// Add User Message
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setIsLoading(true);

			// Update context state
			setConversationContext(prev => ({ ...prev, data: updatedData }));

            // ORCHESTRATION: Iterate over ALL tracked blocks
            const targetIds = conversationContext.blockIds || [];
            if (targetIds.length === 0 && selectedBlock) targetIds.push(selectedBlock.clientId); // Fallback

            // We need to determine the response. Since all blocks usually follow the same flow path,
            // we process the first valid block to determine the NEXT STEP (Ask Question or Done).
            // Then we apply any updates to ALL blocks.
            
            // Find full block objects - Get FRESH blocks from store to avoid stale closure
            const freshBlocks = select('core/block-editor').getBlocks();
            const fullBlocks = collectBlocks(freshBlocks, b => targetIds.includes(b.clientId));
            if (fullBlocks.length === 0 && selectedBlock && targetIds.includes(selectedBlock.clientId)) fullBlocks.push(selectedBlock);

            if (fullBlocks.length === 0) {
                 setMessages(prev => [...prev, { role: 'assistant', content: "Lost track of blocks.", executed: false }]);
                 setIsLoading(false);
                 return;
            }

            let nextStepResponse = null;
            let finalMsg = "Done.";
			let isUnchanged = true;

            // Batch update via registry if needed, or just sequential dispatch
            // We'll process Logic on the first block to get the 'Action'
            const primaryBlock = fullBlocks[0];
            const prefix = getBlockPrefix(primaryBlock.name);
			const flowHandler = getAiHandlerForBlock(primaryBlock);
            const logicResult = flowHandler
				? flowHandler(primaryBlock, conversationContext.flow, null, prefix, updatedData)
				: null;

            if (logicResult) {
                if (logicResult.action === 'ask_options' || logicResult.action === 'ask_palette') {
                    // It's another question - update UI and Context, no block changes yet (usually)
                    nextStepResponse = logicResult;
                } 
                else if (logicResult.action === 'apply') {
                    // APPLIES TO ALL BLOCKS
                    // We need to generate the specific attributes for EACH block (prefixes might differ!)
                    
                    fullBlocks.forEach(blk => {
                        const p = getBlockPrefix(blk.name);
						const blockHandler = getAiHandlerForBlock(blk);
                        // Re-run handler for specific block to get correct attributes
                        const res = blockHandler
							? blockHandler(blk, conversationContext.flow, null, p, updatedData)
							: null;
                        
                        if (res && res.action === 'apply' && res.attributes) {
                            dispatch('core/block-editor').updateBlockAttributes(blk.clientId, res.attributes);
							isUnchanged = false;
                        }
                    });

                    if (logicResult.done) {
                        nextStepResponse = { done: true };
						// Prefer explicit handler message, otherwise fall back to pattern copy
						if (logicResult.message) {
							finalMsg = logicResult.message;
						} else {
							const pattern = AI_BLOCK_PATTERNS.find(p => p.property === conversationContext.flow);
							if (pattern && pattern.pageMsg) finalMsg = pattern.pageMsg; // Or selectionMsg depending on mode
						}
                    }
                }
            }

            setTimeout(() => {
                if (nextStepResponse) {
                    if (nextStepResponse.done) {
                         setConversationContext(null); // Clear Context
                         setMessages(prev => [...prev, { role: 'assistant', content: finalMsg, executed: true }]);
                    } else {
                        // Ask next question
                        setConversationContext(prev => ({
                            ...prev,
                            pendingTarget: nextStepResponse.target,
                            currentOptions: nextStepResponse.options || []
                        }));
                         
                        setMessages(prev => [...prev, { 
                            role: 'assistant', 
                            content: nextStepResponse.msg, 
                            options: nextStepResponse.options ? nextStepResponse.options.map(o => o.label || o) : (nextStepResponse.action === 'ask_palette' ? ['palette'] : []),
                            optionsType: nextStepResponse.action === 'ask_palette' ? 'palette' : 'text',
                            colorTarget: nextStepResponse.target,
                            executed: false 
                        }]);
                    }
                } else {
                     // No result?
                     setMessages(prev => [...prev, { role: 'assistant', content: "Flow state error.", executed: false }]);
                }
                setIsLoading(false);
            }, 500);

			return; // Stop standard processing
		}

		// 2. Standard Logic
		let directAction = null;
		
		// Get target context from the last clarification message (if any)
		const lastClarificationMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.options);
		const targetContext = lastClarificationMsg?.targetContext;
		const lastClarifyContent =
			typeof lastClarificationMsg?.content === 'string'
				? lastClarificationMsg.content.toLowerCase()
				: '';
		const ratioOptionMatch =
			typeof suggestion === 'string'
				? suggestion.trim().match(/^(\d+)\s*[:/]\s*(\d+)$/)
				: null;
		const isImageRatioContext =
			lastClarifyContent.includes('image') ||
			lastClarifyContent.includes('images') ||
			selectedBlock?.name?.includes('image') ||
			targetContext === 'image';
		const spacingBase = lastClarificationMsg?.spacingBase;
		const spacingSide = lastClarificationMsg?.spacingSide;
		const spacingPresetValue = {
			Compact: 60,
			Comfortable: 100,
			Spacious: 140,
		};
		const lastShadowPrompt = lastClarifyContent.includes('shadow');
		const lastShapeDividerMsg = [...messages].reverse().find(m => m.shapeDividerLocation || m.shapeDividerTarget);
		const shapeDividerLocations = ['Top', 'Bottom', 'Both'];
		const shapeDividerStyles = ['Wave', 'Curve', 'Slant', 'Triangle'];
		const spacingPresets = {
			Compact: { desktop: '60px', tablet: '40px', mobile: '20px' },
			Comfortable: { desktop: '100px', tablet: '60px', mobile: '40px' },
			Spacious: { desktop: '140px', tablet: '80px', mobile: '60px' },
		};

		const linkOptionLabels = ['Open in new tab', 'Make it nofollow', 'Both'];
		const lastOptions = Array.isArray(lastClarificationMsg?.options)
			? lastClarificationMsg.options
			: [];
		const isLinkOptionContext =
			linkOptionLabels.includes(suggestion) &&
			(lastClarifyContent.includes('link') ||
				lastOptions.some(option => linkOptionLabels.includes(option)));
		if (isLinkOptionContext) {
			const recentMessages = messagesRef.current || [];
			let lastUrl = null;
			for (let i = recentMessages.length - 1; i >= 0; i -= 1) {
				const msg = recentMessages[i];
				if (msg?.role !== 'user' || typeof msg.content !== 'string') continue;
				lastUrl = extractUrl(msg.content);
				if (lastUrl) break;
			}
			if (!lastUrl) {
				lastUrl = selectedBlock?.attributes?.linkSettings?.url || null;
			}

			const opensInNewTab = suggestion === 'Open in new tab' || suggestion === 'Both';
			const noFollow = suggestion === 'Make it nofollow' || suggestion === 'Both';
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			directAction = {
				action: actionType,
				property: 'link_settings',
				value: {
					...(lastUrl ? { url: lastUrl } : {}),
					opensInNewTab,
					noFollow,
				},
				...(actionType === 'update_page' ? { target_block: 'container' } : {}),
				message: lastUrl
					? 'Updated the link options.'
					: 'Updated link options. Add a URL to activate the link.',
			};
		}

		if (lastShapeDividerMsg?.shapeDividerLocation && shapeDividerLocations.includes(suggestion)) {
			const location = suggestion.toLowerCase();
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Which shape style should the divider use?',
				options: shapeDividerStyles,
				shapeDividerTarget: location,
				executed: false
			}]);
			return;
		}

		if (lastShapeDividerMsg?.shapeDividerTarget && shapeDividerStyles.includes(suggestion)) {
			const target = lastShapeDividerMsg.shapeDividerTarget;
			const property = target === 'top'
				? 'shape_divider_top'
				: target === 'bottom'
					? 'shape_divider_bottom'
					: 'shape_divider_both';
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const shape = suggestion.toLowerCase();
			const message = target === 'both'
				? `Added ${shape} shape dividers to the top and bottom.`
				: `Added ${shape} shape divider to the ${target}.`;

			directAction = {
				action: actionType,
				property,
				value: shape,
				target_block: 'container',
				message
			};
		}

		if (ratioOptionMatch && (lastClarifyContent.includes('ratio') || lastClarifyContent.includes('aspect')) && isImageRatioContext) {
			const ratioValue = resolveImageRatioValue(ratioOptionMatch[1], ratioOptionMatch[2]);
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const targetBlock =
				isImageRatioContext ? 'image' : targetContext;

			directAction = {
				action: actionType,
				property: 'image_ratio',
				value: ratioValue,
				target_block: targetBlock || 'image',
				message: `Aspect ratio set to ${ratioOptionMatch[1]}:${ratioOptionMatch[2]}.`,
			};
		}
		else if (lastShadowPrompt && ['Soft', 'Crisp', 'Bold', 'Glow'].includes(suggestion)) {
			const styleMap = {
				Soft: { x: 0, y: 10, blur: 30, spread: 0 },
				Crisp: { x: 0, y: 2, blur: 4, spread: 0 },
				Bold: { x: 0, y: 20, blur: 25, spread: -5 },
				Glow: { x: 0, y: 0, blur: 15, spread: 2 },
			};
			const isVideoTarget = selectedBlock?.name?.includes('video');
			const property = isVideoTarget ? 'video_box_shadow' : 'box_shadow';
			const value = isVideoTarget
				? { ...styleMap[suggestion], color: 8 }
				: styleMap[suggestion];
			const targetBlock = isVideoTarget ? 'video' : targetContext;
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';

			directAction = {
				action: actionType,
				property,
				value,
				target_block: targetBlock,
				message: targetBlock ? `Applied ${suggestion} shadow to all ${targetBlock}s.` : `Applied ${suggestion} shadow.`,
			};
		}
		else if (suggestion === 'Remove' && (lastClarifyContent.includes('spacing') || lastClarifyContent.includes('padding') || lastClarifyContent.includes('margin'))) {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const base = lastClarifyContent.includes('margin') ? 'margin' : 'padding';
			let property = base;
			if (base === 'padding' && targetContext === 'video') {
				property = 'video_padding';
			}
			directAction = {
				action: actionType,
				property,
				value: 0,
				...(targetContext ? { target_block: targetContext } : {}),
				message: `Removed ${base}.`,
			};
		}

		// 1. ROUNDED CORNERS
		else if (suggestion.includes('Subtle (8px)')) directAction = { action: 'update_page', property: 'border_radius', value: 8, target_block: targetContext, message: 'Applied Subtle rounded corners (8px).' };
		else if (suggestion.includes('Soft (24px)')) directAction = { action: 'update_page', property: 'border_radius', value: 24, target_block: targetContext, message: 'Applied Soft rounded corners (24px).' };
		else if (suggestion.includes('Full (50px)')) directAction = { action: 'update_page', property: 'border_radius', value: 50, target_block: targetContext, message: 'Applied Full rounded corners (50px).' };
		
		// 2. RESPONSIVE SPACING
		// Uses dedicated createResponsiveSpacing function for consistent breakpoint handling
		// Action type 'apply_responsive_spacing' signals special handling in parseAndExecuteAction
		else if (spacingSide && spacingBase && ['Compact', 'Comfortable', 'Spacious', 'Remove'].includes(suggestion)) {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			let property = `${spacingBase}_${spacingSide}`;
			if (spacingBase === 'padding' && targetContext === 'video') {
				property = `video_padding_${spacingSide}`;
			}
			const value = suggestion === 'Remove' ? 0 : spacingPresetValue[suggestion];
			directAction = {
				action: actionType,
				property,
				value,
				...(targetContext ? { target_block: targetContext } : {}),
				message: suggestion === 'Remove'
					? `Removed ${spacingSide} ${spacingBase}.`
					: `Applied ${suggestion} ${spacingSide} ${spacingBase}.`,
			};
		}
		else if (spacingBase && suggestion === 'Remove') {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			let property = spacingBase;
			if (spacingBase === 'padding' && targetContext === 'video') {
				property = 'video_padding';
			}
			directAction = {
				action: actionType,
				property,
				value: 0,
				...(targetContext ? { target_block: targetContext } : {}),
				message: `Removed ${spacingBase}.`,
			};
		}
		else if (targetContext === 'video' && ['Compact', 'Comfortable', 'Spacious'].includes(suggestion)) {
			const presetValue = {
				Compact: 60,
				Comfortable: 100,
				Spacious: 140,
			}[suggestion];
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const message = scope === 'selection'
				? `Applied ${suggestion} top/bottom padding to the selected video.`
				: `Applied ${suggestion} top/bottom padding to all videos.`;

			directAction = {
				action: actionType,
				property: 'video_padding_vertical',
				value: presetValue,
				target_block: 'video',
				message,
			};
		}
		else if (['Compact', 'Comfortable', 'Spacious'].includes(suggestion)) {
			const preset = suggestion.toLowerCase();
			if (scope === 'selection') {
				directAction = {
					action: 'update_selection',
					property: 'responsive_padding',
					value: spacingPresets[suggestion],
					target_block: targetContext || 'container',
					message: `Applied ${suggestion} spacing across selected breakpoints.`,
				};
			} else {
				directAction = {
					action: 'apply_responsive_spacing',
					preset,
					target_block: targetContext || 'container',
					message: `Applied ${suggestion} spacing across all breakpoints.`,
				};
			}
		}

		// 3. SHADOW & GLOW - Handled by two-step flow (color selection ' style selection)
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

			const prevMsg = messagesRef.current?.findLast(m => m.colorTarget);
			
			if (prevMsg?.colorTarget === 'border' || prevMsg?.colorTarget === 'button-border') {
				// Don't apply immediately - ask for border style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which border style?',
					options: ['Solid Thin', 'Solid Medium', 'Solid Fat', 'Dashed', 'Dotted'],
					borderColorChoice: colorValue,
					targetContext: prevMsg?.colorTarget === 'button-border' ? 'button' : prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else if (prevMsg?.colorTarget === 'box-shadow') {
				// Don't apply immediately - ask for shadow style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which shadow style?',
					options: ['Soft', 'Crisp', 'Bold', 'Glow'],
					shadowColorChoice: colorValue,
					targetContext: prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else {
				const target = prevMsg?.colorTarget;
				const colorUpdate = buildColorUpdate(target, colorValue);

				directAction = { 
					action: 'update_page', 
					property: colorUpdate.property, 
					value: colorUpdate.value, 
					target_block: colorUpdate.targetBlock,
					message: `Applied ${isPalette ? 'Colour ' + colorValue : 'Custom Colour'} to ${colorUpdate.msgText}.` 
				};
			}
		}

		// ALIGNMENT OPTIONS
		else if (['Align Text', 'Align Items'].includes(suggestion)) {
			const prevMsg = messagesRef.current?.findLast(m => m.alignmentType);
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
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 10, message: 'Applied small gap (10px).' }
				: { action: 'update_page', property: 'gap', value: 10, target_block: 'container', message: 'Applied small gap (10px) to containers.' };
		}
		else if (suggestion === 'Medium (20px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 20, message: 'Applied medium gap (20px).' }
				: { action: 'update_page', property: 'gap', value: 20, target_block: 'container', message: 'Applied medium gap (20px) to containers.' };
		}
		else if (suggestion === 'Large (40px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 40, message: 'Applied large gap (40px).' }
				: { action: 'update_page', property: 'gap', value: 40, target_block: 'container', message: 'Applied large gap (40px) to containers.' };
		}

		// 8. BORDER STYLE PRESETS (Legacy handler for non-FSM flows)
		else if (['Solid Normal', 'Solid Fat', 'Dashed Normal', 'Dashed Fat', 'Dotted Normal', 'Dotted Fat', 'Solid Thin', 'Solid Medium', 'Dashed', 'Dotted'].includes(suggestion)) {
			// GUARD: If no active context and last message was "Done.", ignore this click
			// to prevent legacy handler from overriding FSM-applied styles with defaults
			const lastAssistantMsg = messagesRef.current?.findLast(m => m.role === 'assistant');
			if (lastAssistantMsg?.content === 'Done.' || lastAssistantMsg?.executed === true) {
				// Flow is complete, this is a stale option click - prompt user to start fresh
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, { 
					role: 'assistant', 
					content: 'The previous flow is complete. Say "outline buttons" to start a new border style flow!',
					executed: false 
				}]);
				return;
			}
			
			const prevMsg = messagesRef.current?.findLast(m => m.borderColorChoice !== undefined);
			const borderColor = prevMsg?.borderColorChoice || 1;
			const targetBlock = prevMsg?.targetContext;
			
			const styleMap = {
				'Solid Normal': { width: 1, style: 'solid' },
				'Solid Fat': { width: 4, style: 'solid' },
				'Dashed Normal': { width: 1, style: 'dashed' },
				'Dashed Fat': { width: 2, style: 'dashed' },
				'Dotted Normal': { width: 1, style: 'dotted' },
				'Dotted Fat': { width: 2, style: 'dotted' },
				// New simplified options
				'Solid Thin': { width: 1, style: 'solid' },
				'Solid Medium': { width: 2, style: 'solid' },
				'Dashed': { width: 2, style: 'dashed' },
				'Dotted': { width: 2, style: 'dotted' }
			};
			
			const style = styleMap[suggestion];
			
			// Context Recovery & Action Determination
			let finalTarget = targetBlock;
			let finalAction = scope === 'selection' ? 'update_selection' : 'update_page';

			// FAILSAFE: If context is lost (stale closure) for the Button Flow options, default to Page Button update
			// This prevents "Please select a block first" error when user is in Page tab but scope/context is stale
			if (!finalTarget && ['Solid Thin', 'Solid Medium', 'Solid Fat', 'Dashed', 'Dotted'].includes(suggestion)) {
				finalTarget = 'button';
				finalAction = 'update_page';
			}

			// Force update_page if target is button (Button Flow)
			if (finalTarget === 'button') finalAction = 'update_page';

			directAction = {
				action: finalAction,
				property: 'border',
				value: { ...style, color: borderColor },
				target_block: finalTarget,
				message: finalTarget ? `Applied ${suggestion} border to all ${finalTarget}s.` : `Applied ${suggestion} border.`
			};
		}

		// 9. SHADOW STYLE PRESETS - Only trigger if we have a shadow color choice in context
		else if (['Soft', 'Crisp', 'Bold', 'Glow'].includes(suggestion)) {
			const prevMsg = messagesRef.current?.findLast(m => m.shadowColorChoice !== undefined);
			// Only handle as shadow preset if we have shadow context
			if (prevMsg?.shadowColorChoice !== undefined) {
				const shadowColor = prevMsg.shadowColorChoice;
				const targetBlock = prevMsg?.targetContext;

			const styleMap = {
				Soft: { x: 0, y: 10, blur: 30, spread: 0 },
				Crisp: { x: 0, y: 2, blur: 4, spread: 0 },
				Bold: { x: 0, y: 20, blur: 25, spread: -5 },
				Glow: { x: 0, y: 0, blur: 15, spread: 2 },
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
		} // Close else if (['Soft', 'Crisp', 'Bold', 'Glow'])

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
						options: nextOptions || result.options,
						optionsType: result.optionsType,
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
		<div 
			className={`maxi-ai-chat-panel${isDragging ? ' maxi-ai-chat-panel--dragging' : ''}`}
			style={position ? {
				left: position.x,
				top: position.y,
				bottom: 'auto'
			} : undefined}
		>
			<div 
				className='maxi-ai-chat-panel__header'
				onMouseDown={handleMouseDown}
				style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
			>
				<h3>
					<span></span>
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
						onClick={() => handleScopeChange('page')}
						title={__('Apply changes to the entire page', 'maxi-blocks')}
						data-testid='maxi-ai-apply-page'
					>
						{__('Page', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'selection' ? 'is-active' : ''}`}
						onClick={() => handleScopeChange('selection')}
						title={__('Apply changes only to the selected block', 'maxi-blocks')}
						data-testid='maxi-ai-apply-section'
					>
						{__('Selection', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'global' ? 'is-active' : ''}`}
						onClick={() => handleScopeChange('global')}
						title={__('Apply changes globally via Style Cards', 'maxi-blocks')}
					>
						{__('Style Card', 'maxi-blocks')}
					</button>
				</div>
				<button className='maxi-ai-chat-panel__close' onClick={onClose}>
					--
				</button>
			</div>

			<div className='maxi-ai-chat-panel__messages'>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`maxi-ai-chat-panel__message maxi-ai-chat-panel__message--${msg.role}${msg.isError ? ' maxi-ai-chat-panel__message--error' : ''}`}
						data-testid={msg.testId}
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
									{msg.undone ? ' ' + __('Undone', 'maxi-blocks') : '" ' + __('Applied', 'maxi-blocks')}
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
					<div
						className='maxi-ai-chat-panel__message maxi-ai-chat-panel__message--assistant'
						data-testid='maxi-ai-loading'
					>
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
					data-testid='maxi-ai-prompt'
				/>
				<button
					className='maxi-ai-chat-panel__send'
					onClick={sendMessage}
					disabled={isLoading || !input.trim()}
					data-testid='maxi-ai-send'
				>
					<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
						<path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
					</svg>
				</button>
			</div>
		</div>
	);
};

const AI_CHAT_STATE_EVENT = 'maxi-ai-chat-state';

const AiChatPanelContainer = ({ defaultOpen = false } = {}) => {
	const resolveInitialOpenState = () => {
		if (typeof window !== 'undefined' && window.maxiAIChatIsOpen !== undefined) {
			return Boolean(window.maxiAIChatIsOpen);
		}
		return Boolean(defaultOpen);
	};
	const [isOpen, setIsOpen] = useState(resolveInitialOpenState);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const toggle = () => setIsOpen(prev => !prev);
		const open = () => setIsOpen(true);
		const close = () => setIsOpen(false);

		window.addEventListener('maxi-ai-toggle', toggle);
		window.addEventListener('maxi-ai-open', open);
		window.addEventListener('maxi-ai-close', close);

		window.maxiToggleAIChat = toggle;

		return () => {
			window.removeEventListener('maxi-ai-toggle', toggle);
			window.removeEventListener('maxi-ai-open', open);
			window.removeEventListener('maxi-ai-close', close);

			if (window.maxiToggleAIChat === toggle) {
				delete window.maxiToggleAIChat;
			}
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const nextState = Boolean(isOpen);
		window.maxiAIChatIsOpen = nextState;
		window.dispatchEvent(
			new CustomEvent(AI_CHAT_STATE_EVENT, { detail: { isOpen: nextState } })
		);
	}, [isOpen]);

	return (
		<AiChatPanelView
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
		/>
	);
};

export default AiChatPanelContainer;
