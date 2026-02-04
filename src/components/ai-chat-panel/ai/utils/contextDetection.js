export const isTextContextForMessage = (lowerMessage, selectedBlockName = '') => {
	const message = String(lowerMessage || '').toLowerCase();
	const selectionName = String(selectedBlockName || '').toLowerCase();

	const selectionIsText =
		selectionName.includes('text-maxi') ||
		selectionName.includes('list-item-maxi') ||
		selectionName.includes('heading') ||
		selectionName.includes('paragraph');
	if (selectionIsText) return true;

	// Avoid mis-routing prompts that mention "text" but clearly refer to another block type.
	// Example: "Set counter text color..." should stay in the number counter handlers/patterns.
	if (selectionName.includes('number-counter') || /\b(number\s*counter|counter)\b/.test(message)) {
		return false;
	}

	return /\b(text|copy|content|paragraph|heading|headline|title|subtitle|subheading|font|typography|line\s*height|letter\s*spacing)\b/.test(
		message
	);
};
