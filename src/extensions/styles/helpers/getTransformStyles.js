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

		if (
			isNumber(
				getLastBreakpointAttribute('transform-scale-x', breakpoint, obj)
			)
		)
			transformString += `scaleX(${
				getLastBreakpointAttribute(
					'transform-scale-x',
					breakpoint,
					obj
				) / 100
			}) `;
		if (
			isNumber(
				getLastBreakpointAttribute('transform-scale-y', breakpoint, obj)
			)
		)
			transformString += `scaleY(${
				getLastBreakpointAttribute(
					'transform-scale-y',
					breakpoint,
					obj
				) / 100
			}) `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-translate-x',
					breakpoint,
					obj
				)
			)
		)
			transformString += `translateX(${getLastBreakpointAttribute(
				'transform-translate-x',
				breakpoint,
				obj
			)}${getLastBreakpointAttribute(
				'transform-translate-x-unit',
				breakpoint,
				obj
			)}) `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-translate-y',
					breakpoint,
					obj
				)
			)
		)
			transformString += `translateY(${getLastBreakpointAttribute(
				'transform-translate-y',
				breakpoint,
				obj
			)}${getLastBreakpointAttribute(
				'transform-translate-y-unit',
				breakpoint,
				obj
			)}) `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-rotate-x',
					breakpoint,
					obj
				)
			)
		)
			transformString += `rotateX(${getLastBreakpointAttribute(
				'transform-rotate-x',
				breakpoint,
				obj
			)}deg) `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-rotate-y',
					breakpoint,
					obj
				)
			)
		)
			transformString += `rotateY(${getLastBreakpointAttribute(
				'transform-rotate-y',
				breakpoint,
				obj
			)}deg) `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-rotate-z',
					breakpoint,
					obj
				)
			)
		)
			transformString += `rotateZ(${getLastBreakpointAttribute(
				'transform-rotate-z',
				breakpoint,
				obj
			)}deg) `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-origin-x',
					breakpoint,
					obj
				)
			)
		)
			transformOriginString += `${getLastBreakpointAttribute(
				'transform-origin-x',
				breakpoint,
				obj
			)}% `;
		if (
			isNumber(
				getLastBreakpointAttribute(
					'transform-origin-y',
					breakpoint,
					obj
				)
			)
		)
			transformOriginString += `${getLastBreakpointAttribute(
				'transform-origin-y',
				breakpoint,
				obj
			)}% `;
		if (
			isString(
				getLastBreakpointAttribute(
					'transform-origin-x',
					breakpoint,
					obj
				)
			)
		)
			transformOriginString += `${getLastBreakpointAttribute(
				'transform-origin-x',
				breakpoint,
				obj
			)} `;
		if (
			isString(
				getLastBreakpointAttribute(
					'transform-origin-y',
					breakpoint,
					obj
				)
			)
		)
			transformOriginString += `${getLastBreakpointAttribute(
				'transform-origin-y',
				breakpoint,
				obj
			)} `;

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
