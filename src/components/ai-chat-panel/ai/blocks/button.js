/**
 * Button Logic Handler for AI Chat Panel
 * Extracts button-specific natural language patterns and update logic.
 */

import { SHARED_FLOWS, BUTTON_RADIUS_PRESETS, SHADOW_PRESETS_BUTTON } from '../flows/flowConfig';
import { runFlow } from '../flows/flowEngine';

/**
 * Flow configuration for the Button block.
 * Button uses 'all' breakpoints for border, button-specific radius presets,
 * button-specific shadow presets, plus hover/active/icon colour flows.
 */
export const BUTTON_FLOW_CONFIG = {
	border: { ...SHARED_FLOWS.border, breakpointStrategy: 'active' },
	radius: { ...SHARED_FLOWS.radius, radiusPresets: BUTTON_RADIUS_PRESETS },
	shadow: { ...SHARED_FLOWS.shadow, shadowPresets: SHADOW_PRESETS_BUTTON },
	hover_bg: { ...SHARED_FLOWS.hover_bg },
	hover_text: { ...SHARED_FLOWS.hover_text },
	active_bg: { ...SHARED_FLOWS.active_bg },
	icon_color: { ...SHARED_FLOWS.icon_color },
};

export const BUTTON_PATTERNS = [
	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Multi-step interactions - MUST come first!)
	// ============================================================

	// 1. RADIUS / SHAPE FLOW (The "Round" Trap)
	// Catches shape-related requests before the outline flow can grab "border".
	// Excludes messages that also mention border/outline/stroke/frame — those belong
	// to the border flow which pre-seeds border_radius from the shape modifier.
	{ 
		regex: /(?!.*\bicon\b)(?!.*\b(?:border|outline|stroke|frame)\b)(?:\bround(?:ed|ing|er)?\b|\bcurv(?:e|ed|ing)?\b|\bradius\b|soft.*corner|pill|capsule|oval|circle)/i, 
		property: 'flow_radius', 
		value: 'start', 
		selectionMsg: '', 
		pageMsg: null, 
		target: 'button' 
	},

	// 2. OUTLINE / BORDER FLOW
	// Catches "outline", "border", etc. - asks for colour and style before applying
	{ 
		regex: /outline|border|stroke|frame|ghost|transparent.*bg|hollow|no.*fill|no.*background|remove.*background|bordered|with.*border/i, 
		property: 'flow_outline', 
		value: 'start', 
		selectionMsg: '', 
		pageMsg: null, 
		target: 'button' 
	},

	// 3. SHADOW FLOW
	// Catches shadow/depth requests including slang terms
	{ 
		regex: /shadow|glow|lift|depth|raised|elevat(ed|e)?|3d/i, 
		property: 'flow_shadow', 
		value: 'start', 
		selectionMsg: '', 
		pageMsg: null, 
		target: 'button' 
	},

	// ============================================================
	// GROUP 2: STYLE PRESETS (Single-step styling)
	// ============================================================

	// Solid/Filled (Primary button style)
	{ regex: /solid|fill|filled|block.*style|primary\s*button|primary\s*style/i, property: 'button_style', value: 'solid', selectionMsg: 'Applied solid style.', pageMsg: 'Changed to solid style.', target: 'button' },
	
	// Outline style (Secondary button)
	{ regex: /outline\s*style|secondary\s*button|secondary\s*style/i, property: 'button_style', value: 'outline', selectionMsg: 'Applied outline style.', pageMsg: 'Changed to outline style.', target: 'button' },
	
	// Flat (Remove shadows)
	{ regex: /flat|no.*shadow|remove.*shadow|2d/i, property: 'button_style', value: 'flat', selectionMsg: 'Removed shadows.', pageMsg: 'Applied flat style.', target: 'button' },
	
	// Square corners
	{ regex: /square|sharp|remove.*radius|no.*rounding/i, property: 'border_radius', value: 0, selectionMsg: 'Squared corners.', pageMsg: 'Removed corner rounding.', target: 'button' },

	// ============================================================
	// GROUP 3: SIZE & SPACING
	// ============================================================

	// Full width
	{ regex: /full.*width|full.*size|stretch|expand|100%|fill.*container/i, property: 'width', value: '100%', selectionMsg: 'Button expanded.', pageMsg: 'Made button full width.', target: 'button' },
	
	// Auto width
	{ regex: /auto.*width|fit.*content|shrink|normal.*width/i, property: 'width', value: 'auto', selectionMsg: 'Width set to auto.', pageMsg: 'Set button width to auto.', target: 'button' },
	
	// Small size (with extra synonyms)
	{ regex: /(?!.*\bicon\b)(?:small|tiny|compact|mini|smaller|minute|micro)/i, property: 'button_size', value: 'small', selectionMsg: 'Made smaller.', pageMsg: 'Decreased button size.', target: 'button' },
	
	// Large size (with extra synonyms)
	{ regex: /(?!.*\bicon\b)(?:large|big|huge|giant|massive|enormous|gigantic|bigger)/i, property: 'button_size', value: 'large', selectionMsg: 'Made larger.', pageMsg: 'Increased button size.', target: 'button' },
	
	// Padding increase
	{ regex: /fatter|taller|increase.*padding|more.*padding|bigger.*button/i, property: 'button_padding_increase', value: 'increase', selectionMsg: 'Increased padding.', pageMsg: 'Added padding.', target: 'button' },
	
	// Padding decrease
	{ regex: /thinner|shorter|decrease.*padding|less.*padding|smaller.*button/i, property: 'button_padding_decrease', value: 'decrease', selectionMsg: 'Decreased padding.', pageMsg: 'Reduced padding.', target: 'button' },

	// Font size shortcuts (maps to button size)
	{ regex: /larger.*text|bigger.*text|increase.*font/i, property: 'button_size', value: 'large', selectionMsg: 'Increased text size.', pageMsg: 'Made text larger.', target: 'button' },
	{ regex: /smaller.*text|decrease.*font/i, property: 'button_size', value: 'small', selectionMsg: 'Decreased text size.', pageMsg: 'Made text smaller.', target: 'button' },

	// ============================================================
	// GROUP 4: ALIGNMENT
	// ============================================================

	// Button text alignment
	{ regex: /(?=.*\bbutton\b)(?=.*\b(text|label)\b)(?=.*\b(align|aligned|alignment)\b)(?=.*\bleft\b)/i, property: 'text_align', value: 'left', selectionMsg: 'Aligned button text left.', pageMsg: 'Aligned button text left.', target: 'button' },
	{ regex: /(?=.*\bbutton\b)(?=.*\b(text|label)\b)(?=.*\b(align|aligned|alignment)\b)(?=.*\b(center|centre|centered|centred|middle)\b)/i, property: 'text_align', value: 'center', selectionMsg: 'Aligned button text center.', pageMsg: 'Aligned button text center.', target: 'button' },
	{ regex: /(?=.*\bbutton\b)(?=.*\b(text|label)\b)(?=.*\b(align|aligned|alignment)\b)(?=.*\bright\b)/i, property: 'text_align', value: 'right', selectionMsg: 'Aligned button text right.', pageMsg: 'Aligned button text right.', target: 'button' },
	{ regex: /(?=.*\bbutton\b)(?=.*\b(text|label)\b)(?=.*\b(justify|justified)\b)/i, property: 'text_align', value: 'justify', selectionMsg: 'Justified button text.', pageMsg: 'Justified button text.', target: 'button' },

	// Button block alignment
	{ regex: /(?=.*\bbutton\b)(?=.*\b(align|aligned|alignment)\b)(?=.*\bleft\b)(?!.*\bicon\b)/i, property: 'alignment', value: 'left', selectionMsg: 'Aligned button left.', pageMsg: 'Aligned buttons left.', target: 'button' },
	{ regex: /(?=.*\bbutton\b)(?=.*\b(align|aligned|alignment)\b)(?=.*\b(center|centre|centered|centred|middle)\b)(?!.*\bicon\b)/i, property: 'alignment', value: 'center', selectionMsg: 'Aligned button center.', pageMsg: 'Aligned buttons center.', target: 'button' },
	{ regex: /(?=.*\bbutton\b)(?=.*\b(align|aligned|alignment)\b)(?=.*\bright\b)(?!.*\bicon\b)/i, property: 'alignment', value: 'right', selectionMsg: 'Aligned button right.', pageMsg: 'Aligned buttons right.', target: 'button' },

	// ============================================================
	// GROUP 5: ICONS
	// ============================================================

	// Icon-only mode
	{ regex: /(?!.*\b(space|gap)\b)(?:icon.*only|remove.*text|hide.*text)/i, property: 'button_icon', value: 'only', selectionMsg: 'Icon only mode.', pageMsg: 'Switched to icon-only.', target: 'button' },
	
	// Remove icon
	{ regex: /(?!.*\b(space|gap)\b)(?:no.*icon|remove.*icon|text.*only|hide.*icon)/i, property: 'button_icon', value: 'none', selectionMsg: 'Removed icon.', pageMsg: 'Removed icon.', target: 'button' },
	
	// Add icon
	{ regex: /(?!.*\b(left|right|top|bottom|before|after|start|end)\b)\b(?:add|put|with|insert|include|use)\b.*\bicon\b/i, property: 'button_icon_add', value: 'arrow-right', selectionMsg: 'Added icon.', pageMsg: 'Added default icon.', target: 'button' },

	// Icon positions
	{ regex: /icon.*left|icon.*before|start.*icon/i, property: 'icon_position', value: 'left', selectionMsg: 'Icon moved left.', pageMsg: 'Moved icon to left.', target: 'button' },
	{ regex: /icon.*right|icon.*after|end.*icon/i, property: 'icon_position', value: 'right', selectionMsg: 'Icon moved right.', pageMsg: 'Moved icon to right.', target: 'button' },
	{ regex: /icon.*top|icon.*above|stacked\s*icon/i, property: 'icon_position', value: 'top', selectionMsg: 'Icon moved above text.', pageMsg: 'Moved icon to top.', target: 'button' },
	{ regex: /icon.*bottom|icon.*below/i, property: 'icon_position', value: 'bottom', selectionMsg: 'Icon moved below text.', pageMsg: 'Moved icon below text.', target: 'button' },

	// Specific icon types
	{ regex: /cart|shopping|buy/i, property: 'button_icon_change', value: 'shopping-cart', selectionMsg: 'Changed to cart icon.', pageMsg: 'Icon updated to cart.', target: 'button' },
	{ regex: /search.*icon|magnifying/i, property: 'button_icon_change', value: 'search', selectionMsg: 'Changed to search icon.', pageMsg: 'Icon updated to search.', target: 'button' },
	{ regex: /heart.*icon|favou?rite/i, property: 'button_icon_change', value: 'heart', selectionMsg: 'Changed to heart icon.', pageMsg: 'Icon updated to heart.', target: 'button' },
	{ regex: /arrow.*icon/i, property: 'button_icon_change', value: 'arrow-right', selectionMsg: 'Changed to arrow icon.', pageMsg: 'Icon updated to arrow.', target: 'button' },

	// Icon styling
	{ regex: /circle.*icon|round.*bg.*icon/i, property: 'icon_style', value: 'circle', selectionMsg: 'Circular icon style.', pageMsg: 'Applied circular icon style.', target: 'button' },
	{ regex: /icon.*size|bigger.*icon|larger.*icon/i, property: 'icon_size', value: 24, selectionMsg: 'Made icon larger.', pageMsg: 'Icon size increased.', target: 'button' },
	{ regex: /smaller.*icon/i, property: 'icon_size', value: 16, selectionMsg: 'Made icon smaller.', pageMsg: 'Icon size decreased.', target: 'button' },
	{ regex: /remove.*space.*icon|less.*gap.*icon|no.*space.*icon|closer.*icon/i, property: 'icon_spacing', value: 2, selectionMsg: 'Decreased icon spacing.', pageMsg: 'Reduced space between icon and text.', target: 'button' },
	{ regex: /(?!.*\b(remove|less|no|closer)\b)(?:space.*icon.*text|gap.*icon|more.*space.*icon)/i, property: 'icon_spacing', value: 10, selectionMsg: 'Increased icon spacing.', pageMsg: 'Added space between icon and text.', target: 'button' },
	{ regex: /white.*icon|light.*icon/i, property: 'icon_color', value: '#ffffff', selectionMsg: 'Icon coloured white.', pageMsg: 'Changed icon colour to white.', target: 'button' },
	{ regex: /icon.*colou?r/i, property: 'flow_button_icon_color', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },

	// Button text color (palette prompt)
	{ regex: /button.*text.*colou?r|button.*text.*color|text.*button.*colou?r|text.*button.*color/i, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour for the button text?', pageMsg: 'Which colour for the button text?', target: 'button', colorTarget: 'button-text' },
	// Button background color (palette prompt)
	{ regex: /button.*(background|bg).*(colou?r|color)|\b(colou?r|color)\b.*button.*(background|bg)|button.*colou?r\b|button.*color\b/i, property: 'color_clarify', value: 'show_palette', selectionMsg: 'Which colour for the button background?', pageMsg: 'Which colour for the button background?', target: 'button', colorTarget: 'button-background' },

	// ============================================================
	// GROUP 6: TYPOGRAPHY
	// ============================================================

	{ regex: /uppercase|caps|capitali[sz]e/i, property: 'button_transform', value: 'uppercase', selectionMsg: 'Uppercase applied.', pageMsg: 'Text transformed to uppercase.', target: 'button' },
	{ regex: /lowercase/i, property: 'button_transform', value: 'lowercase', selectionMsg: 'Lowercase applied.', pageMsg: 'Text transformed to lowercase.', target: 'button' },
	{ regex: /italic/i, property: 'button_font_style', value: 'italic', selectionMsg: 'Italic style applied.', pageMsg: 'Text set to italic.', target: 'button' },
	{ regex: /bold|strong|heavy/i, property: 'button_weight', value: 700, selectionMsg: 'Bold applied.', pageMsg: 'Font weight set to bold.', target: 'button' },
	{ regex: /underline|underlined/i, property: 'button_decoration', value: 'underline', selectionMsg: 'Underlined text.', pageMsg: 'Added underline to text.', target: 'button' },
	{ regex: /strikethrough|strike.*text|line.*through/i, property: 'button_decoration', value: 'line-through', selectionMsg: 'Strikethrough applied.', pageMsg: 'Text struck through.', target: 'button' },

	// ============================================================
	// GROUP 7: STYLING
	// ============================================================

	{ regex: /transparent.*background|clear.*background/i, property: 'button_bg_color', value: 'transparent', selectionMsg: 'Made background transparent.', pageMsg: 'Backgrounds made transparent.', target: 'button' },
	{ regex: /gradient/i, property: 'button_gradient', value: true, selectionMsg: 'Applied gradient.', pageMsg: 'Applied gradient.', target: 'button' },
	{ regex: /grey.*border|gray.*border/i, property: 'button_border', value: '1px solid grey', selectionMsg: 'Added grey border.', pageMsg: 'Added grey border.', target: 'button' },
	{ regex: /shadow.*grey|shadow.*gray/i, property: 'button_shadow_color', value: 'grey', selectionMsg: 'Set shadow to grey.', pageMsg: 'Set shadow to grey.', target: 'button' },

	// ============================================================
	// GROUP 8: HOVER & ACTIVE STATES
	// ============================================================

	{ regex: /hover.*(colou?r|background|bg).*(red|blue|green|yellow|black|white|purple|pink|orange)/i, property: 'flow_button_hover_bg', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },
	{ regex: /hover.*(red|blue|green|yellow|black|white|purple|pink|orange)/i, property: 'flow_button_hover_bg', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },
	{ regex: /hover.*text.*(red|blue|green|yellow|white|black)/i, property: 'flow_button_hover_text', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },
	{ regex: /active.*state|on\s*click.*colou?r|active.*colou?r|active.*background/i, property: 'flow_button_active_bg', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },

	// ============================================================
	// GROUP 9: RESPONSIVE DESIGN
	// ============================================================

	{ regex: /full.*(mobile|phone)|mobile.*full/i, property: 'button_responsive_width', value: { device: 'mobile', width: '100%' }, selectionMsg: 'Full width on mobile.', pageMsg: 'Set to full width on mobile.', target: 'button' },
	{ regex: /hide.*mobile|no.*mobile/i, property: 'button_responsive_hide', value: 'mobile', selectionMsg: 'Hidden on mobile.', pageMsg: 'Button hidden on mobile.', target: 'button' },
	{ regex: /hide.*tablet/i, property: 'button_responsive_hide', value: 'tablet', selectionMsg: 'Hidden on tablet.', pageMsg: 'Button hidden on tablets.', target: 'button' },
	{ regex: /hide.*(desktop|computer|pc)/i, property: 'button_responsive_hide', value: 'desktop', selectionMsg: 'Hidden on desktop.', pageMsg: 'Button hidden on desktop.', target: 'button' },
	{ regex: /(desktop.*only|only.*desktop)/i, property: 'button_responsive_only', value: 'desktop', selectionMsg: 'Desktop only.', pageMsg: 'Button shown only on desktop.', target: 'button' },
	{ regex: /((mobile|phone).*\bonly\b|\bonly\b.*(mobile|phone))/i, property: 'button_responsive_only', value: 'mobile', selectionMsg: 'Mobile only.', pageMsg: 'Button shown only on mobile.', target: 'button' },
	{ regex: /(tablet.*only|only.*tablet)/i, property: 'button_responsive_only', value: 'tablet', selectionMsg: 'Tablet only.', pageMsg: 'Button shown only on tablet.', target: 'button' },

	// ============================================================
	// GROUP 10: CONTENT & LINKS
	// ============================================================

	{ regex: /change.*text|set.*text|set.*label|set.*content|rename.*button|button\s*(?:text|label|copy|content)\b|(?:text|label|copy|content)\s*(?:for|on)?\s*button|cta\s*(?:text|label|content)|call\s*to\s*action/i, property: 'button_text', value: 'use_prompt', selectionMsg: 'Updated text.', pageMsg: 'Button text updated.', target: 'button' },
	{ regex: /change.*link|update.*url|set.*link|link.*to/i, property: 'button_url', value: 'use_prompt', selectionMsg: 'Updated link.', pageMsg: 'Button link updated.', target: 'button' },
	{ regex: /open.*new.*(tab|window)/i, property: 'link_target', value: '_blank', selectionMsg: 'Opens in new tab.', pageMsg: 'Configured to open in new tab.', target: 'button' },
	{ regex: /nofollow/i, property: 'link_rel', value: 'nofollow', selectionMsg: 'Set to nofollow.', pageMsg: 'Added rel="nofollow" to link.', target: 'button' },
	{ regex: /sponsored/i, property: 'link_rel', value: 'sponsored', selectionMsg: 'Set to sponsored.', pageMsg: 'Added rel="sponsored" to link.', target: 'button' },
	{ regex: /\bugc\b/i, property: 'link_rel', value: 'ugc', selectionMsg: 'Set to UGC.', pageMsg: 'Added rel="ugc" to link.', target: 'button' },
	{ regex: /download|pdf/i, property: 'button_custom_text_link', value: 'Download', selectionMsg: 'Changed to download button.', pageMsg: 'Button set as download link.', target: 'button' },

	// ============================================================
	// GROUP 11: DYNAMIC CONTENT BINDING
	// ============================================================

	{ regex: /dynamic.*title|bind.*title|post.*title/i, property: 'button_dynamic_text', value: 'post-title', selectionMsg: 'Bound to post title.', pageMsg: 'Button text now dynamic.', target: 'button' },
	{ regex: /dynamic.*(link|url)|bind.*url|post.*url/i, property: 'button_dynamic_link', value: 'entity', selectionMsg: 'Bound to post URL.', pageMsg: 'Button link now dynamic.', target: 'button' },

	// ============================================================
	// GROUP 12: SLANG & JARGON (Catch-all patterns at the end)
	// ============================================================

	// "Make it pop" / "Stand out" -> triggers shadow flow for emphasis
	{ regex: /make.*pop|stand\s*out|more.*eye[-\s]*catching/i, property: 'flow_shadow', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },
	
	// High contrast / Accessibility mode
	{ regex: /high\s*contrast|accessib(le|ility)|WCAG/i, property: 'high_contrast_mode', value: true, selectionMsg: 'High contrast mode.', pageMsg: 'Applied high-contrast style.', target: 'button' },
];

export const handleButtonUpdate = (block, property, value, prefix, context = {}) => {
	let changes = null;

	if (!block?.name) return null;
	const isButton = block.name.includes('button');
	
	if (!isButton) return null;

	if (property === 'alignment') {
		if (value && typeof value === 'object' && 'value' in value) {
			const targetBreakpoint = value.breakpoint || 'general';
			return { [`alignment-${targetBreakpoint}`]: value.value };
		}
		return { 'alignment-general': value };
	}

	const linkSettings = block?.attributes?.linkSettings || {};

	// Local helpers still needed by switch cases below.
	const buildIconColorChanges = (iconValue) => {
		if (iconValue === undefined || iconValue === 'use_prompt') return null;
		const colorValue = typeof iconValue === 'object' ? iconValue.color : iconValue;
		const target = typeof iconValue === 'object' && iconValue?.target === 'stroke' ? 'stroke' : 'fill';
		const prefixKey = target === 'stroke' ? 'icon-stroke' : 'icon-fill';
		const isPalette = typeof colorValue === 'number';

		if (isPalette) {
			return {
				[`${prefixKey}-palette-status`]: true,
				[`${prefixKey}-palette-color`]: colorValue,
				[`${prefixKey}-color`]: ''
			};
		}

		return {
			[`${prefixKey}-color`]: colorValue,
			[`${prefixKey}-palette-status`]: false
		};
	};

	const buildHoverBgChanges = (hoverValue) => {
		if (hoverValue === undefined) return null;
		const isPalette = typeof hoverValue === 'number';
		return {
			[`${prefix}background-status-hover`]: true,
			[`${prefix}background-active-media-general-hover`]: 'color',
			...(isPalette
				? {
					[`${prefix}background-palette-status-general-hover`]: true,
					[`${prefix}background-palette-color-general-hover`]: hoverValue,
					[`${prefix}background-color-general-hover`]: ''
				}
				: {
					[`${prefix}background-palette-status-general-hover`]: false,
					[`${prefix}background-color-general-hover`]: hoverValue
				})
		};
	};

	const buildActiveBgChanges = (activeValue) => {
		if (activeValue === undefined) return null;
		const isPalette = typeof activeValue === 'number';
		const activePrefix = `${prefix}active-`;
		return {
			[`${prefix}background-status-active`]: true,
			[`${activePrefix}background-active-media-general`]: 'color',
			...(isPalette
				? {
					[`${activePrefix}background-palette-status-general`]: true,
					[`${activePrefix}background-palette-color-general`]: activeValue,
					[`${activePrefix}background-color-general`]: ''
				}
				: {
					[`${activePrefix}background-palette-status-general`]: false,
					[`${activePrefix}background-color-general`]: activeValue
				})
		};
	};

	const buildHoverTextChanges = (hoverValue) => {
		if (hoverValue === undefined) return null;
		const isPalette = typeof hoverValue === 'number';
		return {
			'typography-status-hover': true,
			...(isPalette
				? {
					'palette-status-general-hover': true,
					'palette-color-general-hover': hoverValue,
					'color-general-hover': ''
				}
				: {
					'color-general-hover': hoverValue,
					'palette-status-general-hover': false
				})
		};
	};

	// === INTERACTION FLOWS — delegated to shared flow engine ===

	if (
		property === 'flow_outline' ||
		property === 'flow_radius' ||
		property === 'flow_shadow' ||
		property === 'flow_button_icon_color' ||
		property === 'flow_button_hover_bg' ||
		property === 'flow_button_hover_text' ||
		property === 'flow_button_active_bg'
	) {
		// Map the button-specific flow names to the canonical engine flow names.
		const FLOW_NAME_MAP = {
			flow_outline:          'border',
			flow_radius:           'radius',
			flow_shadow:           'shadow',
			flow_button_icon_color:'icon_color',
			flow_button_hover_bg:  'hover_bg',
			flow_button_hover_text:'hover_text',
			flow_button_active_bg: 'active_bg',
		};
		const flowName = FLOW_NAME_MAP[property] || property.replace('flow_', '');
		return runFlow(flowName, context, BUTTON_FLOW_CONFIG, prefix, null, 'button');
	}


	// === STANDARD ACTIONS ===
	
	switch (property) {
		case 'button_style':
			if (value === 'outline') {
				changes = {
					[`${prefix}background-active-media-general`]: 'none',
					[`${prefix}border-style-general`]: 'solid',
					[`${prefix}border-top-width-general`]: 2,
					[`${prefix}border-bottom-width-general`]: 2,
					[`${prefix}border-left-width-general`]: 2,
					[`${prefix}border-right-width-general`]: 2,
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
			break;

		case 'border_radius':
			changes = {
				[`${prefix}border-top-left-radius-general`]: value,
				[`${prefix}border-top-right-radius-general`]: value,
				[`${prefix}border-bottom-right-radius-general`]: value,
				[`${prefix}border-bottom-left-radius-general`]: value,
				[`${prefix}border-sync-radius-general`]: 'all',
				[`${prefix}border-unit-radius-general`]: 'px',
			};
			break;

		case 'button_icon':
			if (value === 'only') {
				changes = { 'icon-only': true };
			} else if (value === 'none') {
				changes = {
					'icon-only': false,
					'icon-content': '',
					'icon-content-hover': '',
					'icon-status-hover': false,
				}; // Removing content effectively removes icon
			}
			break;

		case 'button_size':
			if (value === 'small') {
				changes = {
					[`${prefix}padding-top-general`]: '8',
					[`${prefix}padding-bottom-general`]: '8',
					[`${prefix}padding-left-general`]: '16',
					[`${prefix}padding-right-general`]: '16',
					'font-size-general': 14,
				};
			} else if (value === 'large') {
				changes = {
					[`${prefix}padding-top-general`]: '20',
					[`${prefix}padding-bottom-general`]: '20',
					[`${prefix}padding-left-general`]: '40',
					[`${prefix}padding-right-general`]: '40',
					'font-size-general': 20,
				};
			}
			break;

		case 'width':
			if (value === '100%') {
				changes = {
					[`${prefix}width-general`]: '100',
					[`${prefix}width-unit-general`]: '%',
					[`${prefix}width-fit-content-general`]: false,
				};
			} else if (value === 'auto') {
				changes = {
					[`${prefix}width-fit-content-general`]: true,
				};
			}
			break;

		case 'button_padding_increase':
			changes = {
				[`${prefix}padding-top-general`]: '15',
				[`${prefix}padding-bottom-general`]: '15',
				[`${prefix}padding-left-general`]: '30',
				[`${prefix}padding-right-general`]: '30',
				[`${prefix}padding-sync-general`]: 'none',
			};
			break;

		case 'button_padding_decrease':
			changes = {
				[`${prefix}padding-top-general`]: '8',
				[`${prefix}padding-bottom-general`]: '8',
				[`${prefix}padding-left-general`]: '16',
				[`${prefix}padding-right-general`]: '16',
				[`${prefix}padding-sync-general`]: 'none',
			};
			break;

		case 'button_text':
			if (value !== undefined) {
				changes = { buttonContent: String(value) };
			}
			break;

		case 'button_url':
			if (value) {
				changes = {
					linkSettings: {
						...linkSettings,
						url: String(value)
					}
				};
			}
			break;

		case 'link_target':
			changes = {
				linkSettings: {
					...linkSettings,
					opensInNewTab: value === '_blank'
				}
			};
			break;

		case 'link_rel':
			changes = {
				linkSettings: {
					...linkSettings,
					...(value === 'nofollow' ? { noFollow: true } : {}),
					...(value === 'sponsored' ? { sponsored: true } : {}),
					...(value === 'ugc' ? { ugc: true } : {})
				}
			};
			break;

		case 'button_custom_text_link':
			changes = {
				buttonContent: value,
			};
			break;

		case 'button_icon_add':
			changes = {
				'icon-content': value,
				'icon-only': false
			};
			break;

		case 'button_icon_svg': {
			const rawSvg = typeof value === 'string' ? value : value?.svgCode;
			const nextSvgType = typeof value === 'object' ? value?.svgType : null;
			if (rawSvg) {
				changes = {
					'icon-content': rawSvg,
					'icon-only': false,
					...(nextSvgType ? { svgType: nextSvgType } : {}),
				};
			}
			break;
		}

		case 'icon_position':
			changes = { 'icon-position': value };
			break;

		case 'icon_size':
			changes = { 'icon-width-general': value, 'icon-height-general': value };
			break;

		case 'button_icon_change':
			changes = { 'icon-content': value };
			break;

		case 'icon_spacing':
			changes = { 'icon-spacing-general': value };
			break;

		case 'icon_color':
			changes = buildIconColorChanges(value);
			break;

		case 'icon_style':
			if (value === 'circle') {
				changes = {
					'icon-border-top-left-radius-general': 50,
					'icon-border-top-right-radius-general': 50,
					'icon-border-bottom-right-radius-general': 50,
					'icon-border-bottom-left-radius-general': 50,
					'icon-border-sync-radius-general': 'all',
					'icon-border-unit-radius-general': '%',
					'icon-padding-top-general': '10',
					'icon-padding-right-general': '10',
					'icon-padding-bottom-general': '10',
					'icon-padding-left-general': '10',
					'icon-padding-sync-general': 'all',
				};
			}
			break;

		case 'button_bg_color':
			if (value === 'transparent') {
				changes = {
					[`${prefix}background-color-general`]: 'transparent',
					[`${prefix}background-palette-status-general`]: false
				};
			} else {
				changes = {
					[`${prefix}background-color-general`]: value,
					[`${prefix}background-palette-status-general`]: false
				};
			}
			break;

		case 'button_gradient':
			changes = {
				[`${prefix}background-active-media-general`]: 'gradient',
			};
			break;

		case 'button_border':
			changes = {
				[`${prefix}border-style-general`]: 'solid',
				[`${prefix}border-top-width-general`]: 1,
				[`${prefix}border-bottom-width-general`]: 1,
				[`${prefix}border-left-width-general`]: 1,
				[`${prefix}border-right-width-general`]: 1,
				[`${prefix}border-color-general`]: 'grey',
				[`${prefix}border-palette-status-general`]: false
			};
			break;

		case 'button_shadow_color':
			if (value !== undefined) {
				const isPalette = typeof value === 'number';
				changes = {
					[`${prefix}box-shadow-status-general`]: true,
					...(isPalette
						? {
							[`${prefix}box-shadow-palette-status-general`]: true,
							[`${prefix}box-shadow-palette-color-general`]: value
						}
						: {
							[`${prefix}box-shadow-color-general`]: value,
							[`${prefix}box-shadow-palette-status-general`]: false
						})
				};
			}
			break;

		case 'button_transform':
			changes = { 'text-transform-general': value };
			break;

		case 'button_decoration':
			changes = { 'text-decoration-general': value };
			break;

		case 'button_weight':
			changes = { 'font-weight-general': value };
			break;

		case 'button_responsive_width':
			{
				if (!value || typeof value !== 'object') {
					break;
				}
				const { device, width } = value;
				const suffix = device === 'mobile' ? '-xs' : '-general';
				const rawWidth = String(width ?? '').trim().toLowerCase();

				if (rawWidth === 'auto' || rawWidth === 'fit-content' || rawWidth === 'fit content') {
					changes = { [`${prefix}width-fit-content${suffix}`]: true };
					break;
				}

				const match = rawWidth.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem)?$/i);
				const numeric = match ? Number(match[1]) : Number.parseFloat(rawWidth);
				const unit = match?.[2] || (rawWidth.includes('%') ? '%' : 'px');
				const safeValue = Number.isNaN(numeric) ? 0 : numeric;

				changes = {
					[`${prefix}width${suffix}`]: String(safeValue),
					[`${prefix}width-unit${suffix}`]: unit,
					[`${prefix}width-fit-content${suffix}`]: false,
				};
				break;
			}

		case 'button_font_style':
			changes = { 'font-style-general': value };
			break;

		case 'button_responsive_hide':
			if (value === 'mobile') {
				changes = {
					[`${prefix}display-xs`]: 'none'
				};
			} else if (value === 'tablet') {
				changes = {
					[`${prefix}display-s`]: 'none',
					[`${prefix}display-m`]: 'none'
				};
			} else if (value === 'desktop') {
				changes = {
					[`${prefix}display-l`]: 'none',
					[`${prefix}display-xl`]: 'none',
					[`${prefix}display-xxl`]: 'none'
				};
			}
			break;

		case 'button_responsive_only':
			if (value === 'mobile') {
				changes = {
					[`${prefix}display-s`]: 'none',
					[`${prefix}display-m`]: 'none',
					[`${prefix}display-l`]: 'none',
					[`${prefix}display-xl`]: 'none',
					[`${prefix}display-xxl`]: 'none'
				};
			} else if (value === 'tablet') {
				changes = {
					[`${prefix}display-xs`]: 'none',
					[`${prefix}display-l`]: 'none',
					[`${prefix}display-xl`]: 'none',
					[`${prefix}display-xxl`]: 'none'
				};
			} else if (value === 'desktop') {
				changes = {
					[`${prefix}display-xs`]: 'none',
					[`${prefix}display-s`]: 'none',
					[`${prefix}display-m`]: 'none'
				};
			}
			break;

		case 'button_active_bg':
			changes = buildActiveBgChanges(value);
			break;

		case 'high_contrast_mode':
			// Apply high contrast accessible styling (dark bg, white text)
			changes = {
				[`${prefix}background-active-media-general`]: 'color',
				[`${prefix}background-color-general`]: '#000000',
				[`${prefix}background-palette-status-general`]: false,
				'color-general': '#ffffff',
				'palette-status-general': false,
				[`${prefix}border-style-general`]: 'solid',
				[`${prefix}border-top-width-general`]: 2,
				[`${prefix}border-bottom-width-general`]: 2,
				[`${prefix}border-left-width-general`]: 2,
				[`${prefix}border-right-width-general`]: 2,
				[`${prefix}border-color-general`]: '#ffffff',
				[`${prefix}border-palette-status-general`]: false
			};
			break;

		case 'button_hover_bg':
			changes = buildHoverBgChanges(value);
			break;

		case 'button_hover_text':
			changes = buildHoverTextChanges(value);
			break;

		case 'button_dynamic_text':
			changes = {
				'dc-status': true,
				'dc-field': value
			};
			break;

		case 'button_dynamic_link':
			{
				const targetValue = (value === 'post-url' || value === 'post_url') ? 'entity' : value;
				changes = {
					'dc-link-status': true,
					'dc-link-target': targetValue
				};
			}
			break;
	}

	return changes;
};
