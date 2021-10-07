/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import validateOriginValue from '../utils';

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

		const scaleX = getLastBreakpointAttribute(
			'transform-scale-x',
			breakpoint,
			obj
		);
		const scaleY = getLastBreakpointAttribute(
			'transform-scale-y',
			breakpoint,
			obj
		);
		const translateX = getLastBreakpointAttribute(
			'transform-translate-x',
			breakpoint,
			obj
		);
		const translateXUnit = getLastBreakpointAttribute(
			'transform-translate-x-unit',
			breakpoint,
			obj
		);
		const translateY = getLastBreakpointAttribute(
			'transform-translate-y',
			breakpoint,
			obj
		);
		const translateYUnit = getLastBreakpointAttribute(
			'transform-translate-y-unit',
			breakpoint,
			obj
		);
		const rotateX = getLastBreakpointAttribute(
			'transform-rotate-x',
			breakpoint,
			obj
		);
		const rotateY = getLastBreakpointAttribute(
			'transform-rotate-y',
			breakpoint,
			obj
		);
		const rotateZ = getLastBreakpointAttribute(
			'transform-rotate-z',
			breakpoint,
			obj
		);
		const originX = getLastBreakpointAttribute(
			'transform-origin-x',
			breakpoint,
			obj
		);
		const originY = getLastBreakpointAttribute(
			'transform-origin-y',
			breakpoint,
			obj
		);
		const originXUnit = getLastBreakpointAttribute(
			'transform-origin-x-unit',
			breakpoint,
			obj
		);
		const originYUnit = getLastBreakpointAttribute(
			'transform-origin-y-unit',
			breakpoint,
			obj
		);

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
