/**
 * Button Logic Handler for AI Chat Panel
 * Extracts button-specific natural language patterns and update logic.
 */

export const BUTTON_PATTERNS = [
	// ============================================================
	// GROUP 1: PRIORITY FLOWS (Multi-step interactions - MUST come first!)
	// ============================================================

	// 1. RADIUS / SHAPE FLOW (The "Round" Trap)
	// Catches shape-related requests before the outline flow can grab "border"
	{ 
		regex: /round|curve|curved|radius|soft.*corner|pill|capsule|oval|circle|rounded/i, 
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
	{ regex: /small|tiny|compact|mini|smaller|minute|micro/i, property: 'button_size', value: 'small', selectionMsg: 'Made smaller.', pageMsg: 'Decreased button size.', target: 'button' },
	
	// Large size (with extra synonyms)
	{ regex: /large|big|huge|giant|massive|enormous|gigantic|bigger/i, property: 'button_size', value: 'large', selectionMsg: 'Made larger.', pageMsg: 'Increased button size.', target: 'button' },
	
	// Padding increase
	{ regex: /fatter|taller|increase.*padding|more.*padding|bigger.*button/i, property: 'button_padding_increase', value: 'increase', selectionMsg: 'Increased padding.', pageMsg: 'Added padding.', target: 'button' },
	
	// Padding decrease
	{ regex: /thinner|shorter|decrease.*padding|less.*padding|smaller.*button/i, property: 'button_padding_decrease', value: 'decrease', selectionMsg: 'Decreased padding.', pageMsg: 'Reduced padding.', target: 'button' },

	// Font size shortcuts (maps to button size)
	{ regex: /larger.*text|bigger.*text|increase.*font/i, property: 'button_size', value: 'large', selectionMsg: 'Increased text size.', pageMsg: 'Made text larger.', target: 'button' },
	{ regex: /smaller.*text|decrease.*font/i, property: 'button_size', value: 'small', selectionMsg: 'Decreased text size.', pageMsg: 'Made text smaller.', target: 'button' },

	// ============================================================
	// GROUP 4: ICONS
	// ============================================================

	// Icon-only mode
	{ regex: /icon.*only|remove.*text|hide.*text/i, property: 'button_icon', value: 'only', selectionMsg: 'Icon only mode.', pageMsg: 'Switched to icon-only.', target: 'button' },
	
	// Remove icon
	{ regex: /no.*icon|remove.*icon|text.*only|hide.*icon/i, property: 'button_icon', value: 'none', selectionMsg: 'Removed icon.', pageMsg: 'Removed icon.', target: 'button' },
	
	// Add icon
	{ regex: /add.*icon|put.*icon|with.*icon/i, property: 'button_icon_add', value: 'arrow-right', selectionMsg: 'Added icon.', pageMsg: 'Added default icon.', target: 'button' },

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
	{ regex: /space.*icon.*text|gap.*icon|more.*space.*icon/i, property: 'icon_spacing', value: 10, selectionMsg: 'Increased icon spacing.', pageMsg: 'Added space between icon and text.', target: 'button' },
	{ regex: /remove.*space.*icon|less.*gap.*icon|no.*space.*icon|closer.*icon/i, property: 'icon_spacing', value: 2, selectionMsg: 'Decreased icon spacing.', pageMsg: 'Reduced space between icon and text.', target: 'button' },
	{ regex: /white.*icon|light.*icon/i, property: 'icon_color', value: '#ffffff', selectionMsg: 'Icon coloured white.', pageMsg: 'Changed icon colour to white.', target: 'button' },
	{ regex: /icon.*colou?r/i, property: 'icon_color', value: 'use_prompt', selectionMsg: 'Icon colour updated.', pageMsg: 'Changed icon colour.', target: 'button' },

	// ============================================================
	// GROUP 5: TYPOGRAPHY
	// ============================================================

	{ regex: /uppercase|caps|capitali[sz]e/i, property: 'button_transform', value: 'uppercase', selectionMsg: 'Uppercase applied.', pageMsg: 'Text transformed to uppercase.', target: 'button' },
	{ regex: /lowercase/i, property: 'button_transform', value: 'lowercase', selectionMsg: 'Lowercase applied.', pageMsg: 'Text transformed to lowercase.', target: 'button' },
	{ regex: /italic/i, property: 'button_font_style', value: 'italic', selectionMsg: 'Italic style applied.', pageMsg: 'Text set to italic.', target: 'button' },
	{ regex: /bold|strong|heavy/i, property: 'button_weight', value: 700, selectionMsg: 'Bold applied.', pageMsg: 'Font weight set to bold.', target: 'button' },
	{ regex: /underline|underlined/i, property: 'button_decoration', value: 'underline', selectionMsg: 'Underlined text.', pageMsg: 'Added underline to text.', target: 'button' },
	{ regex: /strikethrough|strike.*text|line.*through/i, property: 'button_decoration', value: 'line-through', selectionMsg: 'Strikethrough applied.', pageMsg: 'Text struck through.', target: 'button' },

	// ============================================================
	// GROUP 6: STYLING
	// ============================================================

	{ regex: /transparent.*background|clear.*background/i, property: 'button_bg_color', value: 'transparent', selectionMsg: 'Made background transparent.', pageMsg: 'Backgrounds made transparent.', target: 'button' },
	{ regex: /gradient/i, property: 'button_gradient', value: true, selectionMsg: 'Applied gradient.', pageMsg: 'Applied gradient.', target: 'button' },
	{ regex: /grey.*border|gray.*border/i, property: 'button_border', value: '1px solid grey', selectionMsg: 'Added grey border.', pageMsg: 'Added grey border.', target: 'button' },
	{ regex: /shadow.*grey|shadow.*gray/i, property: 'button_shadow_color', value: 'grey', selectionMsg: 'Set shadow to grey.', pageMsg: 'Set shadow to grey.', target: 'button' },

	// ============================================================
	// GROUP 7: HOVER & ACTIVE STATES
	// ============================================================

	{ regex: /hover.*(colou?r|background|bg).*(red|blue|green|yellow|black|white|purple|pink|orange)/i, property: 'button_hover_bg', value: 'use_prompt', selectionMsg: 'Hover background set.', pageMsg: 'Updated hover background colour.', target: 'button' },
	{ regex: /hover.*(red|blue|green|yellow|black|white|purple|pink|orange)/i, property: 'button_hover_bg', value: 'use_prompt', selectionMsg: 'Hover background set.', pageMsg: 'Updated hover background colour.', target: 'button' },
	{ regex: /hover.*text.*(red|blue|green|yellow|white|black)/i, property: 'button_hover_text', value: 'use_prompt', selectionMsg: 'Hover text colour set.', pageMsg: 'Updated hover text colour.', target: 'button' },
	{ regex: /active.*state|on\s*click.*colou?r|active.*colou?r|active.*background/i, property: 'button_active_bg', value: 'use_prompt', selectionMsg: 'Active state updated.', pageMsg: 'Changed active/pressed style.', target: 'button' },

	// ============================================================
	// GROUP 8: RESPONSIVE DESIGN
	// ============================================================

	{ regex: /full.*(mobile|phone)|mobile.*full/i, property: 'button_responsive_width', value: { device: 'mobile', width: '100%' }, selectionMsg: 'Full width on mobile.', pageMsg: 'Set to full width on mobile.', target: 'button' },
	{ regex: /hide.*mobile|no.*mobile/i, property: 'button_responsive_hide', value: 'mobile', selectionMsg: 'Hidden on mobile.', pageMsg: 'Button hidden on mobile.', target: 'button' },
	{ regex: /hide.*tablet/i, property: 'button_responsive_hide', value: 'tablet', selectionMsg: 'Hidden on tablet.', pageMsg: 'Button hidden on tablets.', target: 'button' },
	{ regex: /hide.*(desktop|computer|pc)|desktop.*only/i, property: 'button_responsive_hide', value: 'desktop', selectionMsg: 'Hidden on desktop.', pageMsg: 'Button hidden on desktop.', target: 'button' },

	// ============================================================
	// GROUP 9: CONTENT & LINKS
	// ============================================================

	{ regex: /change.*text|set.*text|set.*label|rename.*button/i, property: 'button_text', value: 'use_prompt', selectionMsg: 'Updated text.', pageMsg: 'Button text updated.', target: 'button' },
	{ regex: /change.*link|update.*url|set.*link|link.*to/i, property: 'button_url', value: 'use_prompt', selectionMsg: 'Updated link.', pageMsg: 'Button link updated.', target: 'button' },
	{ regex: /open.*new.*(tab|window)/i, property: 'link_target', value: '_blank', selectionMsg: 'Opens in new tab.', pageMsg: 'Configured to open in new tab.', target: 'button' },
	{ regex: /nofollow/i, property: 'link_rel', value: 'nofollow', selectionMsg: 'Set to nofollow.', pageMsg: 'Added rel="nofollow" to link.', target: 'button' },
	{ regex: /download|pdf/i, property: 'button_custom_text_link', value: 'Download', selectionMsg: 'Changed to download button.', pageMsg: 'Button set as download link.', target: 'button' },

	// ============================================================
	// GROUP 10: DYNAMIC CONTENT BINDING
	// ============================================================

	{ regex: /dynamic.*title|bind.*title|post.*title/i, property: 'button_dynamic_text', value: 'post-title', selectionMsg: 'Bound to post title.', pageMsg: 'Button text now dynamic.', target: 'button' },
	{ regex: /dynamic.*(link|url)|bind.*url|post.*url/i, property: 'button_dynamic_link', value: 'post-url', selectionMsg: 'Bound to post URL.', pageMsg: 'Button link now dynamic.', target: 'button' },

	// ============================================================
	// GROUP 11: SLANG & JARGON (Catch-all patterns at the end)
	// ============================================================

	// "Make it pop" / "Stand out" -> triggers shadow flow for emphasis
	{ regex: /make.*pop|stand\s*out|more.*eye[-\s]*catching/i, property: 'flow_shadow', value: 'start', selectionMsg: '', pageMsg: null, target: 'button' },
	
	// High contrast / Accessibility mode
	{ regex: /high\s*contrast|accessib(le|ility)|WCAG/i, property: 'high_contrast_mode', value: true, selectionMsg: 'High contrast mode.', pageMsg: 'Applied high-contrast style.', target: 'button' },
];

export const handleButtonUpdate = (block, property, value, prefix, context = {}) => {
	let changes = null;
	// const isButton = block.name.includes('button'); // Removed duplicate
	


	const isButton = block.name.includes('button');
	
	if (!isButton) return null;

	// === INTERACTION FLOWS ===

	// 1. OUTLINE FLOW
	if (property === 'flow_outline') {
		// Step 1: Ask for Color
		if (!context.border_color) {
			return { 
				action: 'ask_palette', 
				target: 'border_color', 
				msg: 'Which colour for the border?' 
			};
		}
		// Step 2: Ask for Style
		if (!context.border_style) {
			return {
				action: 'ask_options',
				target: 'border_style',
				msg: 'Which border style?',
				options: [
					{ label: 'Solid Thin', value: 'solid-1px' },
					{ label: 'Solid Medium', value: 'solid-2px' },
					{ label: 'Solid Fat', value: 'solid-4px' },
					{ label: 'Dashed', value: 'dashed-2px' },
					{ label: 'Dotted', value: 'dotted-2px' }
				]
			};
		}

		// Final Action: Apply Changes
		console.log('[Maxi AI Button Handler] flow_outline APPLY STEP');
		console.log('[Maxi AI Button Handler] context.border_style:', context.border_style);
		console.log('[Maxi AI Button Handler] context.border_color:', context.border_color);
		
		const style = context.border_style.split('-')[0];
		const width = parseInt(context.border_style.split('-')[1].replace('px', ''), 10); // Must be number, not string!
		const color = context.border_color;
		
		console.log('[Maxi AI Button Handler] Parsed - style:', style, 'width:', width, 'typeof width:', typeof width, 'color:', color);
		
		// Correct Palette Index Detection
		const isPalette = typeof color === 'number';
		
		// Build color attributes for general AND all breakpoints
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		
		// Start with base changes
		changes = {
			[`${prefix}background-active-media-general`]: 'none', // Removed background
			[`${prefix}background-color-general`]: 'transparent',
			[`${prefix}background-palette-status-general`]: false,
			
			// Fix: Add Hover/Active state for Outlined Buttons so they don't look broken
			[`${prefix}background-hover-mode`]: 'color',
			[`${prefix}background-palette-status-hover`]: false,
			[`${prefix}background-color-hover`]: 'transparent',
			
			[`${prefix}background-active-mode`]: 'color',
			[`${prefix}background-palette-status-active`]: false,
			[`${prefix}background-color-active`]: 'transparent',
		};
		
		// Apply border style and width to ALL breakpoints to override any existing values
		breakpoints.forEach(bp => {
			changes[`${prefix}border-style-${bp}`] = style;
			changes[`${prefix}border-top-width-${bp}`] = width;
			changes[`${prefix}border-bottom-width-${bp}`] = width;
			changes[`${prefix}border-left-width-${bp}`] = width;
			changes[`${prefix}border-right-width-${bp}`] = width;
			changes[`${prefix}border-sync-width-${bp}`] = 'all';
			changes[`${prefix}border-unit-width-${bp}`] = 'px';
			
			// Apply color to ALL breakpoints
			if (isPalette) {
				changes[`${prefix}border-palette-status-${bp}`] = true;
				changes[`${prefix}border-palette-color-${bp}`] = color;
			} else {
				changes[`${prefix}border-color-${bp}`] = color;
				changes[`${prefix}border-palette-status-${bp}`] = false;
			}
		});
		
		console.log('[Maxi AI Button Handler] Final changes:', JSON.stringify(changes, null, 2));
		return { action: 'apply', attributes: changes, done: true };
	}

	// 2. SHADOW FLOW
	if (property === 'flow_shadow') {
		// Step 1: Ask for Color
		if (!context.shadow_color) {
			return { 
				action: 'ask_palette', 
				target: 'shadow_color', 
				msg: 'Which colour for the shadow?' 
			};
		}
		// Step 2: Ask for Intensity
		if (!context.shadow_intensity) {
			return {
				action: 'ask_options',
				target: 'shadow_intensity',
				msg: 'Choose intensity:',
				options: [
					{ label: 'Soft', value: 'soft' },
					{ label: 'Crisp', value: 'crisp' },
					{ label: 'Bold', value: 'bold' },
					{ label: 'Glow', value: 'glow' }
				]
			};
		}

		// Final Action: Apply Changes
		const color = context.shadow_color;
		const intensity = context.shadow_intensity;
		
		let x = 0, y = 4, blur = 10, spread = 0;
		if (intensity === 'soft') { x=0; y=4; blur=12; spread=0; }
		if (intensity === 'crisp') { x=0; y=2; blur=4; spread=0; }
		if (intensity === 'bold') { x=4; y=4; blur=0; spread=0; }
		if (intensity === 'glow') { x=0; y=0; blur=15; spread=2; }

		// Construct Shadow Object
		const baseShadow = {
			[`${prefix}box-shadow-status-general`]: true,
			[`${prefix}box-shadow-horizontal-general`]: x,
			[`${prefix}box-shadow-vertical-general`]: y,
			[`${prefix}box-shadow-blur-general`]: blur,
			[`${prefix}box-shadow-spread-general`]: spread,
			[`${prefix}box-shadow-inset-general`]: false,
		};
		
		const colorAttr = typeof color === 'number'
			? { [`${prefix}box-shadow-palette-status-general`]: true, [`${prefix}box-shadow-palette-color-general`]: color }
			: { [`${prefix}box-shadow-color-general`]: color, [`${prefix}box-shadow-palette-status-general`]: false };

		changes = { ...baseShadow, ...colorAttr };
		return changes;
	}

	// 3. RADIUS FLOW
	if (property === 'flow_radius') {
		// Step 1: Ask for Shape
		if (context.radius_value === undefined) {
			return {
				action: 'ask_options',
				target: 'radius_value',
				msg: 'Choose corner style:',
				options: [
					{ label: 'Sharp', value: 0 },
					{ label: 'Soft (5px)', value: 5 },
					{ label: 'Rounded (15px)', value: 15 },
					{ label: 'Pill (50px)', value: 50 },
					{ label: 'Circle', value: 999 } // Special case handling? Use pill logic mainly
				]
			};
		}
		
		// Final Action
		const r = context.radius_value;
		changes = {
			[`${prefix}border-top-left-radius-general`]: r,
			[`${prefix}border-top-right-radius-general`]: r,
			[`${prefix}border-bottom-right-radius-general`]: r,
			[`${prefix}border-bottom-left-radius-general`]: r,
			[`${prefix}border-sync-radius-general`]: 'all',
			[`${prefix}border-unit-radius-general`]: (r === 999) ? '%' : 'px', // Use % for true circle 
		};
		if (r === 999) {
			// For circle/pill consistency
			changes[`${prefix}border-top-left-radius-general`] = 50;
			changes[`${prefix}border-top-right-radius-general`] = 50;
			changes[`${prefix}border-bottom-right-radius-general`] = 50;
			changes[`${prefix}border-bottom-left-radius-general`] = 50;
		}

		return changes;
	}


	// === STANDARD ACTIONS ===
	
	switch (property) {
		case 'button_style':
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
				changes = { 'icon-only': false, 'icon-content': '' }; // Removing content effectively removes icon
			}
			break;

		case 'button_size':
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
			// Placeholder logic from original file
			changes = { buttonContent: 'Click Me' };
			break;

		case 'button_url':
			changes = {
				linkSettings: {
					...block.attributes.linkSettings,
					url: 'https://example.com' // Placeholder
				}
			};
			break;

		case 'link_target':
			changes = {
				linkSettings: {
					...block.attributes.linkSettings,
					opensInNewTab: value === '_blank'
				}
			};
			break;

		case 'link_rel':
			changes = {
				linkSettings: {
					...block.attributes.linkSettings,
					noFollow: value === 'nofollow'
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

		case 'icon_position':
			changes = { 'icon-position': value };
			break;

		case 'icon_size':
			changes = { 'icon-width-general': value };
			break;

		case 'button_icon_change':
			changes = { 'icon-content': value };
			break;

		case 'icon_spacing':
			changes = { 'icon-spacing-general': value };
			break;

		case 'icon_color':
			changes = { 'icon-color': value };
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
				[`${prefix}border-top-width-general`]: '1',
				[`${prefix}border-bottom-width-general`]: '1',
				[`${prefix}border-left-width-general`]: '1',
				[`${prefix}border-right-width-general`]: '1',
				[`${prefix}border-color-general`]: 'grey',
				[`${prefix}border-palette-status-general`]: false
			};
			break;

		case 'button_shadow_color':
			changes = {
				[`${prefix}box-shadow-color-general`]: value,
				[`${prefix}box-shadow-palette-status-general`]: false,
				[`${prefix}box-shadow-status-general`]: true
			};
			break;

		case 'button_transform':
			changes = { [`${prefix}text-transform-general`]: value };
			break;

		case 'button_decoration':
			changes = { [`${prefix}text-decoration-general`]: value };
			break;

		case 'button_weight':
			changes = { [`${prefix}font-weight-general`]: value };
			break;

		case 'button_responsive_width':
			{
				const { device, width } = value;
				const suffix = device === 'mobile' ? '-xs' : '-general';
				changes = { [`${prefix}width${suffix}`]: width };
				break;
			}

		case 'button_font_style':
			changes = { [`${prefix}font-style-general`]: value };
			break;

		case 'button_responsive_hide':
			if (value === 'mobile') {
				changes = {
					[`${prefix}display-xs`]: 'none'
				};
			} else if (value === 'tablet') {
				changes = {
					[`${prefix}display-sm`]: 'none',
					[`${prefix}display-md`]: 'none'
				};
			} else if (value === 'desktop') {
				changes = {
					[`${prefix}display-l`]: 'none',
					[`${prefix}display-xl`]: 'none'
				};
			}
			break;

		case 'button_active_bg':
			changes = {
				[`${prefix}background-color-active`]: value,
				[`${prefix}background-palette-status-active`]: false,
				[`${prefix}state-active`]: true
			};
			break;

		case 'high_contrast_mode':
			// Apply high contrast accessible styling (dark bg, white text)
			changes = {
				[`${prefix}background-active-media-general`]: 'color',
				[`${prefix}background-color-general`]: '#000000',
				[`${prefix}background-palette-status-general`]: false,
				[`${prefix}color-general`]: '#ffffff',
				[`${prefix}palette-status-general`]: false,
				[`${prefix}border-style-general`]: 'solid',
				[`${prefix}border-top-width-general`]: '2',
				[`${prefix}border-bottom-width-general`]: '2',
				[`${prefix}border-left-width-general`]: '2',
				[`${prefix}border-right-width-general`]: '2',
				[`${prefix}border-color-general`]: '#ffffff',
				[`${prefix}border-palette-status-general`]: false
			};
			break;

		case 'button_hover_bg':
			changes = {
				[`${prefix}background-color-hover`]: value,
				[`${prefix}background-palette-status-hover`]: false,
				[`${prefix}state-hover`]: true
			};
			break;

		case 'button_hover_text':
			changes = {
				[`${prefix}color-hover`]: value,
				[`${prefix}palette-status-hover`]: false
			};
			break;

		case 'button_dynamic_text':
			changes = {
				'dc-status': true,
				'dc-field': value
			};
			break;

		case 'button_dynamic_link':
			changes = {
				'dc-link-status': true,
				'dc-link-field': value
			};
			break;
	}

	return changes;
};
// Helper to get prefix (duplicated from index.js but needed for self-containment)
const getBlockPrefix = (blockName) => {
	if (!blockName) return '';
	if (blockName.includes('button-maxi')) return 'button-';
	if (blockName.includes('image-maxi')) return 'image-';
	if (blockName.includes('icon-maxi')) return 'icon-';
	return '';
};
