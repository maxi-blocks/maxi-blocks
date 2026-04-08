const TARGETED_PATTERN_TARGETS = new Set([
	'accordion',
	'button',
	'image',
	'container',
	'row',
	'column',
	'group',
	'divider',
	'text',
	'pane',
	'slide',
	'slider',
	'video',
	'map',
	'search',
	'icon',
	'number-counter',
]);

export const isTargetedPatternTarget = target =>
	TARGETED_PATTERN_TARGETS.has(target);

export const getRequestedTargetFromMessage = (
	lowerMessage,
	{ selectedBlockName, hasShapeDividerIntent = false } = {}
) => {
	const message = String(lowerMessage || '').toLowerCase();
	const selectionName = String(selectedBlockName || '').toLowerCase();

	const selectionTarget = (() => {
		if (!selectionName) return null;
		if (selectionName.includes('number-counter')) return 'number-counter';
		if (selectionName.includes('accordion')) return 'accordion';
		if (selectionName.includes('video')) return 'video';
		if (selectionName.includes('search')) return 'search';
		if (selectionName.includes('map')) return 'map';
		if (selectionName.includes('slider')) return 'slider';
		if (selectionName.includes('slide') && !selectionName.includes('slider'))
			return 'slide';
		if (selectionName.includes('pane')) return 'pane';
		if (selectionName.includes('image')) return 'image';
		if (selectionName.includes('button')) return 'button';
		if (selectionName.includes('icon-maxi') || selectionName.includes('svg-icon'))
			return 'icon';
		if (selectionName.includes('divider')) return 'divider';
		if (selectionName.includes('text') || selectionName.includes('heading'))
			return 'text';
		if (selectionName.includes('row')) return 'row';
		if (selectionName.includes('column')) return 'column';
		if (selectionName.includes('group')) return 'group';
		if (selectionName.includes('container')) return 'container';
		return null;
	})();

	// Explicit message targets override selection defaults.
	if (hasShapeDividerIntent) return 'container';
	if (/\b(number\s*counter|counter)\b/.test(message)) return 'number-counter';
	if (message.includes('accordion')) return 'accordion';
	if (message.includes('video')) return 'video';
	if (message.includes('search')) return 'search';
	if (message.includes('map')) return 'map';
	if (message.includes('slider')) return 'slider';
	if (/\bslide\b/.test(message) && !message.includes('slider')) return 'slide';
	if (message.includes('pane')) return 'pane';
	if (
		message.includes('image') ||
		message.includes('photo') ||
		message.includes('picture')
	)
		return 'image';
	if (message.includes('button')) return 'button';

	const explicitlyWantsIconBlock =
		/\b(svg[\s-]?icon|svg-icon|icon[\s-]?block|icon[\s-]?maxi)\b/.test(
			message
		) ||
		/\bicons\b/.test(message) ||
		/\bsvg\b/.test(message);
	if (explicitlyWantsIconBlock) return 'icon';

	if (message.includes('divider')) return 'divider';
	if (
		message.includes('text') ||
		message.includes('heading') ||
		message.includes('paragraph')
	)
		return 'text';
	if (/\brow\b/.test(message)) return 'row';
	if (/\bcolumn\b/.test(message)) return 'column';
	if (/\bgroup\b/.test(message)) return 'group';
	if (message.includes('container') || message.includes('section')) return 'container';

	if (selectionTarget) return selectionTarget;

	if (/\bicons?\b/.test(message) || /\bsvg\b/.test(message)) return 'icon';

	return null;
};
