const trimUnmatchedBrace = code => {
	const braceIndex = code.indexOf('{');
	if (braceIndex !== -1) {
		const lastSemicolonBeforeBrace = code.lastIndexOf(';', braceIndex);
		return code.substring(0, lastSemicolonBeforeBrace + 1).trim();
	}
	return code;
};

const getAdvancedCssObject = obj => {
	const response = {};
	const code = obj['advanced-css'];

	if (!code) return response;

	const selectorRegex = /([a-zA-Z0-9\-_\s.,#:*[\]="']*?)\s*{([^}]*)}/g;

	let remainingCode = code;
	let match = selectorRegex.exec(code);

	while (match) {
		const rawSelectors = match[1]?.trim();
		const properties = trimUnmatchedBrace(match[2]?.trim());

		if (properties && !properties.includes('{')) {
			// Split selectors by comma and create separate response entries for each selector
			rawSelectors.split(',').forEach(rawSelector => {
				const selector = ` ${rawSelector.trim()}`;
				response[selector] = {
					advancedCss: {
						general: {
							css: properties,
						},
					},
				};
			});

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
