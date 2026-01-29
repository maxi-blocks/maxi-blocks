/**
 * Number Counter Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const NUMBER_COUNTER_PATTERNS = [
	{
		regex: /\b(number\s*counter|counter)\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\b(number\s*counter|counter)\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the counter background?',
		pageMsg: 'Which colour for the counter background?',
		target: 'number-counter',
		colorTarget: 'number-counter',
	},
];

export const handleNumberCounterUpdate = (block, property, value, prefix, context = {}) => {
	const isCounter = block?.name?.includes('number-counter') || block?.name?.includes('counter');
	if (!isCounter) return null;
	return null;
};
