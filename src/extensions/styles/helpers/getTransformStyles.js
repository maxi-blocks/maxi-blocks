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
	let transformString = '';
	let transformOriginString = '';

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

	const getScaleString = () => {
		let scaleString = '';
		if (isEmpty(scaleObj)) return scaleString;

		if (isNumber(scaleObj?.[category]?.[index]?.x))
			scaleString += `scaleX(${scaleObj[category][index].x / 100}) `;
		if (isNumber(scaleObj?.[category]?.[index]?.y))
			scaleString += `scaleY(${scaleObj[category][index].y / 100}) `;
		return scaleString;
	};

	const getTranslateString = () => {
		let translateString = '';
		if (isEmpty(translateObj)) return translateString;

		if (isNumber(translateObj?.[category]?.[index]?.x))
			translateString += `translateX(${translateObj[category][index].x}${translateObj[category][index]['x-unit']}) `;
		if (isNumber(translateObj?.[category]?.[index]?.y))
			translateString += `translateY(${translateObj[category][index].y}${translateObj[category][index]['y-unit']}) `;
		return translateString;
	};

	const getRotateString = () => {
		let rotateString = '';
		if (isEmpty(rotateObj)) return rotateString;

		if (isNumber(rotateObj?.[category]?.[index]?.x))
			rotateString += `rotateX(${rotateObj[category][index].x}deg) `;
		if (isNumber(rotateObj?.[category]?.[index]?.y))
			rotateString += `rotateY(${rotateObj[category][index].y}deg) `;
		if (isNumber(rotateObj?.[category]?.[index]?.z))
			rotateString += `rotateZ(${rotateObj[category][index].z}deg) `;
		return rotateString;
	};

	transformString += getScaleString();
	transformString += getTranslateString();
	transformString += getRotateString();

	if (isString(validateOriginValue(originObj?.[category]?.[index]?.x)))
		transformOriginString += `${originValueToNumber(
			originObj[category][index].x
		)}% `;
	if (isString(validateOriginValue(originObj?.[category]?.[index]?.y)))
		transformOriginString += `${originValueToNumber(
			originObj[category][index].y
		)}% `;

	if (isNumber(validateOriginValue(originObj?.[category]?.[index]?.x)))
		transformOriginString += `${originObj[category][index].x}${originObj[category][index]['x-unit']} `;
	if (isNumber(validateOriginValue(originObj?.[category]?.[index]?.y)))
		transformOriginString += `${originObj[category][index].y}${originObj[category][index]['y-unit']} `;

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
