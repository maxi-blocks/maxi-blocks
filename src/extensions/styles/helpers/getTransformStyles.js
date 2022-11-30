/**
 * Internal dependencies
 */
import getLastBreakpointTransformAttributeRaw from '../getLastBreakpointTransformAttribute';
import { validateOriginValue } from '../utils';

/**
 * External dependencies
 */
import { isNumber, isString, isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getTransformStrings = (category, breakpoint, index, obj) => {
	const getLastBreakpointTransformAttribute = (
		attributeName,
		prop,
		hoverSelected
	) =>
		getLastBreakpointTransformAttributeRaw({
			attributeName,
			prop,
			transformTarget: category,
			breakpoint,
			attributes: obj,
			hoverSelected,
			ignoreNormal: true,
		});

	const originValueToNumber = value => {
		switch (validateOriginValue(value)) {
			case 'top':
			case 'left':
				return 0;
			case 'middle':
			case 'center':
				return 50;
			case 'bottom':
			case 'right':
				return 100;
			default:
				return value;
		}
	};

	const getScaleString = index => {
		let scaleString = '';
		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute(
				'transform-scale',
				null,
				'hover-status'
			)
		)
			return getScaleString('normal');

		const [x, y] = ['x', 'y'].map(prop =>
			getLastBreakpointTransformAttribute('transform-scale', prop, index)
		);
		if (isNumber(x)) scaleString += `scaleX(${x / 100}) `;
		if (isNumber(y)) scaleString += `scaleY(${y / 100}) `;

		return scaleString;
	};

	const getTranslateString = index => {
		let translateString = '';
		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute(
				'transform-translate',
				null,
				'hover-status'
			)
		)
			return getTranslateString('normal');

		const [x, y, xUnit, yUnit] = ['x', 'y', 'x-unit', 'y-unit'].map(prop =>
			getLastBreakpointTransformAttribute(
				'transform-translate',
				prop,
				index
			)
		);
		if (isNumber(x)) translateString += `translateX(${x}${xUnit ?? '%'}) `;
		if (isNumber(y)) translateString += `translateY(${y}${yUnit ?? '%'}) `;

		return translateString;
	};

	const getRotateString = index => {
		let rotateString = '';
		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute(
				'transform-rotate',
				null,
				'hover-status'
			)
		)
			return getRotateString('normal');

		const [x, y, z] = ['x', 'y', 'z'].map(prop =>
			getLastBreakpointTransformAttribute('transform-rotate', prop, index)
		);

		if (isNumber(x)) rotateString += `rotateX(${x}deg) `;
		if (isNumber(y)) rotateString += `rotateY(${y}deg) `;
		if (isNumber(z)) rotateString += `rotateZ(${z}deg) `;

		return rotateString;
	};

	const getOriginString = index => {
		let originString = '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute(
				'transform-origin',
				null,
				'hover-status'
			)
		)
			return originString;

		const [x, y, xUnit, yUnit] = ['x', 'y', 'x-unit', 'y-unit'].map(prop =>
			getLastBreakpointTransformAttribute('transform-origin', prop, index)
		);

		if (isString(validateOriginValue(x)))
			originString += `${originValueToNumber(x)}% `;
		if (isString(validateOriginValue(y)))
			originString += `${originValueToNumber(y)}% `;

		if (isNumber(validateOriginValue(x)))
			originString += `${x}${xUnit ?? '%'} `;
		if (isNumber(validateOriginValue(y)))
			originString += `${y}${yUnit ?? '%'} `;

		return originString;
	};

	const transformString =
		getScaleString(index) +
		getTranslateString(index) +
		getRotateString(index);
	const transformOriginString = getOriginString(index);

	return [transformString, transformOriginString];
};

const getTransformValue = (obj, category, index) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const [transformString, transformOriginString] = getTransformStrings(
			category,
			breakpoint,
			index,
			obj
		);

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

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransformStyles = (obj, selectors) => {
	const response = {};

	Object.entries(selectors).forEach(([category, targets]) => {
		Object.entries(targets).forEach(([index, targetObj]) => {
			const { target } = targetObj;
			const transformObj = getTransformValue(obj, category, index);
			if (!isEmpty(transformObj))
				response[target] = { transform: transformObj };
		});
	});

	return response;
};

export default getTransformStyles;
