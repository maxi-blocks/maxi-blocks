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
	if (isButtonContext) return 'button-background';

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
	return 'element';
};

export const getColorTargetLabel = colorTarget => {
	if (colorTarget === 'shape-divider') return 'shape divider';
	if (colorTarget === 'shape-divider-top') return 'shape divider (top)';
	if (colorTarget === 'shape-divider-bottom') return 'shape divider (bottom)';
	if (colorTarget === 'icon-background') return 'icon background';
	if (colorTarget === 'number-counter-circle-background') return 'counter circle background';
	if (colorTarget === 'number-counter-text') return 'counter text';
	return String(colorTarget || '').replace('button-', '');
};

export const buildColorUpdate = (colorTarget, colorValue, { selectedBlock } = {}) => {
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
	} else if (colorTarget === 'icon-background') {
		property = 'background_color';
		targetBlock = 'icon';
		msgText = 'icon background';
	} else if (colorTarget === 'number-counter-circle-background') {
		property = 'number_counter_circle_background_color';
		targetBlock = 'number-counter';
		msgText = 'counter circle background';
	} else if (colorTarget === 'number-counter-text') {
		property = 'number_counter_text_color';
		targetBlock = 'number-counter';
		msgText = 'counter text';
	} else if (colorTarget === 'background') {
		property = 'background_color';
		targetBlock = 'container';
		msgText = 'background';
	} else if (
		[
			'group',
			'row',
			'column',
			'accordion',
			'pane',
			'slide',
			'slider',
			'video',
			'map',
			'search',
			'number-counter',
		].includes(colorTarget)
	) {
		property = 'background_color';
		targetBlock = colorTarget;
		msgText = `${String(colorTarget).replace('-', ' ')} background`;
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
		targetBlock = String(selectedBlock?.name || '').includes('button') ? 'button' : 'container';
		msgText = 'element';
	}

	if (!property) {
		property = 'background_color';
		targetBlock = 'container';
		msgText = 'background';
	}

	return { property, targetBlock, value, msgText };
};
