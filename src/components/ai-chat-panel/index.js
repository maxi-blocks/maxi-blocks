/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import './editor.scss';
import applyThemeToStyleCards from '@extensions/style-cards/applyThemeToStyleCards';
import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import { handleSetAttributes } from '@extensions/maxi-block';

const SYSTEM_PROMPT = `You are Maxi AI, an assistant for MaxiBlocks.
Help the user edit their page by translating natural, non-technical language into precise design actions.

Respond ONLY with a JSON object calling one of these actions:

1. Background Color (Selected Block): { "action": "set_background_color", "color": "#0000FF" }
2. Text Color (Selected Block): { "action": "set_text_color", "color": "#FF0000" }
3. Padding (Inner Space): { "action": "set_padding", "value": 20, "side": "optional" }
4. Margin (Outer Space): { "action": "set_margin", "value": 20, "side": "optional" }
5. Border: { "action": "set_border", "style": "solid", "width": 2, "color": "#000000" }
6. Border Radius: { "action": "set_border_radius", "value": 10, "corner": "optional" }
7. Box Shadow: { "action": "set_box_shadow", "x": 0, "y": 4, "blur": 10, "spread": 0, "color": "#00000040" }
8. Opacity: { "action": "set_opacity", "value": 0.8 } (0 to 1)
9. Width/Height: { "action": "set_width", "value": 500, "unit": "px" } / { "action": "set_height", "value": 300, "unit": "px" }
10. Typography:
* { "action": "set_font_size", "value": 24 }
* { "action": "set_font_family", "value": "Inter" }
* { "action": "set_font_weight", "value": "700" } (bold=700, normal=400, thin=100)
* { "action": "set_line_height", "value": 1.5, "unit": "em" }
* { "action": "set_letter_spacing", "value": 2, "unit": "px" }
* { "action": "set_text_transform", "value": "uppercase" }
* { "action": "set_text_align", "value": "center" }


11. Flexbox Layout (Containers/Rows):
* { "action": "set_flex_direction", "value": "column" } (stack) or "row" (side-by-side)
* { "action": "set_justify_content", "value": "center" } (main axis spacing)
* { "action": "set_align_items", "value": "center" } (cross axis alignment)
* { "action": "set_gap", "value": 20, "unit": "px" } (spacing between items)


12. Stacking & Positioning:
* { "action": "set_position", "value": "sticky" } (follow on scroll) or "absolute"
* { "action": "set_z_index", "value": 10 } (bring to front)


13. Visual Effects:
* { "action": "set_transform", "type": "rotate", "z": 45 } (tilt/turn)
* { "action": "set_clip_path", "shape": "circle" } (cut into shape)
* { "action": "set_blend_mode", "value": "multiply" } (blend with background)


14. Image Specific:
* { "action": "set_image_fit", "value": "cover" } (fill without stretching)
* { "action": "set_aspect_ratio", "value": "16:9" }


15. Global Changes:
* { "action": "update_page", "property": "text_color", "value": "#FF0000" } (all headings/text on page)
* { "action": "apply_theme", "prompt": "make it modern and dark" } (changes site-wide Style Card)


16. Clarification: { "action": "message", "content": "Question here", "options": ["Choice 1", "Choice 2"] }

Rules:

* Respond ONLY with JSON. No explanations.
* Be forgiving of typos ("ad border", "make is opacity").
* INDEPENDENCE: Treat each request separately. Do not reuse old values unless asked.
* COLOR/THEME: Always use "apply_theme" for palette or site-wide vibe changes.
* AMBIGUITY: If a request is unclear (e.g., "make it pop"), use "message" with options like.

Translation Guide (Dumbed Down Requests):

### Alignment & Layout (The "Boss" of Items)

* "Put these in a line" / "Horizontal" -> set_flex_direction: "row"
* "Stack them vertically" / "One on top of another" -> set_flex_direction: "column"
* "Put it in the dead center" -> set_justify_content: "center" + set_align_items: "center"
* "Line them up with the floor" / "Bottom align" -> set_align_items: "flex-end"
* "Spread them to the edges" / "Space them out" -> set_justify_content: "space-between"
* "Make all columns the same height" -> set_align_items: "stretch"

### Spacing (The Box Model)

* "Give the text some breathing room" / "It's too cramped inside" -> set_padding
* "Push this away from the image" / "Give it personal space" -> set_margin
* "Make the colored part of the button bigger" -> set_padding
* "Don't let these boxes touch" / "Add an invisible barrier" -> set_margin

### Depth & Stacking (Layers)

* "Bring this to the front" / "Put it on top" -> set_z_index: 10 + set_position: "relative"
* "Send to the back" / "Put it behind everything" -> set_z_index: -1
* "Make this follow me as I scroll" / "Sticky header" -> set_position: "sticky"
* "Glue this to the bottom corner" -> set_position: "fixed"

### Typography (Readability & Vibe)

* "The lines are crashing" / "Too jumbled" -> set_line_height (increase to 1.5)
* "The letters are squashed" / "Too tight" -> set_letter_spacing (increase)
* "Make the text chunkier" / "Heavy" -> set_font_weight: "700"
* "Give it a luxury/premium feel" -> set_letter_spacing: 3px + set_text_transform: "uppercase"
* "Wall of text" -> set_line_height: 1.6 + set_margin: bottom

### Visual Polish (The "Pop")

* "Make it pop" -> set_box_shadow (soft blur) + set_font_weight: "bold"
* "Soften the edges" -> set_border_radius: 12px
* "Make it a circle" -> set_border_radius: 500px
* "Frosted glass vibe" / "See-through" -> set_opacity: 0.8 + set_background_color (light tint)
* "Tilt/Turn this" -> set_transform: "rotate"
* "Zoom in on the photo" -> set_image_fit: "cover" + set_transform: "scale"

### Moods & Vibes (Global)

* "Make it look like Apple" -> apply_theme: "minimalist white, clean sans-serif, high contrast"
* "Give it a summer vibe" -> apply_theme: "bright yellows, oranges, and warm neutrals"
* "Make it professional and trustworthy" -> apply_theme: "deep blues, grays, and formal serifs"
`;

const AIChatPanel = ({ isOpen, onClose }) => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [scope, setScope] = useState('selection'); // 'selection', 'page', 'global'
	const messagesEndRef = useRef(null);

	const selectedBlock = useSelect(
		select => select('core/block-editor').getSelectedBlock(),
		[]
	);

	const allBlocks = useSelect(
		select => select('core/block-editor').getBlocks(),
		[]
	);

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

	// Border
	const updateBorder = (style, width = 2, color = '#000000', prefix = '') => {
		if (style === 'none') {
			return {
				[`${prefix}border-style-general`]: 'none',
			};
		}
		return {
			[`${prefix}border-style-general`]: style,
			[`${prefix}border-top-width-general`]: width,
			[`${prefix}border-right-width-general`]: width,
			[`${prefix}border-bottom-width-general`]: width,
			[`${prefix}border-left-width-general`]: width,
			[`${prefix}border-sync-width-general`]: 'all',
			[`${prefix}border-unit-width-general`]: 'px',
			[`${prefix}border-palette-status-general`]: false,
			[`${prefix}border-color-general`]: color,
		};
	};

	// Border Radius
	// Border Radius
	const updateBorderRadius = (value, corner = null, prefix = '') => {
		const corners = {
			'top-left': 'border-top-left-radius',
			'top-right': 'border-top-right-radius',
			'bottom-left': 'border-bottom-left-radius',
			'bottom-right': 'border-bottom-right-radius',
		};
		
		if (corner && corners[corner.toLowerCase()]) {
			return {
				[`${prefix}${corners[corner.toLowerCase()]}-general`]: value,
				[`${prefix}border-sync-radius-general`]: 'none',
				[`${prefix}border-unit-radius-general`]: 'px',
			};
		}
		
		return {
			[`${prefix}border-top-left-radius-general`]: value,
			[`${prefix}border-top-right-radius-general`]: value,
			[`${prefix}border-bottom-left-radius-general`]: value,
			[`${prefix}border-bottom-right-radius-general`]: value,
			[`${prefix}border-sync-radius-general`]: 'all',
			[`${prefix}border-unit-radius-general`]: 'px',
		};
	};

	// Box Shadow
	// Box Shadow
	const updateBoxShadow = (x = 0, y = 4, blur = 10, spread = 0, color = '#00000040', prefix = '') => ({
		[`${prefix}box-shadow-status-general`]: true,
		[`${prefix}box-shadow-horizontal-general`]: x,
		[`${prefix}box-shadow-vertical-general`]: y,
		[`${prefix}box-shadow-blur-general`]: blur,
		[`${prefix}box-shadow-spread-general`]: spread,
		[`${prefix}box-shadow-palette-status-general`]: false,
		[`${prefix}box-shadow-color-general`]: color,
		[`${prefix}box-shadow-horizontal-unit-general`]: 'px',
		[`${prefix}box-shadow-vertical-unit-general`]: 'px',
		[`${prefix}box-shadow-blur-unit-general`]: 'px',
		[`${prefix}box-shadow-spread-unit-general`]: 'px',
	});

	const removeBoxShadow = (prefix = '') => ({
		[`${prefix}box-shadow-status-general`]: false,
	});

	// Opacity
	const updateOpacity = (value) => ({
		'opacity-general': Math.max(0, Math.min(1, Number(value))),
	});

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

	const updateTextAlign = (value) => ({
		'text-alignment-general': value,
	});

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
		console.log('[Maxi AI] handleApplyTheme called with:', { theme, prompt });
		
		if (!allStyleCards || !saveMaxiStyleCards) {
			console.log('[Maxi AI] Style Cards not ready');
			return __('Style Cards System is not ready.', 'maxi-blocks');
		}

		// Detect if request is about headings
		const isHeadingRequest = prompt && /heading|header|title|h1|h2|h3|h4|h5|h6/i.test(prompt);
		const isBlueRequest = prompt && /blue/i.test(prompt);
		console.log('[Maxi AI] Request detection:', { isHeadingRequest, isBlueRequest, prompt });

		const result = applyThemeToStyleCards({
			styleCards: allStyleCards,
			theme,
			prompt,
			openEditor: false, // We'll handle opening manually with options
			timestamp: Date.now(),
		});

		console.log('[Maxi AI] applyThemeToStyleCards result:', result);

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
			
			console.log('[Maxi AI] Calling window.maxiBlocksOpenStyleCardsEditor with options:', editorOptions);
			console.log('[Maxi AI] window.maxiBlocksOpenStyleCardsEditor exists:', typeof window.maxiBlocksOpenStyleCardsEditor);
			
			if (typeof window.maxiBlocksOpenStyleCardsEditor === 'function') {
				window.maxiBlocksOpenStyleCardsEditor(editorOptions);
				console.log('[Maxi AI] Style Card editor opened successfully');
			} else {
				// Fallback: click the button
				const styleCardsButton = document.getElementById('maxi-button__style-cards');
				console.log('[Maxi AI] Fallback: button found:', !!styleCardsButton, styleCardsButton);
				if (styleCardsButton) {
					styleCardsButton.click();
					console.log('[Maxi AI] Button clicked');
					
					// If heading request, try to focus headings after editor opens
					if (isHeadingRequest) {
						setTimeout(() => {
							// Try to find Headings accordion - look for the accordion item wrapper first
							console.log('[Maxi AI] Looking for Headings accordion...');
							
							// The accordion item has class maxi-blocks-sc__type--heading
							// The button inside it has class maxi-accordion-control__item__button
							const headingAccordionItem = document.querySelector('.maxi-blocks-sc__type--heading');
							console.log('[Maxi AI] Heading accordion item found:', !!headingAccordionItem);
							
							if (headingAccordionItem) {
								// Accordion button is a div with role="button" and class .maxi-accordion-control__item__button
								// NOT a <button> tag
								const accordionBtn = headingAccordionItem.querySelector('.maxi-accordion-control__item__button');
								console.log('[Maxi AI] Accordion toggle button found:', !!accordionBtn);
								
								if (accordionBtn) {
									// Check if already expanded to avoid closing it
									const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
									if (!isExpanded) {
										accordionBtn.click();
										console.log('[Maxi AI] Clicked heading accordion header to open');
									} else {
										console.log('[Maxi AI] Heading accordion is already open');
									}
									
									// Now try to switch to the specific H-tag tab if needed
									setTimeout(() => {
										// This assumes SettingTabsControl renders buttons with text like "H1", "H2"
										// OR we can look for specific classes if we knew them.
										// Based on standard Maxi tabs, they might have classes.
										// Let's try to find the specific tab button.
										const headingPanel = headingAccordionItem.querySelector('.maxi-accordion-control__item__panel');
										if (headingPanel) {
											const tabButtons = Array.from(headingPanel.querySelectorAll('[role="tab"], button'));
											const targetTab = tabButtons.find(btn => 
												btn.textContent.trim().toLowerCase() === editorOptions.headingLevel.toLowerCase()
											);
											
											if (targetTab) {
												targetTab.click();
												console.log(`[Maxi AI] Switched to ${editorOptions.headingLevel} tab`);
											}
										}
									}, 100);
								}
							} else {
								// Fallback: try to find by text content
								const allAccordionButtons = document.querySelectorAll('.maxi-accordion-control__item__button');
								console.log('[Maxi AI] All accordion buttons found:', allAccordionButtons.length);
								
								for (const btn of allAccordionButtons) {
									if (btn.textContent.toLowerCase().includes('heading')) {
										btn.click();
										console.log('[Maxi AI] Clicked heading button by text match');
										break;
									}
								}
							}
						}, 500);
					}
				} else {
					console.log('[Maxi AI] Could not find style cards button');
				}
			}
		}, 300);

		if (result.createdNew) {
			return __('Created new Style Card. Review and save in the editor.', 'maxi-blocks');
		}
		return __('Style Card updated. Review and save in the editor.', 'maxi-blocks');
	};

	const handleUpdatePage = (property, value) => {
		let count = 0;
		const recursiveUpdate = (blocks) => {
			blocks.forEach(block => {
				let changes = null;
				const isMaxi = block.name.startsWith('maxi-blocks/');
				
				const prefix = getBlockPrefix(block.name);
				
				if (isMaxi) {
					switch (property) {
						case 'background_color':
							// Apply to containers, rows, columns
							if (block.name.includes('container') || block.name.includes('row') || block.name.includes('column')) {
								changes = updateBackgroundColor(block.clientId, value, block.attributes);
							}
							break;
						case 'text_color':
							// Apply to text and buttons
							if (block.name.includes('text-maxi') || block.name.includes('button-maxi')) {
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
						case 'margin':
							changes = updateMargin(value, null, prefix);
							break;
						case 'font_size':
							changes = updateFontSize(value);
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

		recursiveUpdate(allBlocks);
		return `Updated ${count} blocks on the page.`;
	};

	const parseAndExecuteAction = async responseText => {
		try {
			let action;
			try {
				action = JSON.parse(responseText.trim());
			} catch {
				const jsonMatch = responseText.match(/\{[\s\S]*\}/);
				if (jsonMatch) {
					action = JSON.parse(jsonMatch[0]);
				}
			}

			if (!action || !action.action) {
				return { executed: false, message: responseText };
			}

			if (action.action === 'message') {
				return { executed: false, message: action.content, options: action.options };
			}

			// GLOBAL ACTIONS
			if (action.action === 'update_page') {
				const resultMsg = handleUpdatePage(action.property, action.value);
				return { executed: true, message: resultMsg };
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

			// SINGLE BLOCK ACTIONS
			if (!selectedBlock?.clientId) {
				return {
					executed: false,
					message: __('Please select a block first for single-block updates.', 'maxi-blocks'),
				};
			}

			let resultMsg = 'Action executed.';
			const attrs = selectedBlock.attributes;
			let changes = {};
			const prefix = getBlockPrefix(selectedBlock.name);

			switch (action.action) {
				case 'set_background_color':
					changes = updateBackgroundColor(selectedBlock.clientId, action.color, attrs);
					resultMsg = __('Background color updated.', 'maxi-blocks');
					break;
				case 'set_text_color':
					changes = updateTextColor(action.color);
					resultMsg = __('Text color updated.', 'maxi-blocks');
					break;
				case 'set_padding':
					changes = updatePadding(action.value, action.side, prefix);
					resultMsg = action.side 
						? __(`${action.side.charAt(0).toUpperCase() + action.side.slice(1)} padding updated.`, 'maxi-blocks')
						: __('Padding updated.', 'maxi-blocks');
					break;
				case 'set_font_size':
					changes = updateFontSize(action.value);
					resultMsg = __('Font size updated.', 'maxi-blocks');
					break;
				case 'set_margin':
					changes = updateMargin(action.value, action.side, prefix);
					resultMsg = action.side 
						? __(`${action.side.charAt(0).toUpperCase() + action.side.slice(1)} margin updated.`, 'maxi-blocks')
						: __('Margin updated.', 'maxi-blocks');
					break;
				case 'set_border':
					changes = updateBorder(action.style, action.width, action.color, prefix);
					resultMsg = action.style === 'none' 
						? __('Border removed.', 'maxi-blocks')
						: __('Border updated.', 'maxi-blocks');
					break;
				case 'set_border_radius':
					changes = updateBorderRadius(action.value, action.corner, prefix);
					resultMsg = action.corner 
						? __(`${action.corner} border radius updated.`, 'maxi-blocks')
						: __('Border radius updated.', 'maxi-blocks');
					break;
				case 'set_box_shadow':
					changes = updateBoxShadow(action.x, action.y, action.blur, action.spread, action.color, prefix);
					resultMsg = __('Box shadow added.', 'maxi-blocks');
					break;
				case 'remove_box_shadow':
					changes = removeBoxShadow(prefix);
					resultMsg = __('Box shadow removed.', 'maxi-blocks');
					break;
				case 'set_opacity':
					changes = updateOpacity(action.value);
					resultMsg = __(`Opacity set to ${Math.round(action.value * 100)}%.`, 'maxi-blocks');
					break;
				case 'set_width':
					changes = updateWidth(action.value, action.unit || 'px', prefix);
					resultMsg = __(`Width set to ${action.value}${action.unit || 'px'}.`, 'maxi-blocks');
					break;
				case 'set_height':
					changes = updateHeight(action.value, action.unit || 'px', prefix);
					resultMsg = __(`Height set to ${action.value}${action.unit || 'px'}.`, 'maxi-blocks');
					break;
				case 'set_font_family':
					changes = updateFontFamily(action.value);
					resultMsg = __(`Font family set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_font_weight':
					changes = updateFontWeight(action.value);
					resultMsg = __(`Font weight set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_line_height':
					changes = updateLineHeight(action.value, action.unit || 'em');
					resultMsg = __(`Line height set to ${action.value}${action.unit || 'em'}.`, 'maxi-blocks');
					break;
				case 'set_letter_spacing':
					changes = updateLetterSpacing(action.value, action.unit || 'px');
					resultMsg = __(`Letter spacing set to ${action.value}${action.unit || 'px'}.`, 'maxi-blocks');
					break;
				case 'set_text_transform':
					changes = updateTextTransform(action.value);
					resultMsg = __(`Text transform set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_text_align':
					changes = updateTextAlign(action.value);
					resultMsg = __(`Text alignment set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_flex_direction':
					changes = updateFlexDirection(action.value);
					resultMsg = __(`Flex direction set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_justify_content':
					changes = updateJustifyContent(action.value);
					resultMsg = __(`Justify content set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_align_items':
					changes = updateAlignItems(action.value);
					resultMsg = __(`Align items set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_gap':
					changes = updateGap(action.value, action.unit || 'px');
					resultMsg = __(`Gap set to ${action.value}${action.unit || 'px'}.`, 'maxi-blocks');
					break;
				case 'set_display':
					changes = updateDisplay(action.value);
					resultMsg = __(`Display set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_position':
					changes = updatePosition(action.value);
					resultMsg = __(`Position set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_z_index':
					changes = updateZIndex(action.value);
					resultMsg = __(`Z-index set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_transform':
					changes = updateTransform(action.type, action.x, action.y, action.z);
					resultMsg = __(`Transform ${action.type} updated.`, 'maxi-blocks');
					break;
				case 'set_clip_path':
					changes = updateClipPath(action.shape);
					resultMsg = __(`Clip path set to ${action.shape}.`, 'maxi-blocks');
					break;
				case 'add_scroll_effect':
					changes = addScrollEffect(action.effect);
					resultMsg = __(`Scroll effect ${action.effect} added.`, 'maxi-blocks');
					break;
				case 'set_overflow':
					changes = updateOverflow(action.value);
					resultMsg = __(`Overflow set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_blend_mode':
					changes = updateBlendMode(action.value);
					resultMsg = __(`Blend mode set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_image_fit':
					changes = updateImageFit(action.value);
					resultMsg = __(`Image fit set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'set_aspect_ratio':
					changes = updateAspectRatio(action.value);
					resultMsg = __(`Aspect ratio set to ${action.value}.`, 'maxi-blocks');
					break;
				case 'update_block':
					changes = action.attributes;
					resultMsg = __('Block settings updated.', 'maxi-blocks');
					break;
				default:
					return { executed: false, message: __('Unknown action.', 'maxi-blocks') };
			}

			if (changes) {
				console.log('[Maxi AI] Applying changes to block:', selectedBlock.clientId, changes);
				
				// Use handleSetAttributes to properly process breakpoint-related attributes
				handleSetAttributes({
					obj: changes,
					attributes: selectedBlock.attributes,
					clientId: selectedBlock.clientId,
					onChange: processedChanges => {
						console.log('[Maxi AI] Processed changes:', processedChanges);
						updateBlockAttributes(selectedBlock.clientId, processedChanges);
					},
				});

				// Force style recalculation by invalidating CSS cache and re-selecting block
				const { uniqueID } = selectedBlock.attributes;
				if (uniqueID) {
					const { dispatch } = wp.data;
					dispatch('maxiBlocks/styles').removeCSSCache(uniqueID);
				}

				// Re-select the block to trigger re-render
				const { selectBlock } = wp.data.dispatch('core/block-editor');
				selectBlock(selectedBlock.clientId);

				// Open relevant sidebar panel based on action type
				// Format: { panel: 'Panel Name', tab: 'Settings' | 'Advanced' }
				const sidebarMapping = {
					set_padding: { panel: 'Margin / Padding', tab: 'Settings' },
					set_margin: { panel: 'Margin / Padding', tab: 'Settings' },
					set_background_color: { panel: 'Background / Layer', tab: 'Settings' },
					set_text_color: { panel: 'Typography', tab: 'Settings' },
					set_font_size: { panel: 'Typography', tab: 'Settings' },
					set_border: { panel: 'Border', tab: 'Settings' },
					set_border_radius: { panel: 'Border', tab: 'Settings' },
					set_box_shadow: { panel: 'Box shadow', tab: 'Settings' },
					remove_box_shadow: { panel: 'Box shadow', tab: 'Settings' },
					set_opacity: { panel: 'Opacity', tab: 'Advanced' },
					set_width: { panel: 'Height / Width', tab: 'Settings' },
					set_height: { panel: 'Height / Width', tab: 'Settings' },
					// Typography
					set_font_family: { panel: 'Typography', tab: 'Settings' },
					set_font_weight: { panel: 'Typography', tab: 'Settings' },
					set_line_height: { panel: 'Typography', tab: 'Settings' },
					set_letter_spacing: { panel: 'Typography', tab: 'Settings' },
					set_text_transform: { panel: 'Typography', tab: 'Settings' },
					set_text_align: { panel: 'Typography', tab: 'Settings' },
					// Layout
					set_flex_direction: { panel: 'Flexbox', tab: 'Settings' },
					set_justify_content: { panel: 'Flexbox', tab: 'Settings' },
					set_align_items: { panel: 'Flexbox', tab: 'Settings' },
					set_gap: { panel: 'Flexbox', tab: 'Settings' },
					set_display: { panel: 'Display', tab: 'Advanced' },
					set_position: { panel: 'Position', tab: 'Advanced' },
					set_z_index: { panel: 'Z-index', tab: 'Advanced' },
					// Visual Effects
					set_transform: { panel: 'Transform', tab: 'Advanced' },
					set_clip_path: { panel: 'Clip path', tab: 'Settings' },
					add_scroll_effect: { panel: 'Scroll effects', tab: 'Advanced' },
					set_overflow: { panel: 'Overflow', tab: 'Advanced' },
					set_blend_mode: { panel: 'Background / Layer', tab: 'Settings' },
					// Block Specific
					set_image_fit: { panel: 'Dimension', tab: 'Settings' },
					set_aspect_ratio: { panel: 'Dimension', tab: 'Settings' },
				};

				const mapping = sidebarMapping[action.action];
				if (mapping) {
					const { panel: panelLabel, tab: tabName } = mapping;
					console.log('[Maxi AI] Attempting to open sidebar panel:', panelLabel, 'in tab:', tabName);
					
					// Use setTimeout to allow DOM to settle after block attribute update
					setTimeout(() => {
						// First, click the correct tab (Settings or Advanced)
						// Use the correct selector for tab buttons
						const tabButtons = document.querySelectorAll('.maxi-tabs-control__button');
						console.log('[Maxi AI] Found tab buttons:', tabButtons.length);
						
						for (const tabBtn of tabButtons) {
							const btnText = tabBtn.textContent.trim().toLowerCase();
							console.log('[Maxi AI] Tab button text:', btnText);
							if (btnText === tabName.toLowerCase()) {
								console.log('[Maxi AI] Clicking tab:', tabName);
								tabBtn.click();
								break;
							}
						}
						
						// Wait a bit for the tab content to render, then find the accordion
						setTimeout(() => {
							// Try multiple selector strategies
							const selectors = [
								'.maxi-accordion-control__item__button',
								'.maxi-accordion-control button',
								'[class*="accordion"] button',
								'.maxi-accordion-tab__item__button',
							];
							
							// Extract key words from panelLabel for matching
							const labelParts = panelLabel.split(/\s*\/\s*|\s+/).filter(p => p.length > 2);
							console.log('[Maxi AI] Looking for panel containing:', labelParts);
							
							for (const selector of selectors) {
								const buttons = document.querySelectorAll(selector);
								
								for (const button of buttons) {
									const text = button.textContent.trim();
									// Check if button text matches any part of the panel label
									const matches = labelParts.some(part => 
										text.toLowerCase().includes(part.toLowerCase())
									);
									
									if (matches) {
										console.log('[Maxi AI] Found matching button:', text);
										button.click();
										return;
									}
								}
							}
							
							console.log('[Maxi AI] No matching accordion button found for:', panelLabel);
						}, 200);
					}, 300);
				}
			}

			return {
				executed: true,
				message: resultMsg,
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

			const { executed, message, options } = await parseAndExecuteAction(assistantContent);
			console.log('[Maxi AI] Parsed action result:', { executed, message });

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

	const handleSuggestion = suggestion => {
		setInput(suggestion);
	};

	const suggestions = [
		__('Darken primary color', 'maxi-blocks'), // Updated suggestion
		__('Change page background to white', 'maxi-blocks'),
		__('Increase font size for this block', 'maxi-blocks'),
	];

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
				<button className='maxi-ai-chat-panel__close' onClick={onClose}>
					×
				</button>
			</div>

			<div className='maxi-ai-chat-panel__scope-area'>
				<div className='maxi-ai-chat-panel__scope-options'>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'selection' ? 'is-active' : ''}`}
						onClick={() => setScope('selection')}
						title={__('Apply changes only to the selected block', 'maxi-blocks')}
					>
						{__('Selection', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'page' ? 'is-active' : ''}`}
						onClick={() => setScope('page')}
						title={__('Apply changes to the entire page', 'maxi-blocks')}
					>
						{__('Page', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${scope === 'global' ? 'is-active' : ''}`}
						onClick={() => setScope('global')}
						title={__('Apply changes globally via Style Cards', 'maxi-blocks')}
					>
						{__('Style Card', 'maxi-blocks')}
					</button>
				</div>
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
								{msg.options.map((opt, i) => (
									<button
										key={i}
										onClick={() => handleSuggestion(opt)}
										style={{
											border: '1px solid currentColor',
											background: 'rgba(255,255,255,0.1)',
											color: 'inherit',
											padding: '4px 10px',
											borderRadius: '12px',
											fontSize: '11px',
											cursor: 'pointer',
										}}
									>
										{opt}
									</button>
								))}
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

			{messages.length === 0 && (
				<div className='maxi-ai-chat-panel__suggestions'>
					{suggestions.map((suggestion, index) => (
						<button
							key={index}
							className='maxi-ai-chat-panel__suggestion'
							onClick={() => handleSuggestion(suggestion)}
						>
							{suggestion}
						</button>
					))}
				</div>
			)}


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
