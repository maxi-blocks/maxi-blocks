/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import { validateOriginValue } from '../utils';

/**
 * External dependencies
 */
import { isNumber, isString, isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
			keys: keys ?? [category, hoverSelected, key],
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
			index === 'h' &&
			!getLastBreakpointTransformAttribute({
				target: 'tr_sc',
				keys: [category, 'hs'],
			})
		)
			return getScaleString('normal');

		const [x, y] = ['x', 'y'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'tr_sc',
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
		if (
			index === 'h' &&
			!getLastBreakpointTransformAttribute({
				target: 'tr_tr',
				keys: [category, 'hs'],
			})
		)
			return getTranslateString('normal');

		const [x, y, xUnit, yUnit] = ['x', 'y', 'x.u', 'y.u'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'tr_tr',
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
		if (
			index === 'h' &&
			!getLastBreakpointTransformAttribute({
				target: 'tr_rot',
				keys: [category, 'hs'],
			})
		)
			return getRotateString('normal');

		const [x, y, z] = ['x', 'y', 'z'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'tr_rot',
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

		if (
			index === 'h' &&
			!getLastBreakpointTransformAttribute({
				target: 'tr_ori',
				keys: [category, 'hs'],
			})
		)
			return originString;

		const [x, y, xUnit, yUnit] = ['x', 'y', 'x.u', 'y.u'].map(key =>
			getLastBreakpointTransformAttribute({
				target: 'tr_ori',
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
			if (!isEmpty(transformObj))
				response[target] = { transform: transformObj };
		});
	});

	return response;
};

export default getTransformStyles;
