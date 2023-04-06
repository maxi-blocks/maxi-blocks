/**
 * External dependencies
 */
import { round, isNil } from 'lodash';

export const getResizerSize = (elt, blockRef, unit, axis = 'width') => {
	const pxSize = elt.getBoundingClientRect()[axis];

	switch (unit) {
		case '%': {
			const wrapperSize = blockRef.current.getBoundingClientRect()[axis];

			return round((pxSize / wrapperSize) * 100, 2).toString();
		}
		case 'vw': {
			const winSize = window.innerWidth;

			return round((pxSize / winSize) * 100, 2).toString();
		}
		case 'px':
		default:
			return pxSize.toString();
	}
};

export const getStylesWrapperId = uniqueID =>
	`maxi-blocks__styles--${uniqueID}`;

export const removeNullValues = obj => {
	Object.keys(obj).forEach(key => {
		if (isNil(obj[key])) {
			delete obj[key];
		}
	});
};

export const hasKeys = (obj, keyStr, logic = 'and') => {
	const keys = Object.keys(obj);
	if (typeof keyStr === 'string')
		return keys.some(key => key.includes(keyStr));
	if (logic === 'and')
		return keys.some(key => keyStr.every(str => key.includes(str)));
	return keys.some(key => keyStr.some(str => key.includes(str)));
};
