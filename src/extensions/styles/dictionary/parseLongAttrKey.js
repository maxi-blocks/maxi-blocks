import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import { getNormalAttributeKey } from '../utils';
import dictionary, { noTypeDictionary } from './attributesDictionary';

/**
 * Replaces palette long keys with short ones, if it's `attrKey` includes them,
 * otherwise returns `attrKey` as it is
 *
 * @param {string} attrKey
 * @returns {string}
 */
const parsePalette = attrKey =>
	Object.entries(dictionary.palette).reduce((acc, [key, value]) => {
		if (attrKey?.includes(key)) {
			return acc.replace(key, value);
		}

		return acc;
	}, attrKey);

/**
 * Parse long key to short one
 *
 * @param {*} attrKey
 * @returns
 */
const parseLongAttrKey = (rawAttrKey, attrDictionary = noTypeDictionary) => {
	if (!rawAttrKey) return null;

	const attrKey = parsePalette(rawAttrKey);

	let cleanedKey = attrKey;

	const isHover = attrKey.includes('-hover');
	const breakpoint = getBreakpointFromAttribute(attrKey);

	if (isHover) cleanedKey = getNormalAttributeKey(attrKey);
	if (breakpoint) cleanedKey = getAttrKeyWithoutBreakpoint(cleanedKey);

	let prefix = '';
	let shorterKey;

	if (attrDictionary[cleanedKey]) shorterKey = attrDictionary[cleanedKey];
	else {
		const dictEntries = Object.entries(attrDictionary);

		/**
		 * To prevent situations when we have for example `clip-path` and `clip-path-status`
		 * and we want to replace `clip-path-status` with `cpt` instead of `cp`
		 * we need to find the longest key that is included in the `cleanedKey`
		 * and then replace it with the value from the dictionary
		 */
		let maxIncludedChars = -1;
		let maxIncludedCharsIndex = -1;
		for (let i = 0; i < dictEntries.length; i += 1) {
			const [key] = dictEntries[i];

			if (cleanedKey.includes(key) && key.length > maxIncludedChars) {
				maxIncludedChars = key.length;
				maxIncludedCharsIndex = i;
			}
		}

		if (maxIncludedChars > -1 && maxIncludedCharsIndex > -1) {
			const [key, value] = dictEntries[maxIncludedCharsIndex];

			prefix = cleanedKey.replace(key, '');
			shorterKey = value;
		}
	}

	if (!shorterKey) return attrKey;

	const response = `${prefix}${shorterKey}${
		breakpoint ? `-${breakpoint}` : ''
	}${isHover ? '-hover' : ''}`;

	return response;
};

export default parseLongAttrKey;
