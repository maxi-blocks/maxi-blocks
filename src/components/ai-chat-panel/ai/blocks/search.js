/**
 * Search Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const SEARCH_PATTERNS = [
	{
		regex: /\bsearch\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bsearch\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the search background?',
		pageMsg: 'Which colour for the search background?',
		target: 'search',
		colorTarget: 'search',
	},
];

export const handleSearchUpdate = (block, property, value, prefix, context = {}) => {
	const isSearch = block?.name?.includes('search');
	if (!isSearch) return null;
	return null;
};
