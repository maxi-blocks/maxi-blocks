/**
 * Slider Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const SLIDER_PATTERNS = [
	{
		regex: /\bslider\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bslider\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the slider background?',
		pageMsg: 'Which colour for the slider background?',
		target: 'slider',
		colorTarget: 'slider',
	},
];

export const handleSliderUpdate = (block, property, value, prefix, context = {}) => {
	const isSlider = block?.name?.includes('slider');
	if (!isSlider) return null;
	return null;
};
