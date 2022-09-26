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

const getTransformStrings = (category, breakpoint, index, obj) => {
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

		if (isNumber(scaleObj?.[category]?.[index]?.x))
			scaleString += `scaleX(${scaleObj[category][index].x / 100}) `;
		if (isNumber(scaleObj?.[category]?.[index]?.y))
			scaleString += `scaleY(${scaleObj[category][index].y / 100}) `;

		if (
			!scaleString &&
			index === 'hover' &&
			(isNumber(scaleObj?.[category]?.normal?.x) ||
				isNumber(scaleObj?.[category]?.normal?.y))
		)
			scaleString += 'scale(1) ';
		return scaleString;
	};

	const getTranslateString = (translateObj, category, index) => {
		let translateString = '';
		if (isEmpty(translateObj)) return translateString;
		if (index === 'hover' && !translateObj?.[category]?.['hover-status'])
			return getTranslateString(translateObj, category, 'normal');

		if (isNumber(translateObj?.[category]?.[index]?.x))
			translateString += `translateX(${translateObj[category][index].x}${
				translateObj[category][index]['x-unit'] ?? '%'
			}) `;
		if (isNumber(translateObj?.[category]?.[index]?.y))
			translateString += `translateY(${translateObj[category][index].y}${
				translateObj[category][index]['y-unit'] ?? '%'
			}) `;

		if (
			!translateString &&
			index === 'hover' &&
			(isNumber(translateObj?.[category]?.normal?.x) ||
				isNumber(translateObj?.[category]?.normal?.y))
		)
			translateString += 'translate(0) ';

		return translateString;
	};

	const getRotateString = (rotateObj, category, index) => {
		let rotateString = '';
		if (isEmpty(rotateObj)) return rotateString;
		if (index === 'hover' && !rotateObj?.[category]?.['hover-status'])
			return getRotateString(rotateObj, category, 'normal');

		if (isNumber(rotateObj?.[category]?.[index]?.x))
			rotateString += `rotateX(${rotateObj[category][index].x}deg) `;
		if (isNumber(rotateObj?.[category]?.[index]?.y))
			rotateString += `rotateY(${rotateObj[category][index].y}deg) `;
		if (isNumber(rotateObj?.[category]?.[index]?.z))
			rotateString += `rotateZ(${rotateObj[category][index].z}deg) `;

		if (
			!rotateString &&
			index === 'hover' &&
			(isNumber(rotateObj?.[category]?.normal?.x) ||
				isNumber(rotateObj?.[category]?.normal?.y) ||
				isNumber(rotateObj?.[category]?.normal?.z))
		)
			rotateString += 'rotate(0) ';

		return rotateString;
	};

	const getOriginString = (originObj, category, index) => {
		let originString = '';

		if (
			isEmpty(originObj) ||
			(index === 'hover' && !originObj?.[category]?.['hover-status'])
		)
			return originString;

		if (isString(validateOriginValue(originObj?.[category]?.[index]?.x)))
			originString += `${originValueToNumber(
				originObj[category][index].x
			)}% `;
		if (isString(validateOriginValue(originObj?.[category]?.[index]?.y)))
			originString += `${originValueToNumber(
				originObj[category][index].y
			)}% `;

		if (isNumber(validateOriginValue(originObj?.[category]?.[index]?.x)))
			originString += `${originObj[category][index].x}${
				originObj[category][index]['x-unit'] ?? '%'
			} `;
		if (isNumber(validateOriginValue(originObj?.[category]?.[index]?.y)))
			originString += `${originObj[category][index].y}${
				originObj[category][index]['y-unit'] ?? '%'
			} `;

		if (
			!originString &&
			index === 'hover' &&
			(validateOriginValue(originObj?.[category]?.normal?.x) ||
				validateOriginValue(originObj?.[category]?.normal?.y))
		)
			originString += '50% 50% ';

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
