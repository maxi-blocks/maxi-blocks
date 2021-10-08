/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isNumber, isString, isEmpty } from 'lodash';

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

		if (isNumber(scale) && target === 'svg')
			transformString += `scale(${scale / 100}) `;

		if (isNumber(rotate)) {
			if (target === 'svg') transformString += `rotate(${rotate}deg) `;
			if (target === 'image') transformString += `rotate(-${rotate}deg) `;
		}

		const transformObj = {
			...(!isEmpty(transformString) && { transform: transformString }),
		};
		if (!isEmpty(transformObj)) response[breakpoint] = transformObj;
	});

	return response;
};

export default getImageShapeStyles;
