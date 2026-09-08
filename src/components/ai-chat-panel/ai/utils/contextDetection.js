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

export const isInteractionBuilderMessage = lowerMessage => {
	const message = String(lowerMessage || '').toLowerCase();
	const clickWord = /\bclick(?:ed|ing)?\b|\btap(?:ped|ping)?\b/;
	const hoverWord = /\bhover(?:ed|ing)?\b/;

	const isInteractionBuilderPhrase =
		/\binteraction\s*builder\b|\binteraction-builder\b|\binteraction\b.*\bbuilder\b/.test(
			message
		) ||
		/\binterecation\s*builder\b|\binterecation-builder\b|\binterecation\b.*\bbuilder\b/.test(
			message
		);

	const hasClickTrigger =
		/\bon\s*(click|tap)\b|\bwhen\s+i\s+(click|tap)\b/.test(message) ||
		(clickWord.test(message) &&
			/\b(show|hide|toggle|open|close|reveal|expand|collapse)\b/.test(
				message
			));

	const hasHoverTrigger =
		/\bon\s*hover\b|\bwhen\s+i\s+hover\b|\bmouse\s*over\b|\bmouseover\b|\bmouseenter\b/.test(
			message
		) ||
		(hoverWord.test(message) &&
			/\b(effect|animate|animation|fade|opacity|scale|grow|shrink|move|slide|lift|transform|show|hide|toggle|open|close|reveal|disappear|vanish|reset)\b/.test(
				message
			));

	return isInteractionBuilderPhrase || hasClickTrigger || hasHoverTrigger;
};
