/**
 * Slide Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const SLIDE_PATTERNS = [
	{
		regex: /\bslide\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bslide\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the slide background?',
		pageMsg: 'Which colour for the slide background?',
		target: 'slide',
		colorTarget: 'slide',
	},
];

export const handleSlideUpdate = (block, property, value, prefix, context = {}) => {
	const isSlide = block?.name?.includes('slide');
	if (!isSlide) return null;
	return null;
};
