/**
 * Internal dependencies
 */
import getAttrKeyWithoutBreakpoint from '../getAttrKeyWithoutBreakpoint';
import getBreakpointFromAttribute from '../getBreakpointFromAttribute';
import getCleanKey from '../getCleanKey';
import getNormalAttributeKey from '../getNormalAttributeKey';
import { allReversedDictionary } from './attributesDictionary';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Parse short key to long one
 *
 * @param {*} attrKey
 * @returns
 */

const findLongKeys = attrKey => {
	if (isEmpty(attrKey)) return [];
	let key = attrKey.match(/[_.-][a-z0-9]+$/);
	if (isEmpty(key)) {
		key = attrKey.match(/^[a-z0-9]+$/);
	}

	if (isEmpty(key)) return [];

	[key] = key;
	const remainingKey = attrKey.slice(0, -key.length);

	key = key.replace('-', '');

	if (key[0] !== '_' && key[0] !== '.') key = `${key}-`;

	return [allReversedDictionary[key] || key, ...findLongKeys(remainingKey)];
};

const parseShortAttrKey = attrKey => {
	let cleanedKey = attrKey;

	const breakpoint = getBreakpointFromAttribute(attrKey);
	const attrKeyWithoutHover = getNormalAttributeKey(attrKey);
	const isHover = attrKeyWithoutHover !== cleanedKey;
	if (isHover) cleanedKey = attrKeyWithoutHover;

	if (breakpoint) cleanedKey = getAttrKeyWithoutBreakpoint(cleanedKey);
	return getCleanKey(
		findLongKeys(cleanedKey).reverse().join('-') +
			(breakpoint
				? `-${breakpoint === 'g' ? 'general' : breakpoint}`
				: '') +
			(isHover ? '-hover' : '')
	);
};

export default parseShortAttrKey;
