import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import {
	colorReversedDictionary,
	prefixesReversedDictionary,
	reversedDictionary,
	suffixesReversedDictionary,
} from './attributesDictionary';

/**
 * Parse short key to long one
 *
 * @param {*} attrKey
 * @returns
 */
const parseShortAttrKey = attrKey => {
	let cleanedKey = attrKey;

	const breakpoint = getBreakpointFromAttribute(attrKey);

	if (breakpoint) cleanedKey = getAttrKeyWithoutBreakpoint(attrKey);

	// Abstract prefixes
	const prefixes = cleanedKey.split('-');
	cleanedKey = prefixes.pop();

	// Abstract suffixes
	const suffixes = cleanedKey.split('.');
	cleanedKey = suffixes.shift();

	// Translate prefixes
	const prefixesStr = prefixes
		.map(prefix => prefixesReversedDictionary[`${prefix}-`])
		.filter(Boolean)
		.join('-');

	// Translate suffixes
	const suffixesStr = suffixes
		.map(suffix => suffixesReversedDictionary[`.${suffix}`])
		.filter(Boolean)
		.join('-');

	// Translate key
	const key =
		colorReversedDictionary[cleanedKey] ??
		reversedDictionary[cleanedKey] ??
		cleanedKey;

	// Join all together
	const newKey = [prefixesStr, key, suffixesStr, breakpoint]
		.filter(Boolean)
		.join('-')
		.replaceAll('--', '-');

	return newKey;
};

export default parseShortAttrKey;
