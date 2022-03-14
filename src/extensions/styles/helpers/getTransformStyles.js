/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import { validateOriginValue } from '../utils';

/**
 * External dependencies
 */
import { isNumber, isString, isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransformStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let transformString = '';
		let transformOriginString = '';

		const scaleX = getLastBreakpointAttribute({
			target: 'transform-scale-x',
			breakpoint,
			attributes: obj,
		});
		const scaleY = getLastBreakpointAttribute({
			target: 'transform-scale-y',
			breakpoint,
			attributes: obj,
		});
		const translateX = getLastBreakpointAttribute({
			target: 'transform-translate-x',
			breakpoint,
			attributes: obj,
		});
		const translateXUnit = getLastBreakpointAttribute({
			target: 'transform-translate-x-unit',
			breakpoint,
			attributes: obj,
		});
		const translateY = getLastBreakpointAttribute({
			target: 'transform-translate-y',
			breakpoint,
			attributes: obj,
		});
		const translateYUnit = getLastBreakpointAttribute({
			target: 'transform-translate-y-unit',
			breakpoint,
			attributes: obj,
		});
		const rotateX = getLastBreakpointAttribute({
			target: 'transform-rotate-x',
			breakpoint,
			attributes: obj,
		});
		const rotateY = getLastBreakpointAttribute({
			target: 'transform-rotate-y',
			breakpoint,
			attributes: obj,
		});
		const rotateZ = getLastBreakpointAttribute({
			target: 'transform-rotate-z',
			breakpoint,
			attributes: obj,
		});
		const originX = getLastBreakpointAttribute({
			target: 'transform-origin-x',
			breakpoint,
			attributes: obj,
		});
		const originY = getLastBreakpointAttribute({
			target: 'transform-origin-y',
			breakpoint,
			attributes: obj,
		});
		const originXUnit = getLastBreakpointAttribute({
			target: 'transform-origin-x-unit',
			breakpoint,
			attributes: obj,
		});
		const originYUnit = getLastBreakpointAttribute({
			target: 'transform-origin-y-unit',
			breakpoint,
			attributes: obj,
		});

		const originValueToNumber = value => {
			switch (validateOriginValue(value)) {
				case 'top':
					return 0;
				case 'right':
					return 100;
				case 'bottom':
					return 100;
				case 'left':
					return 0;
				case 'center':
					return 50;
				case 'middle':
					return 50;
				default:
					return value;
			}
		};

		if (isNumber(scaleX)) transformString += `scaleX(${scaleX / 100}) `;
		if (isNumber(scaleY)) transformString += `scaleY(${scaleY / 100}) `;
		if (isNumber(translateX))
			transformString += `translateX(${translateX}${translateXUnit}) `;
		if (isNumber(translateY))
			transformString += `translateY(${translateY}${translateYUnit}) `;
		if (isNumber(rotateX)) transformString += `rotateX(${rotateX}deg) `;
		if (isNumber(rotateY)) transformString += `rotateY(${rotateY}deg) `;
		if (isNumber(rotateZ)) transformString += `rotateZ(${rotateZ}deg) `;

		if (isString(validateOriginValue(originX)))
			transformOriginString += `${originValueToNumber(originX)}% `;
		if (isString(validateOriginValue(originY)))
			transformOriginString += `${originValueToNumber(originY)}% `;

		if (isNumber(validateOriginValue(originX)))
			transformOriginString += `${originX}${originXUnit} `;
		if (isNumber(validateOriginValue(originY)))
			transformOriginString += `${originY}${originYUnit} `;

		const transformObj = {
			...(!isEmpty(transformString) && { transform: transformString }),
			...(!isEmpty(transformOriginString) && {
				'transform-origin': `${transformOriginString}`,
			}),
		};
		if (!isEmpty(transformObj)) response[breakpoint] = transformObj;
	});

	return response;
};

export default getTransformStyles;
