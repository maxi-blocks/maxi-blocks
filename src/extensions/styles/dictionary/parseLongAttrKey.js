import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import { getAttrKeyWithoutStatus, getNormalAttributeKey } from '../utils';
import { noTypeDictionary } from './attributesDictionary';

/**
 * Parse long key to short one
 *
 * @param {*} attrKey
 * @returns
 */
const parseLongAttrKey = attrKey => {
	if (!attrKey) return null;

	let cleanedKey = attrKey;

	const isHover = attrKey.includes('-hover');
	const isStatus = attrKey.includes('-status');
	const breakpoint = getBreakpointFromAttribute(attrKey);

	if (isHover) cleanedKey = getNormalAttributeKey(attrKey);
	if (breakpoint) cleanedKey = getAttrKeyWithoutBreakpoint(cleanedKey);
	if (isStatus) cleanedKey = getAttrKeyWithoutStatus(cleanedKey);

	let prefix = '';
	let shorterKey;

	if (noTypeDictionary[cleanedKey]) shorterKey = noTypeDictionary[cleanedKey];
	else {
		const dictEntries = Object.entries(noTypeDictionary);

		for (let i = 0; i < dictEntries.length; i += 1) {
			const [key, value] = dictEntries[i];

			if (cleanedKey.includes(key)) {
				prefix = cleanedKey.replace(key, '');

				shorterKey = value;

				break;
			}
		}
	}

	if (!shorterKey) return attrKey;

	const response = `${prefix}${shorterKey}${isStatus ? '-status' : ''}${
		breakpoint ? `-${breakpoint}` : ''
	}${isHover ? '-hover' : ''}`;

	return response;
};

export default parseLongAttrKey;
