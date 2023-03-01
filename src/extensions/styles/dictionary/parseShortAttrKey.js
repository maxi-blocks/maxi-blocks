import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import { getNormalAttributeKey } from '../utils';
import { reversedDictionary } from './attributesDictionary';

/**
 * Parse short key to long one
 *
 * @param {*} attrKey
 * @returns
 */
const parseShortAttrKey = attrKey => {
	let cleanedKey = attrKey;

	const isHover = attrKey.includes('-hover');
	const breakpoint = getBreakpointFromAttribute(attrKey);

	if (isHover) cleanedKey = getNormalAttributeKey(attrKey);
	if (breakpoint) cleanedKey = getAttrKeyWithoutBreakpoint(attrKey);

	let prefix = '';
	let longerKey;

	if (reversedDictionary[cleanedKey])
		longerKey = reversedDictionary[cleanedKey];
	else {
		const dictEntries = Object.entries(reversedDictionary);

		for (let i = 0; i < dictEntries.length; i += 1) {
			const [key, value] = dictEntries[i];

			if (cleanedKey.includes(key)) {
				prefix = cleanedKey.replace(key, '');

				longerKey = value;

				break;
			}
		}
	}

	if (!longerKey) return attrKey;

	const response = `${prefix}${longerKey}${
		breakpoint ? `-${breakpoint}` : ''
	}${isHover ? '-hover' : ''}`;

	return response;
};

export default parseShortAttrKey;
