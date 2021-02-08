/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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

		if (isNumber(scaleX)) transformString += `scaleX(${scaleX / 100}) `;
		if (isNumber(scaleY)) transformString += `scaleY(${scaleY / 100}) `;
		if (isNumber(translateX) && translateX > 0)
			transformString += `translateX(${translateX}${translateXUnit}) `;
		if (isNumber(translateY) && translateY > 0)
			transformString += `translateY(${translateY}${translateYUnit}) `;
		if (isNumber(rotateX)) transformString += `rotateX(${rotateX}deg) `;
		if (isNumber(rotateY)) transformString += `rotateY(${rotateY}deg) `;
		if (isNumber(rotateZ)) transformString += `rotateZ(${rotateZ}deg) `;
		if (isString(originX)) transformOriginString += `${originX}% `;
		if (isString(originY)) transformOriginString += `${originY}% `;

		const transformObj = {
			...(!isEmpty(transformString) && { transform: transformString }),
			...(!isEmpty(transformOriginString) && {
				'transform-origin': transformOriginString,
			}),
		};
		if (!isEmpty(transformObj)) response[breakpoint] = transformObj;
	});

	return response;
};

export default getTransformStyles;
