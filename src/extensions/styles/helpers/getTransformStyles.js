/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import { validateOriginValue } from '@extensions/styles/utils';

/**
 * External dependencies
 */
import { isNumber, isString, isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getTransformStrings = (category, breakpoint, index, obj) => {
	const getLastBreakpointTransformAttribute = ({
		target,
		key,
		hoverSelected,
		keys,
	}) =>
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes: obj,
			keys: keys ?? [
				category,
				hoverSelected === 'canvas hover' ? 'hover' : hoverSelected,
				key,
			],
		});

	const shouldSkipTransform = transformType => {
		return (
			index === 'canvas hover' &&
			getLastBreakpointTransformAttribute({
				target: transformType,
				keys: [category, 'hover-target'],
				attributes: obj,
			})
		);
	};

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

		if (shouldSkipTransform('transform-scale')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-scale',
				keys: [category, 'hover-status'],
			})
		)
			return getScaleString('normal');

		const [x, y] = ['x', 'y'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-scale',
				key,
				hoverSelected: index,
			})
		);
		if (isNumber(x)) scaleString += `scaleX(${x / 100}) `;
		if (isNumber(y)) scaleString += `scaleY(${y / 100}) `;

		return scaleString;
	};

	const getTranslateString = index => {
		let translateString = '';

		if (shouldSkipTransform('transform-translate')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-translate',
				keys: [category, 'hover-status'],
			})
		)
			return getTranslateString('normal');

		const [x, y, xUnit, yUnit] = ['x', 'y', 'x-unit', 'y-unit'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-translate',
				key,
				hoverSelected: index,
			})
		);
		if (isNumber(x)) translateString += `translateX(${x}${xUnit ?? '%'}) `;
		if (isNumber(y)) translateString += `translateY(${y}${yUnit ?? '%'}) `;

		return translateString;
	};

	const getRotateString = index => {
		let rotateString = '';

		if (shouldSkipTransform('transform-rotate')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-rotate',
				keys: [category, 'hover-status'],
			})
		)
			return getRotateString('normal');

		const [x, y, z] = ['x', 'y', 'z'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-rotate',
				key,
				hoverSelected: index,
			})
		);

		if (isNumber(x)) rotateString += `rotateX(${x}deg) `;
		if (isNumber(y)) rotateString += `rotateY(${y}deg) `;
		if (isNumber(z)) rotateString += `rotateZ(${z}deg) `;

		return rotateString;
	};

	const getOriginString = index => {
		let originString = '';

		if (shouldSkipTransform('transform-origin')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-origin',
				keys: [category, 'hover-status'],
			})
		)
			return originString;

		const [x, y, xUnit, yUnit] = ['x', 'y', 'x-unit', 'y-unit'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-origin',
				key,
				hoverSelected: index,
			})
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
			if (!isEmpty(transformObj)) {
				response[target] = { transform: transformObj };
			}
		});
	});

	return response;
};

export default getTransformStyles;
