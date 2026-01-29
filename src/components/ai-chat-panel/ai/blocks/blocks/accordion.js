/**
 * Accordion Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const ACCORDION_PATTERNS = [
	{
		regex: /\baccordion\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\baccordion\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the accordion background?',
		pageMsg: 'Which colour for the accordion background?',
		target: 'accordion',
		colorTarget: 'accordion',
	},
];

export const handleAccordionUpdate = (block, property, value, prefix, context = {}) => {
	const isAccordion = block?.name?.includes('accordion');
	if (!isAccordion) return null;
	return null;
};
