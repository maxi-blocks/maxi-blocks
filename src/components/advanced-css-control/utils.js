export const transformAdvancedCssCode = code => {
	if (!code) return '';

	const trimmedCode = code.trim();

	if (/^@media\b/i.test(trimmedCode)) return trimmedCode;

	// Check if the code starts with a selector.
	const selectorRegex =
		/^([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/;
	const matches = trimmedCode.match(selectorRegex);

	// If the code doesn't start with a selector, find the first selector and wrap everything before it with 'body'
	if (!matches) {
		const unanchoredSelectorRegex =
			/([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/;
		const firstSelectorIndex = trimmedCode.search(
			unanchoredSelectorRegex
		);
		if (firstSelectorIndex > 0) {
			return `body {${trimmedCode.substring(
				0,
				firstSelectorIndex
			)}}${trimmedCode.substring(firstSelectorIndex)}`;
		}
		return `body {${trimmedCode}}`; // if there's no selector at all in the input
	}
	return trimmedCode;
};
