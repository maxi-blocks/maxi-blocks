/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isNumber, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * Generates overflow styles object
 *
 * @param {Object} obj Block overflow properties
 */
const getImageShapeStyles = (target = 'svg', obj, prefix = '') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let transformString = '';
		const scale = getLastBreakpointAttribute({
			target: `${prefix}image-shape-scale`,
			breakpoint,
			attributes: obj,
		});
		const rotate = getLastBreakpointAttribute({
			target: `${prefix}image-shape-rotate`,
			breakpoint,
			attributes: obj,
		});

		const flipX = getLastBreakpointAttribute({
			target: `${prefix}image-shape-flip-x`,
			breakpoint,
			attributes: obj,
		});

		const flipY = getLastBreakpointAttribute({
			target: `${prefix}image-shape-flip-y`,
			breakpoint,
			attributes: obj,
		});

		if (isNumber(scale)) {
			if (target === 'svg') transformString += `scale(${scale / 100}) `;
			if (target === 'image') transformString += `scale(${100 / scale}) `;
		}

		if (isNumber(rotate)) {
			if (target === 'svg') transformString += `rotate(${rotate}deg) `;
			if (target === 'image')
				if ((flipX && !flipY) || (!flipX && flipY))
					transformString += `rotate(${rotate}deg) `;
				else transformString += `rotate(-${rotate}deg) `;
		}

		if (flipX) {
			transformString += 'scaleX(-1) ';
		}

		if (flipY) {
			transformString += 'scaleY(-1) ';
		}

		const transformObj = {
			...(!isEmpty(transformString) && { transform: transformString }),
		};
		if (!isEmpty(transformObj)) response[breakpoint] = transformObj;
	});

	return response;
};

export default getImageShapeStyles;
