/**
 * Pane Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const PANE_PATTERNS = [
	{
		regex: /\bpane\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bpane\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the pane background?',
		pageMsg: 'Which colour for the pane background?',
		target: 'pane',
		colorTarget: 'pane',
	},
];

export const handlePaneUpdate = (block, property, value, prefix, context = {}) => {
	const isPane = block?.name?.includes('pane');
	if (!isPane) return null;
	return null;
};
