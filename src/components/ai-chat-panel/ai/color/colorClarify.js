export const getColorTargetFromMessage = (lowerMessage, { selectedBlock } = {}) => {
	const message = String(lowerMessage || '').toLowerCase();
	const selectedName = String(selectedBlock?.name || '').toLowerCase();
	const selectedAttributes = selectedBlock?.attributes || {};

	const isButtonContext = message.includes('button') || selectedName.includes('button');
	const isHover = message.includes('hover');
	const isActive = message.includes('active') || message.includes('pressed');
	const isText =
		message.includes('text') || message.includes('label') || message.includes('font');
	const isBackground = message.includes('background') || message.includes('bg');
	const isNumberCounterContext =
		selectedName.includes('number-counter') ||
		/\b(number\s*counter|counter)\b/i.test(message);
	const isIconContext = selectedName.includes('icon-maxi') || selectedName.includes('svg-icon');
	const containerWordRegex = /\b(container|section|row|column|group)\b/;
	const containerNegationRegex =
		/\b(?:not|no)\s+(?:the\s+)?(?:container|section|row|column|group)\b/;
	const mentionsContainerWord = containerWordRegex.test(message);
	const negatesContainerWord = containerNegationRegex.test(message);
	const wantsContainerBackground = mentionsContainerWord && !negatesContainerWord;
	const mentionsIcon = message.includes('icon') || message.includes('svg');
	const isShapeKeyword =
		message.includes('shape divider') ||
		message.includes('shape-divider') ||
		message.includes('wave') ||
		message.includes('waves') ||
		message.includes('curve') ||
		message.includes('slant') ||
		message.includes('triangle');
	const isContainer = selectedName.includes('container');
	const hasShapeDivider =
		!!selectedAttributes['shape-divider-top-status'] ||
		!!selectedAttributes['shape-divider-bottom-status'];
	const wantsTop = message.includes('top');
	const wantsBottom = message.includes('bottom');
	const isDivider = message.includes('divider') || selectedName.includes('divider');

	// Link colour — must be checked before generic text/background checks so
	// "change link colour to black" is not misrouted to the text colour path.
	const isLink = /\blinks?\b/.test(message);
	if (isLink) {
		if (isHover) return 'link-hover';
		if (isActive) return 'link-active';
		if (message.includes('visited')) return 'link-visited';
		return 'link';
	}

	if (isShapeKeyword || (isDivider && isContainer)) {
		if (wantsTop && !wantsBottom) return 'shape-divider-top';
		if (wantsBottom && !wantsTop) return 'shape-divider-bottom';
		if (wantsTop && wantsBottom) return 'shape-divider';
		if (hasShapeDivider) {
			const hasTop = !!selectedAttributes['shape-divider-top-status'];
			const hasBottom = !!selectedAttributes['shape-divider-bottom-status'];
			if (hasTop && !hasBottom) return 'shape-divider-top';
			if (hasBottom && !hasTop) return 'shape-divider-bottom';
		}
		return 'shape-divider';
	}

	if (isDivider) return 'divider';
	if (message.includes('border') && isButtonContext) return 'button-border';
	if (isHover && isButtonContext) {
		if (isText) return 'button-hover-text';
		if (isBackground) return 'button-hover-background';
	}
	if (isActive && isButtonContext) return 'button-active-background';
	if (isButtonContext && isText) return 'button-text';
	if (isButtonContext && isBackground) return 'button-background';
	// Ambiguous button colour with no explicit target keyword — ask the user rather
	// than defaulting to background (which would mishandle follow-ups like "black colour"
	// after a border operation).
	if (isButtonContext) return 'element';

	if (isNumberCounterContext) {
		if (isBackground) return 'number-counter-circle-background';
		if (isText) return 'number-counter-text';
	}

	if (isBackground && (isIconContext || mentionsIcon) && !wantsContainerBackground) {
		return 'icon-background';
	}
	if (isBackground) return 'background';
	if (isText) return 'text';
	if (message.includes('border')) return 'border';

	// Icon colour — detect fill vs line intent when icon is in context.
	if ((mentionsIcon || isIconContext) && !isButtonContext) {
		const wantsLine = /\b(line|stroke)\b/.test(message);
		const wantsFill = /\bfill\b/.test(message);
		if (wantsLine && !wantsFill) return 'icon-line';
		if (wantsFill && !wantsLine) return 'icon-fill-only';
		return 'icon-fill'; // ambiguous → resolved at apply time
	}

	// Ambiguous message (e.g. bare "change colour") — always ask the user which target
	// they mean, regardless of the selected block type.
	return 'element';
};

const COLOR_TARGET_LABELS = {
	'shape-divider': 'shape divider',
	'shape-divider-top': 'shape divider (top)',
	'shape-divider-bottom': 'shape divider (bottom)',
	'icon-fill': 'icon',
	'icon-fill-only': 'icon fill',
	'icon-line': 'icon line',
	'icon-background': 'icon background',
	'number-counter-circle-background': 'counter circle background',
	'number-counter-text': 'counter text',
};

export const getColorTargetLabel = colorTarget =>
	COLOR_TARGET_LABELS[ colorTarget ] ??
	String(colorTarget || '').replace('button-', '');

/**
 * Derives the targetBlock string from the selected block's name for the 'background' color target.
 * Targets the selected block directly so handleUpdateSelection never walks to a parent.
 *
 * @param {Object|null} selectedBlock
 * @returns {string}
 */
const getBackgroundTargetBlock = selectedBlock => {
	const name = String(selectedBlock?.name || '').toLowerCase();
	if (name.includes('text-maxi') || name.includes('list-item-maxi')) return 'text';
	if (name.includes('button-maxi')) return 'button';
	if (name.includes('image-maxi')) return 'image';
	if (name.includes('icon-maxi') || name.includes('svg-icon')) return 'icon';
	if (name.includes('column-maxi')) return 'column';
	if (name.includes('row-maxi')) return 'row';
	if (name.includes('group-maxi')) return 'group';
	return 'container';
};

/** Block types that use background_color and share their colorTarget as targetBlock. */
const LAYOUT_BACKGROUND_TARGETS = new Set([
	'group', 'row', 'column', 'accordion', 'pane',
	'slide', 'slider', 'video', 'map', 'search', 'number-counter',
]);

export const buildColorUpdate = (colorTarget, colorValue, { selectedBlock } = {}) => {
	let property = 'background_color';
	let targetBlock = 'container';
	let value = colorValue;
	let msgText = 'background';

	switch (colorTarget) {
		case 'button':
		case 'button-background':
			property = 'background_color';
			targetBlock = 'button';
			msgText = 'button background';
			break;
		case 'button-text':
			property = 'text_color';
			targetBlock = 'button';
			msgText = 'button text';
			break;
		case 'button-border':
			property = 'border';
			targetBlock = 'button';
			msgText = 'button border';
			break;
		case 'button-hover-background':
			property = 'button_hover_bg';
			targetBlock = 'button';
			msgText = 'button hover background';
			break;
		case 'button-hover-text':
			property = 'button_hover_text';
			targetBlock = 'button';
			msgText = 'button hover text';
			break;
		case 'button-active-background':
			property = 'button_active_bg';
			targetBlock = 'button';
			msgText = 'button active background';
			break;
		case 'button-icon-fill':
			property = 'icon_color';
			targetBlock = 'button';
			value = { target: 'fill', color: colorValue };
			msgText = 'button icon fill';
			break;
		case 'button-icon-stroke':
			property = 'icon_color';
			targetBlock = 'button';
			value = { target: 'stroke', color: colorValue };
			msgText = 'button icon stroke';
			break;
		case 'icon-fill':
			property = 'svg_icon_color';
			targetBlock = 'icon';
			msgText = 'icon';
			break;
		case 'icon-fill-only':
			property = 'svg_fill_color';
			targetBlock = 'icon';
			msgText = 'icon fill';
			break;
		case 'icon-line':
			property = 'svg_line_color';
			targetBlock = 'icon';
			msgText = 'icon line';
			break;
		case 'icon-background':
			property = 'background_color';
			targetBlock = 'icon';
			msgText = 'icon background';
			break;
		case 'number-counter-circle-background':
			property = 'number_counter_circle_background_color';
			targetBlock = 'number-counter';
			msgText = 'counter circle background';
			break;
		case 'number-counter-text':
			property = 'number_counter_text_color';
			targetBlock = 'number-counter';
			msgText = 'counter text';
			break;
		case 'background':
			// Target the selected block directly — never default to container,
			// otherwise handleUpdateSelection walks up to the parent block.
			property = 'background_color';
			targetBlock = getBackgroundTargetBlock(selectedBlock);
			msgText = 'background';
			break;
		case 'link':
			property = 'link_color';
			targetBlock = 'text';
			msgText = 'link';
			break;
		case 'link-hover':
			property = 'link_color_hover';
			targetBlock = 'text';
			msgText = 'link hover';
			break;
		case 'link-active':
			property = 'link_color_active';
			targetBlock = 'text';
			msgText = 'link active';
			break;
		case 'link-visited':
			property = 'link_color_visited';
			targetBlock = 'text';
			msgText = 'link visited';
			break;
		case 'text':
			property = 'text_color';
			targetBlock = 'text';
			msgText = 'text';
			break;
		case 'shape-divider-top':
			property = 'shape_divider_color_top';
			targetBlock = 'container';
			msgText = 'shape divider (top)';
			break;
		case 'shape-divider-bottom':
			property = 'shape_divider_color_bottom';
			targetBlock = 'container';
			msgText = 'shape divider (bottom)';
			break;
		case 'shape-divider':
			property = 'shape_divider_color';
			targetBlock = 'container';
			msgText = 'shape divider';
			break;
		case 'divider':
			property = 'divider_color';
			targetBlock = 'divider';
			msgText = 'divider';
			break;
		case 'element':
			property = 'background_color';
			targetBlock = String(selectedBlock?.name || '').includes('button') ? 'button' : 'container';
			msgText = 'element';
			break;
		default:
			if (LAYOUT_BACKGROUND_TARGETS.has(colorTarget)) {
				property = 'background_color';
				targetBlock = colorTarget;
				msgText = `${String(colorTarget).replace('-', ' ')} background`;
			}
			// Unknown target — fallthrough to defaults set above.
	}

	return { property, targetBlock, value, msgText };
};
