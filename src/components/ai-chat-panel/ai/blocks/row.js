/**
 * Row Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const ROW_PATTERNS = [
	{
		regex: /\brow\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\brow\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the row background?',
		pageMsg: 'Which colour for the row background?',
		target: 'row',
		colorTarget: 'row',
	},
];

export const handleRowUpdate = (block, property, value, prefix, context = {}) => {
	const isRow = block?.name?.includes('row');
	if (!isRow) return null;
	return null;
};
