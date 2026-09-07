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

	const getPerspectiveString = index => {
		let perspectiveString = '';

		if (shouldSkipTransform('transform-perspective')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-perspective',
				keys: [category, 'hover-status'],
			})
		)
			return getPerspectiveString('normal');

		const [value, unit] = ['value', 'unit'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-perspective',
				key,
				hoverSelected: index,
			})
		);

		if (isNumber(value))
			perspectiveString += `perspective(${value}${unit ?? 'px'}) `;

		return perspectiveString;
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

	const getTranslate3dString = index => {
		let translateString = '';

		if (shouldSkipTransform('transform-translate3d')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-translate3d',
				keys: [category, 'hover-status'],
			})
		)
			return getTranslate3dString('normal');

		const [x, y, z, xUnit, yUnit, zUnit] = [
			'x',
			'y',
			'z',
			'x-unit',
			'y-unit',
			'z-unit',
		].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-translate3d',
				key,
				hoverSelected: index,
			})
		);

		if ([x, y, z].some(isNumber))
			translateString += `translate3d(${isNumber(x) ? x : 0}${
				xUnit ?? 'px'
			}, ${isNumber(y) ? y : 0}${yUnit ?? 'px'}, ${
				isNumber(z) ? z : 0
			}${zUnit ?? 'px'}) `;

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

	const getScale3dString = index => {
		let scaleString = '';

		if (shouldSkipTransform('transform-scale3d')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-scale3d',
				keys: [category, 'hover-status'],
			})
		)
			return getScale3dString('normal');

		const [x, y, z] = ['x', 'y', 'z'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-scale3d',
				key,
				hoverSelected: index,
			})
		);

		if ([x, y, z].some(isNumber))
			scaleString += `scale3d(${isNumber(x) ? x : 1}, ${
				isNumber(y) ? y : 1
			}, ${isNumber(z) ? z : 1}) `;

		return scaleString;
	};

	const getRotate3dString = index => {
		let rotateString = '';

		if (shouldSkipTransform('transform-rotate3d')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-rotate3d',
				keys: [category, 'hover-status'],
			})
		)
			return getRotate3dString('normal');

		const [x, y, z, angle] = ['x', 'y', 'z', 'angle'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-rotate3d',
				key,
				hoverSelected: index,
			})
		);

		if (isNumber(angle))
			rotateString += `rotate3d(${isNumber(x) ? x : 0}, ${
				isNumber(y) ? y : 0
			}, ${isNumber(z) ? z : 1}, ${angle}deg) `;

		return rotateString;
	};

	const getSkewString = index => {
		let skewString = '';

		if (shouldSkipTransform('transform-skew')) return '';

		if (
			index === 'hover' &&
			!getLastBreakpointTransformAttribute({
				target: 'transform-skew',
				keys: [category, 'hover-status'],
			})
		)
			return getSkewString('normal');

		const [x, y] = ['x', 'y'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'transform-skew',
				key,
				hoverSelected: index,
			})
		);

		if (isNumber(x)) skewString += `skewX(${x}deg) `;
		if (isNumber(y)) skewString += `skewY(${y}deg) `;

		return skewString;
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
		getPerspectiveString(index) +
		getScaleString(index) +
		getTranslateString(index) +
		getTranslate3dString(index) +
		getScale3dString(index) +
		getRotateString(index) +
		getRotate3dString(index) +
		getSkewString(index);
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
