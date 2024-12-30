/**
 * Internal dependencies
 */
import getAttributeValue from '@extensions/styles/getAttributeValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const trimUnmatchedBrace = code => {
	const braceIndex = code.indexOf('{');
	if (braceIndex !== -1) {
		const lastSemicolonBeforeBrace = code.lastIndexOf(';', braceIndex);
		return code.substring(0, lastSemicolonBeforeBrace + 1).trim();
	}
	return code;
};

const setAdvancedCss = (obj, selector, breakpoint, css) => {
	const trimmedCss = css
		.replace(/\t/g, '')
		.replace(/\n/g, ' ')
		.replace(/\s\s+/g, ' ')
		.trim();

	if (obj[selector]) {
		obj[selector].advancedCss[breakpoint] = {
			css: trimmedCss,
		};
	} else {
		obj[selector] = {
			advancedCss: {
				[breakpoint]: {
					css: trimmedCss,
				},
			},
		};
	}
};

// TODO: ensure helper has correct php alternative
const getAdvancedCssObject = obj => {
	const response = {};

	const selectorRegex = /([a-zA-Z0-9\-_\s.,#:*[\]="']*?)\s*{([^}]*)}/g;

	breakpoints.forEach(breakpoint => {
		const code = getAttributeValue({
			target: 'advanced-css',
			props: obj,
			breakpoint,
		});

		if (!code) return;

		let remainingCode = code;
		let match = selectorRegex.exec(code);

		while (match) {
			const rawSelectors = match[1]?.trim();
			const properties = trimUnmatchedBrace(match[2]?.trim());

			if (properties && !properties.includes('{')) {
				// Split selectors by comma and create separate response entries for each selector
				rawSelectors.split(',').forEach(rawSelector => {
					const selector = ` ${rawSelector.trim()}`;
					setAdvancedCss(response, selector, breakpoint, properties);
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
			setAdvancedCss(response, '', breakpoint, remainingCode);
		}
	});

	return response;
};

export default getAdvancedCssObject;
