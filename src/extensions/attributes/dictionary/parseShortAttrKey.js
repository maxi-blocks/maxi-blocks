import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import getNormalAttributeKey from '../getNormalAttributeKey';
import {
	colorReversedDictionary,
	prefixesReversedDictionary,
	reversedDictionary,
	suffixesReversedDictionary,
} from './attributesDictionary';

import { isEmpty } from 'lodash';

/**
 * Parse short key to long one
 *
 * @param {*} attrKey
 * @returns
 */
const parseShortAttrKey = attrKey => {
	let cleanedKey = attrKey;

	const breakpoint = getBreakpointFromAttribute(attrKey);
	const attrKeyWithoutHover = getNormalAttributeKey(attrKey);
	const isHover = attrKeyWithoutHover !== cleanedKey;
	const includesKey = cleanedKey.includes('_');

	if (isHover) cleanedKey = attrKeyWithoutHover;
	if (breakpoint) cleanedKey = getAttrKeyWithoutBreakpoint(cleanedKey);

	// Abstract prefixes
	let prefixes;
	if (includesKey) {
		prefixes = cleanedKey.split('_');
		cleanedKey = prefixes
			.reduce((accumulator, value) => {
				if (!accumulator.includes(value)) accumulator.push(value);

				return accumulator;
			}, []) // No repetitions
			.map((prefix, i, self) => {
				const containsPrefix = cleanedKey.includes(`_${prefix}`);

				// Checks the key is not repeated later
				const isRepeatedLater = self.filter(
					pr =>
						prefix !== pr &&
						pr.includes(prefix) &&
						self.indexOf(pr) > i
					// !pr.includes('-')
				).length;

				if (containsPrefix && !isRepeatedLater) {
					delete prefixes[i];

					return `_${prefix}`;
				}

				return '';
			})
			.join('');
		prefixes = prefixes.filter(val => !isEmpty(val));
		prefixes = prefixes[0]?.split('-') || [];
	} else {
		prefixes = cleanedKey.split('.').shift().split('-');
		cleanedKey = `.${cleanedKey.replace(`${prefixes.join('-')}.`, '')}`;
	}

	// Abstract color
	const color = Object.keys(colorReversedDictionary).filter(color => {
		const colorRegex = new RegExp(`-${color}[^a-zA-Z]`);

		return colorRegex.test(cleanedKey) || cleanedKey.endsWith(color);
	})[0];
	if (color) {
		const lastColorRegex = new RegExp(`${color}(?=[^.h]*$)`);

		cleanedKey = cleanedKey.replace(lastColorRegex, '');
	}

	// Abstract keys
	let keys = cleanedKey.split('_');

	keys.forEach(key => {
		// remove everything after the first dot
		if (key.includes('.')) {
			keys = key.split('.');
			keys = [keys.shift()];
		}
	});

	// Abstract suffixes
	const suffixes = cleanedKey.split('.');
	cleanedKey = suffixes.shift();

	// Translate color
	const colorStr = colorReversedDictionary[color];

	// Translate prefixes
	const prefixesStr = prefixes
		.map(prefix => prefixesReversedDictionary[`${prefix}-`])
		.filter(Boolean)
		.join('-')
		.replace('--', '-');

	// Translate suffixes
	const suffixesStr = suffixes
		.map(suffix => suffixesReversedDictionary[`.${suffix}`])
		.filter(Boolean)
		.join('-')
		.replace('--', '-');

	// Translate key
	let key = keys
		.map(key => reversedDictionary[`_${key}`] ?? key)
		.filter(el => !isEmpty(el));
	if (key.length === 1) [key] = key;
	else key = key.join('-');

	// Join all together
	const newKey = [
		prefixesStr,
		key,
		suffixesStr,
		colorStr,
		breakpoint,
		isHover ? '-hover' : '',
	]
		.filter(Boolean)
		.join('-')
		.replaceAll('--', '-')
		.replaceAll('--', '-')
		.replaceAll('-_', '_');

	return newKey;
};

export default parseShortAttrKey;
