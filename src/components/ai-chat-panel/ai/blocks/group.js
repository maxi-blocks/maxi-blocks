/**
 * Group Logic Handler for AI Chat Panel
 * Focused on color-related requests.
 */

export const GROUP_PATTERNS = [
	{
		regex: /\bgroup\b.*\b(background|bg|colou?r|color)\b|\b(background|bg|colou?r|color)\b.*\bgroup\b/i,
		property: 'color_clarify',
		value: 'show_palette',
		selectionMsg: 'Which colour for the group background?',
		pageMsg: 'Which colour for the group background?',
		target: 'group',
		colorTarget: 'group',
	},
];

export const handleGroupUpdate = (block, property, value, prefix, context = {}) => {
	const isGroup = block?.name?.includes('group');
	if (!isGroup) return null;
	return null;
};
