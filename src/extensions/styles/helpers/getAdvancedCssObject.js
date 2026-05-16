/**
 * Internal dependencies
 */
import getAttributeValue from '@extensions/styles/getAttributeValue';
import { buildAdvancedCssMediaQueryTarget } from '@extensions/styles/advancedCssMediaQuery';

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

const selectorRegex =
	/([a-zA-Z0-9\-_\s.,#:*[\]="'>+~()|^$!/%]*?)\s*{([^}]*)}/g;

const findMatchingBrace = (code, openIndex) => {
	let depth = 0;
	let quote = null;
	let isEscaped = false;

	for (let index = openIndex; index < code.length; index += 1) {
		const character = code[index];
		const nextCharacter = code[index + 1];

		if (quote) {
			if (isEscaped) {
				isEscaped = false;
				continue;
			}
			if (character === '\\') {
				isEscaped = true;
				continue;
			}
			if (character === quote) quote = null;
			continue;
		}

		if (character === '/' && nextCharacter === '*') {
			const commentEndIndex = code.indexOf('*/', index + 2);
			if (commentEndIndex === -1) return -1;
			index = commentEndIndex + 1;
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}

		if (character === '{') depth += 1;
		if (character === '}') depth -= 1;
		if (depth === 0) return index;
	}

	return -1;
};

const findNextMediaQueryIndex = (code, startIndex) => {
	let depth = 0;
	let quote = null;
	let isEscaped = false;

	for (let index = startIndex; index < code.length; index += 1) {
		const character = code[index];
		const nextCharacter = code[index + 1];

		if (quote) {
			if (isEscaped) {
				isEscaped = false;
				continue;
			}
			if (character === '\\') {
				isEscaped = true;
				continue;
			}
			if (character === quote) quote = null;
			continue;
		}

		if (character === '/' && nextCharacter === '*') {
			const commentEndIndex = code.indexOf('*/', index + 2);
			if (commentEndIndex === -1) return -1;
			index = commentEndIndex + 1;
			continue;
		}

		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}

		if (character === '{') {
			depth += 1;
			continue;
		}

		if (character === '}') {
			depth = Math.max(depth - 1, 0);
			continue;
		}

		if (
			depth === 0 &&
			character === '@' &&
			/^@media\b/i.test(code.slice(index))
		) {
			return index;
		}
	}

	return -1;
};

const extractMediaQueries = code => {
	const mediaBlocks = [];
	let remainingCode = '';
	let cursor = 0;

	while (cursor < code.length) {
		const mediaIndex = findNextMediaQueryIndex(code, cursor);

		if (mediaIndex === -1) {
			remainingCode += code.slice(cursor);
			break;
		}

		const openBraceIndex = code.indexOf('{', mediaIndex);

		if (openBraceIndex === -1) {
			remainingCode += code.slice(cursor);
			break;
		}

		const closeBraceIndex = findMatchingBrace(code, openBraceIndex);

		if (closeBraceIndex === -1) {
			remainingCode += code.slice(cursor);
			break;
		}

		remainingCode += code.slice(cursor, mediaIndex);
		mediaBlocks.push({
			mediaQuery: code.slice(mediaIndex, openBraceIndex).trim(),
			code: code.slice(openBraceIndex + 1, closeBraceIndex),
		});

		cursor = closeBraceIndex + 1;
	}

	return { mediaBlocks, remainingCode };
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

const getBlockClassNames = obj =>
	obj?.extraClassName?.split(/\s+/).filter(Boolean) ?? [];

const isBlockClassSelector = (selector, className) => {
	const classSelector = `.${className}`;

	if (!selector.startsWith(classSelector)) return false;

	const nextCharacter = selector[classSelector.length];

	return (
		!nextCharacter ||
		/[:.#\[\s>+~,]/.test(nextCharacter)
	);
};

const getScopedSelector = (selector, blockClassNames) => {
	const trimmedSelector = selector.trim();

	if (
		blockClassNames.some(className =>
			isBlockClassSelector(trimmedSelector, className)
		)
	) {
		return trimmedSelector;
	}

	return ` ${trimmedSelector}`;
};

const parseAdvancedCssCode = (
	response,
	code,
	breakpoint,
	blockClassNames,
	mediaQuery = null
) => {
	selectorRegex.lastIndex = 0;

	let remainingCode = code;
	let match = selectorRegex.exec(code);

	while (match) {
		const rawSelectors = match[1]?.trim();
		const properties = trimUnmatchedBrace(match[2]?.trim());

		if (properties && !properties.includes('{')) {
			// Split selectors by comma and create separate response entries for each selector
			rawSelectors.split(',').forEach(rawSelector => {
				const selector = getScopedSelector(
					rawSelector,
					blockClassNames
				);
				const target = mediaQuery
					? buildAdvancedCssMediaQueryTarget(mediaQuery, selector)
					: selector;

				setAdvancedCss(response, target, breakpoint, properties);
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

		if (!remainingCode.trim()) return;

		const target = mediaQuery
			? buildAdvancedCssMediaQueryTarget(mediaQuery, '')
			: '';

		setAdvancedCss(response, target, breakpoint, remainingCode);
	}
};

// TODO: ensure helper has correct php alternative
const getAdvancedCssObject = obj => {
	const response = {};
	const blockClassNames = getBlockClassNames(obj);

	breakpoints.forEach(breakpoint => {
		const code = getAttributeValue({
			target: 'advanced-css',
			props: obj,
			breakpoint,
		});

		if (!code) return;

		const { mediaBlocks, remainingCode } = extractMediaQueries(code);

		mediaBlocks.forEach(({ mediaQuery, code: mediaCode }) => {
			parseAdvancedCssCode(
				response,
				mediaCode,
				breakpoint,
				blockClassNames,
				mediaQuery
			);
		});

		parseAdvancedCssCode(
			response,
			remainingCode,
			breakpoint,
			blockClassNames
		);
	});

	return response;
};

export default getAdvancedCssObject;
