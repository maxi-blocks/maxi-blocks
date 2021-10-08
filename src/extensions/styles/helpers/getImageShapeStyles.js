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
const getImageShapeStyles = (target = 'svg', obj) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let transformString = '';
		const scale = getLastBreakpointAttribute(
			'image-shape-scale',
			breakpoint,
			obj
		);
		const rotate = getLastBreakpointAttribute(
			'image-shape-rotate',
			breakpoint,
			obj
		);

		const flipX = getLastBreakpointAttribute(
			'image-shape-flip-x',
			breakpoint,
			obj
		);

		const flipY = getLastBreakpointAttribute(
			'image-shape-flip-y',
			breakpoint,
			obj
		);

		if (isNumber(scale)) {
			if (target === 'svg') transformString += `scale(${scale / 100}) `;
			if (target === 'image') transformString += `scale(${100 / scale}) `;
		}

		if (isNumber(rotate)) {
			if (target === 'svg') transformString += `rotate(${rotate}deg) `;
			if (target === 'image') transformString += `rotate(-${rotate}deg) `;
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
