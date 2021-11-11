/**
 * External dependencies
 */
import { round } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getResizerSize = (elt, blockRef, unit, axis = 'width') => {
	const pxSize = elt.getBoundingClientRect()[axis];

	switch (unit) {
		case '%': {
			const wrapperSize = blockRef.current.getBoundingClientRect()[axis];

			return round((pxSize / wrapperSize) * 100, 2);
		}
		case 'vw': {
			const winSize = window.innerWidth;

			return round((pxSize / winSize) * 100, 2);
		}
		case 'px':
		default:
			return pxSize;
	}
};
