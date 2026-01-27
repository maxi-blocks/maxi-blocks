/**
 * Column Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const COLUMN_PATTERNS = [
	{
		regex: /\bcolumn\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bcolumn\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the column background?',
		pageMsg: 'Which colour for the column background?',
		target: 'column',
		colorTarget: 'column',
	},
];

export const handleColumnUpdate = (block, property, value, prefix, context = {}) => {
	const isColumn = block?.name?.includes('column');
	if (!isColumn) return null;
	return null;
};
