/**
 * Map Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const MAP_PATTERNS = [
	{
		regex: /\bmap\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bmap\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the map background?',
		pageMsg: 'Which colour for the map background?',
		target: 'map',
		colorTarget: 'map',
	},
];

export const handleMapUpdate = (block, property, value, prefix, context = {}) => {
	const isMap = block?.name?.includes('map');
	if (!isMap) return null;
	return null;
};
