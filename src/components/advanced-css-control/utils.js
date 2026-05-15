export const transformAdvancedCssCode = code => {
	if (!code) return '';

	const trimmedCode = code.trim();

	if (/^@media\b/i.test(trimmedCode)) return code;

	// Check if the code starts with a selector.
	const selectorRegex =
		/([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/;
	const matches = code.match(selectorRegex);

	// If the code doesn't start with a selector, find the first selector and wrap everything before it with 'body'
	if (!matches) {
		const firstSelectorIndex = code.search(
			/([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/
		);
		if (firstSelectorIndex > 0) {
			return `body {${code.substring(
				0,
				firstSelectorIndex
			)}}${code.substring(firstSelectorIndex)}`;
		}
		return `body {${code}}`; // if there's no selector at all in the input
	}
	return code;
};
