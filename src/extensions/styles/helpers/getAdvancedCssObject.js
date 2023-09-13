const trimUnmatchedBrace = code => {
	const braceIndex = code.indexOf('{');
	if (braceIndex !== -1) {
		const lastSemicolonBeforeBrace = code.lastIndexOf(';', braceIndex);
		return code.substring(0, lastSemicolonBeforeBrace + 1).trim();
	}
	return code;
};

const getAdvancedCssObject = obj => {
	const code = obj['advanced-css'];

	const selectorRegex = /([a-zA-Z0-9\-_\s.,#:*[\]="']*?)\s*{([^}]*)}/g;
	const response = {};

	let remainingCode = code;
	let match = selectorRegex.exec(code);

	while (match) {
		const selector = ` ${match[1]?.trim()}` || '';
		const properties = trimUnmatchedBrace(match[2]?.trim());

		// Check if properties have unmatched opening brace, in such case, ignore this match
		if (properties && !properties.includes('{')) {
			response[selector] = {
				advancedCss: {
					general: {
						css: properties,
					},
				},
			};
			remainingCode = remainingCode.replace(match[0], '').trim(); // Remove the parsed segment from the remaining code
		} else {
			// if unmatched brace is found, stop the loop to prevent endless loop scenario
			break;
		}

		match = selectorRegex.exec(code);
	}

	// Add the remaining part as general CSS
	if (remainingCode) {
		remainingCode = trimUnmatchedBrace(remainingCode);

		if (response['']) {
			response[''].advancedCss.general.css += `\n${remainingCode}`;
		} else {
			response[''] = {
				advancedCss: {
					general: {
						css: remainingCode,
					},
				},
			};
		}
	}

	return response;
};

export default getAdvancedCssObject;
