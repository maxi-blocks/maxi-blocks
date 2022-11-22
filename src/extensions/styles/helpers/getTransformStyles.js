/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
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

	const scaleObj = getLastBreakpointAttribute({
		target: 'transform-scale',
		breakpoint,
		attributes: obj,
	});
	const translateObj = getLastBreakpointAttribute({
		target: 'transform-translate',
		breakpoint,
		attributes: obj,
	});
	const rotateObj = getLastBreakpointAttribute({
		target: 'transform-rotate',
		breakpoint,
		attributes: obj,
	});
	const originObj = getLastBreakpointAttribute({
		target: 'transform-origin',
		breakpoint,
		attributes: obj,
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

	const getScaleString = (scaleObj, category, index) => {
		let scaleString = '';
		if (isEmpty(scaleObj)) return scaleString;
		if (index === 'hover' && !scaleObj?.[category]?.['hover-status'])
			return getScaleString(scaleObj, category, 'normal');

		const [x, y] = ['x', 'y'].map(prop =>
			getLastBreakpointTransformAttribute('transform-scale', prop, index)
		);
		if (isNumber(x)) scaleString += `scaleX(${x / 100}) `;
		if (isNumber(y)) scaleString += `scaleY(${y / 100}) `;

		return scaleString;
	};

	const getTranslateString = (translateObj, category, index) => {
		let translateString = '';
		if (isEmpty(translateObj)) return translateString;
		if (index === 'hover' && !translateObj?.[category]?.['hover-status'])
			return getTranslateString(translateObj, category, 'normal');

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

	const getRotateString = (rotateObj, category, index) => {
		let rotateString = '';
		if (isEmpty(rotateObj)) return rotateString;
		if (index === 'hover' && !rotateObj?.[category]?.['hover-status'])
			return getRotateString(rotateObj, category, 'normal');

		const [x, y, z] = ['x', 'y', 'z'].map(prop =>
			getLastBreakpointTransformAttribute('transform-rotate', prop, index)
		);

		if (isNumber(x)) rotateString += `rotateX(${x}deg) `;
		if (isNumber(y)) rotateString += `rotateY(${y}deg) `;
		if (isNumber(z)) rotateString += `rotateZ(${z}deg) `;

		return rotateString;
	};

	const getOriginString = (originObj, category, index) => {
		let originString = '';

		if (
			isEmpty(originObj) ||
			(index === 'hover' && !originObj?.[category]?.['hover-status'])
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
		getScaleString(scaleObj, category, index) +
		getTranslateString(translateObj, category, index) +
		getRotateString(rotateObj, category, index);
	const transformOriginString = getOriginString(originObj, category, index);

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
