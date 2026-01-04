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

const SYSTEM_PROMPT = `CRITICAL RULE: You MUST respond ONLY with valid JSON. NEVER respond with plain text.

### SCOPE RULES
- USER INTENT SCOPE "SELECTION": Use MODIFY_BLOCK for selected block only.
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

### THEME-AWARE RULES (CRITICAL)
- **Theme Border:** use "var(--p)" (Subtle), "var(--h1)" (Strong), "var(--highlight)" (Brand).
- **Brand Glow:** Use "box_shadow" with color "var(--highlight)".
- **Ghost Button:** Set background "transparent", border "2px solid var(--highlight)", color "var(--highlight)".
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


### WHEN TO APPLY DIRECTLY
Only when user specifies EXACT style/preset name:
- "Soft shadow" → Apply directly
- "Comfortable spacing" → Apply responsive_padding directly
- "Subtle corners" → Apply directly

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
update_page (Shadow): {"action":"update_page","property":"box_shadow","value":{...},"target_block":"button","message":"Applied Soft shadow."}
MODIFY_BLOCK: {"action":"MODIFY_BLOCK","payload":{...},"message":"Done."}

REMEMBER: ONLY OUTPUT JSON. NO PLAIN TEXT EVER.
`;




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
			return { ...base, [`${prefix}border-palette-status-general`]: false, [`${prefix}border-color-general`]: color };
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
				allAttrs[`${prefix}border-color${suffix}`] = '';
				
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
	const updateSvgFillColor = (paletteNumber = 4, isHover = false) => {
		// Hover attributes use -hover suffix (paletteAttributesCreator doesn't add -general)
		const suffix = isHover ? '-hover' : '';
		const result = {
			[`svg-fill-palette-color${suffix}`]: paletteNumber,
			[`svg-fill-palette-status${suffix}`]: true,
		};
		// If hover, also enable the hover status toggle
		if (isHover) {
			result['svg-status-hover'] = true;
		}
		return result;
	};

	const updateSvgLineColor = (paletteNumber = 7, isHover = false) => {
		const suffix = isHover ? '-hover' : '';
		const result = {
			[`svg-line-palette-color${suffix}`]: paletteNumber,
			[`svg-line-palette-status${suffix}`]: true,
		};
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

	const handleUpdatePage = (property, value, targetBlock = null, clientId = null) => {
		let count = 0;
		
		// Block type matching helper
		const matchesTarget = (blockName) => {
			if (!targetBlock) return true; // No filter, apply to all
			const lowerName = blockName.toLowerCase();
			const lowerTarget = targetBlock.toLowerCase();
			
			// STRICTER TARGETING
			if (lowerTarget === 'image') {
				// Only target actual Image blocks, ignore containers/groups/rows that might have "image" in name
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
			return true;
		};
		
		const recursiveUpdate = (blocks) => {
			blocks.forEach(block => {
				let changes = null;
				const isMaxi = block.name.startsWith('maxi-blocks/');
				
				const prefix = getBlockPrefix(block.name);
				
				// MATCHING LOGIC: If clientId is provided, match strictly. Otherwise use target filters.
				const isMatch = clientId ? block.clientId === clientId : matchesTarget(block.name);

				if (isMaxi && isMatch) {
					switch (property) {
						case 'background_color':
							// Apply to containers, rows, columns OR if it's a direct clientId match (Selection)
							if (clientId || block.name.includes('container') || block.name.includes('row') || block.name.includes('column')) {
								changes = updateBackgroundColor(block.clientId, value, block.attributes);
							}
							break;
						case 'text_color':
							// Apply to text and buttons OR direct selection
							if (clientId || block.name.includes('text-maxi') || block.name.includes('button-maxi')) {
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
							if (typeof value === 'object') {
								changes = updateBorder(value.width, value.style, value.color, prefix);
							} else if (typeof value === 'string') {
								// Simple parse for "1px solid color"
								const parts = value.split(' ');
								if (parts.length >= 3) {
									// Assume format: width style color
									changes = updateBorder(parseInt(parts[0]), parts[1], parts.slice(2).join(' '), prefix);
								} else {
									// FALLBACK: Single value = color only, use defaults
									// This handles AI sending just "var(--p)" or "var(--highlight)"
									changes = updateBorder(1, 'solid', value, prefix);
								}
							}
							break;
						case 'box_shadow':
							// value is expected to be object {x, y, blur, spread, color}
							if (typeof value === 'object') {
								changes = updateBoxShadow(value.x, value.y, value.blur, value.spread, value.color, prefix, value.opacity);
							} else {
								console.warn('Expected object for box_shadow in Page update');
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
							if (clientId || block.name.includes('image')) {
								changes = updateImageFit(value);
							}
							break;
						case 'opacity':
							changes = updateOpacity(value);
							break;
						case 'svg_fill_color':
							// Only apply to SVG icon blocks
							if (clientId || block.name.includes('svg-icon')) {
								const paletteNum = typeof value === 'number' ? value : parseInt(value) || 4;
								changes = updateSvgFillColor(paletteNum);
							}
							break;
						case 'svg_line_color':
							// Only apply to SVG icon blocks
							if (clientId || block.name.includes('svg-icon')) {
								const paletteNum = typeof value === 'number' ? value : parseInt(value) || 7;
								changes = updateSvgLineColor(paletteNum);
							}
							break;
						case 'svg_stroke_width':
							// Only apply to SVG icon blocks
							if (clientId || block.name.includes('svg-icon')) {
								const strokeWidth = typeof value === 'number' ? value : parseInt(value) || 2;
								changes = updateSvgStrokeWidth(strokeWidth);
							}
							break;
						case 'svg_fill_color_hover':
							// Only apply to SVG icon blocks - hover state
							if (clientId || block.name.includes('svg-icon')) {
								const paletteNum = typeof value === 'number' ? value : parseInt(value) || 4;
								changes = updateSvgFillColor(paletteNum, true); // true = isHover
							}
							break;
						case 'svg_line_color_hover':
							// Only apply to SVG icon blocks - line/stroke hover state
							if (clientId || block.name.includes('svg-icon')) {
								const paletteNum = typeof value === 'number' ? value : parseInt(value) || 7;
								changes = updateSvgLineColor(paletteNum, true); // true = isHover
							}
							break;
						case 'text_align':
							changes = updateTextAlign(value);
							break;
						case 'align_items':
							changes = updateItemAlign(value);
							break;
						case 'align_everything':
							changes = {
								...updateTextAlign(value),
								...updateItemAlign(value)
							};
							break;
					}
				}

				if (changes) {
					updateBlockAttributes(block.clientId, changes);
					count++;
				}

				if (block.innerBlocks && block.innerBlocks.length > 0) {
					recursiveUpdate(block.innerBlocks);
				}
			});
		};

		// Wrap in batch to prevent multiple re-renders
		registry.batch(() => {
			recursiveUpdate(allBlocks);
		});
		
		return `Updated ${count} blocks on the page.`;
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
				? { action: 'MODIFY_BLOCK', payload: { border_radius: 0 }, message: 'Removed rounded corners from selected block.' }
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
				? { action: 'MODIFY_BLOCK', payload: { shadow: 'none' }, message: 'Removed shadow from selected block.' }
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
				? { action: 'MODIFY_BLOCK', payload: { border: 'none' }, message: 'Removed border from selected block.' }
				: { action: 'update_page', property: 'border', value: 'none', message: 'Removed borders.' };
			
			setTimeout(async () => {
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [...prev, { role: 'assistant', content: result.message, executed: result.executed }]);
				setIsLoading(false);
			}, 50);
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
				context += `\n\nCRITICAL: You are in SELECTION mode. You MUST only use the "MODIFY_BLOCK" action.`;
				context += `\nEven if the user says "all images", they have explicitly chosen "SELECTION" tab, so you MUST only modify the CURRENTLY SELECTED block.`;
				context += `\nDO NOT use update_page or apply_responsive_spacing in this mode.`;
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
						{ role: 'system', content: 'Context: ' + context },
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

			// Force apply_theme for global scope if AI didn't use it
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

			// Coerce update_page to MODIFY_BLOCK in selection mode
			if (scope === 'selection') {
				try {
					const parsed = JSON.parse(assistantContent.trim());
					if (parsed.action === 'update_page' || parsed.action === 'apply_responsive_spacing') {
						console.log('[Maxi AI] Coercing', parsed.action, 'to MODIFY_BLOCK for selection mode');
						const coerced = {
							action: 'MODIFY_BLOCK',
							message: parsed.message || 'Applied to selected block.',
							payload: {}
						};
						
						// Map properties from update_page to MODIFY_BLOCK payload
						if (parsed.property === 'box_shadow' || parsed.payload?.shadow) {
							coerced.payload.shadow = parsed.value || parsed.payload?.shadow;
						} else if (parsed.property === 'border_radius' || parsed.payload?.border_radius !== undefined) {
							coerced.payload.border_radius = parsed.value ?? parsed.payload?.border_radius;
						} else if (parsed.property === 'border' || parsed.payload?.border) {
							coerced.payload.border = parsed.value || parsed.payload?.border;
						} else if (parsed.property === 'padding') {
							coerced.payload.padding = parsed.value;
						} else if (parsed.preset) {
							coerced.payload.spacing_preset = parsed.preset;
						} else if (parsed.property && parsed.value !== undefined) {
							// Generic property mapping
							coerced.payload[parsed.property] = parsed.value;
						}
						
						assistantContent = JSON.stringify(coerced);
					}
				} catch (e) { /* Not JSON, continue */ }
			}

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

		// 7. PALETTE COLOR SELECTION (Color 1-8 only for icon hover/fill/stroke, custom colors not supported)
		else if (/^Color \d+$/.test(suggestion)) {
			let paletteNum = parseInt(suggestion.replace('Color ', ''));
			// Sanity check: only allow standard palette 1-8, reset anything else to 4 (highlight)
			if (paletteNum < 1 || paletteNum > 8) paletteNum = 4;

			const prevMsg = messages.findLast(m => m.colorTarget);
			if (prevMsg?.colorTarget === 'border') {
				// Don't apply immediately - ask for border style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which border style?',
					options: ['Solid Normal', 'Solid Fat', 'Dashed Normal', 'Dashed Fat', 'Dotted Normal', 'Dotted Fat'],
					borderColorChoice: paletteNum,
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
					shadowColorChoice: paletteNum,
					targetContext: prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else if (prevMsg?.colorTarget === 'icon-line-hover') {
				// Apply hover colour to icon line/stroke
				directAction = { 
					action: 'update_page', 
					property: 'svg_line_color_hover', 
					value: paletteNum, 
					target_block: 'svg-icon',
					message: `Applied Colour ${paletteNum} as icon line hover colour.` 
				};
			} else if (prevMsg?.colorTarget === 'icon-hover') {
				// Apply hover colour to icon fill
				directAction = { 
					action: 'update_page', 
					property: 'svg_fill_color_hover', 
					value: paletteNum, 
					target_block: 'svg-icon',
					message: `Applied Colour ${paletteNum} as icon fill hover colour.` 
				};
			} else {
				const property = prevMsg?.colorTarget === 'stroke' ? 'svg_line_color' : 'svg_fill_color';
				directAction = { 
					action: 'update_page', 
					property, 
					value: paletteNum, 
					target_block: 'svg-icon',
					message: `Applied Colour ${paletteNum} to icons.` 
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
			directAction = {
				action: 'update_page',
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
				directAction = {
				action: 'update_page',
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
				const oldAction = directAction;
				directAction = {
					action: 'MODIFY_BLOCK',
					message: oldAction.message.replace('all', 'selected').replace('all images', 'selected block'),
					payload: {}
				};

				// Map property/value to payload
				if (oldAction.action === 'apply_responsive_spacing') {
					// Spacing preset
					directAction.payload.spacing_preset = oldAction.preset;
				} else {
					// Standard property mapping
					if (oldAction.property === 'box_shadow') directAction.payload.shadow = oldAction.value;
					else if (oldAction.property === 'border_radius') directAction.payload.border_radius = oldAction.value;
					else if (oldAction.property === 'border') directAction.payload.border = oldAction.value;
					else if (oldAction.property === 'background_color') directAction.payload.background_color = oldAction.value;
				}
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
