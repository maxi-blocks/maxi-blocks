/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getAttributeValue from '@extensions/styles/getAttributeValue';
import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';

/**
 * External dependencies
 */
import { isBoolean, isNil, isNumber, round, isEmpty } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getBoxShadowStyles = ({
	obj,
	isHover = false,
	dropShadow = false,
	prefix = '',
	blockStyle,
	forClipPath = false,
	isIB = false,
	uniqueID = null,
}) => {
	const response = {};
	const getPrevBreakpoint = breakpoint =>
		breakpoints[breakpoints.indexOf(breakpoint) - 1];

	const clipPathStatus = getLastBreakpointAttribute({
		target: 'clip-path-status',
		attributes: obj,
	});
	const svgElementExists = !isEmpty(obj.SVGElement);

	// Cache to store computed colors to avoid redundant getPaletteColor calls
	const colorCache = new Map();

	const getCachedColor = (paletteColor, paletteOpacity, paletteStatus) => {
		const cacheKey = `${paletteColor}-${paletteOpacity}-${paletteStatus}`;
		if (colorCache.has(cacheKey)) {
			return colorCache.get(cacheKey);
		}

		const color =
			paletteStatus && paletteColor
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle,
				  })
				: paletteColor;

		colorCache.set(cacheKey, color);
		return color;
	};

	breakpoints.forEach(breakpoint => {

		const getValue = (target, defaultPrefix = `${prefix}box-shadow-`) => {
			const value = getAttributeValue({
				target,
				props: obj,
				isHover,
				prefix: defaultPrefix,
				breakpoint,
			});

			const defaultValue =
				breakpoint === 'general'
					? getDefaultAttribute(
							`${defaultPrefix}${target}-${breakpoint}`
					  )
					: getLastBreakpointAttribute({
							target: `${defaultPrefix}${target}`,
							breakpoint: getPrevBreakpoint(breakpoint),
							attributes: obj,
							isHover,
					  });

			return { value, defaultValue };
		};

		const clipPathExists =
			(getLastBreakpointAttribute({
				target: 'clip-path',
				breakpoint,
				attributes: obj,
			}) &&
				clipPathStatus) ||
			svgElementExists;

		const defaultClipPathExists =
			breakpoint !== 'general' &&
			((getLastBreakpointAttribute({
				target: 'clip-path',
				breakpoint: getPrevBreakpoint(breakpoint),
				attributes: obj,
			}) &&
				clipPathStatus) ||
				svgElementExists);

		const values = [
			'inset',
			'horizontal',
			'vertical',
			'blur',
			'spread',
			'horizontal-unit',
			'vertical-unit',
			'blur-unit',
			'spread-unit',
		].reduce((acc, key) => {
			acc[key] = getValue(key);
			return acc;
		}, {});

		const paletteStatus = getLastBreakpointAttribute({
			target: `${prefix}box-shadow-palette-status`,
			breakpoint,
			attributes: obj,
			isHover,
		});

		const { value: paletteColor, defaultValue: defaultPaletteColor } =
			paletteStatus ? getValue('palette-color') : getValue('color');

		const { value: paletteOpacity, defaultValue: defaultPaletteOpacity } =
			getValue('palette-opacity');

		const defaultColor = getCachedColor(
			defaultPaletteColor,
			defaultPaletteOpacity,
			true
		);

		const color = getCachedColor(paletteColor, paletteOpacity, paletteStatus);

		const isNotDefault =
			(breakpoint === 'general' && isIB) ||
			(breakpoint !== 'general' &&
				clipPathExists !== defaultClipPathExists &&
				prefix === 'image-' &&
				clipPathExists) ||
			(isBoolean(values.inset?.value) &&
				values.inset?.value !== values.inset?.defaultValue) ||
			(isNumber(values.horizontal?.value) &&
				values.horizontal?.value !== 0 &&
				values.horizontal?.value !== values.horizontal?.defaultValue) ||
			(isNumber(values.vertical?.value) &&
				values.vertical?.value !== 0 &&
				values.vertical?.value !== values.vertical?.defaultValue) ||
			(isNumber(values.blur?.value) &&
				values.blur?.value !== 0 &&
				values.blur?.value !== values.blur?.defaultValue) ||
			(isNumber(values.spread?.value) &&
				values.spread?.value !== 0 &&
				values.spread?.value !== values.spread?.defaultValue) ||
			(!isNil(values['horizontal-unit']?.value) &&
				values['horizontal-unit']?.value !==
					values['horizontal-unit']?.defaultValue) ||
			(!isNil(values['vertical-unit']?.value) &&
				values['vertical-unit']?.value !==
					values['vertical-unit']?.defaultValue) ||
			(!isNil(values['blur-unit']?.value) &&
				values['blur-unit']?.value !==
					values['blur-unit']?.defaultValue) ||
			(!isNil(values['spread-unit']?.value) &&
				values['spread-unit']?.value !==
					values['spread-unit']?.defaultValue) ||
			(!isNil(color) && color !== defaultColor);

		if (!isNotDefault) return;

		const horizontalValue = isNumber(values.horizontal?.value)
			? values.horizontal.value
			: values.horizontal?.defaultValue;
		const verticalValue = isNumber(values.vertical?.value)
			? values.vertical.value
			: values.vertical?.defaultValue;

		let boxShadowString = '';

		if (dropShadow) {
			const blurValue = round(
				(isNumber(values.blur?.value)
					? values.blur.value
					: values.blur?.defaultValue ?? 0) / 3
			);

			boxShadowString = `${horizontalValue || 0}${
				values['horizontal-unit']?.value || 'px'
			} ${verticalValue || 0}${values['vertical-unit']?.value || 'px'} ${
				blurValue || 0
			}${values['blur-unit']?.value || 'px'} ${color || defaultColor}`;

			if (!(forClipPath && !clipPathExists)) {
				response[breakpoint] = {
					filter: `drop-shadow(${boxShadowString})`,
				};
			}
		} else {
			const blurValue = isNumber(values.blur?.value)
				? values.blur.value
				: values.blur?.defaultValue ?? 0;
			const spreadValue = isNumber(values.spread?.value)
				? values.spread.value
				: values.spread?.defaultValue;
			const insetValue = isBoolean(values.inset?.value)
				? values.inset.value
				: values.inset?.defaultValue;

			boxShadowString = '';

			if (isBoolean(insetValue) && insetValue) {
				boxShadowString += 'inset ';
			}

			boxShadowString += `${horizontalValue || 0}${
				values['horizontal-unit']?.value || 'px'
			} ${verticalValue || 0}${values['vertical-unit']?.value || 'px'} ${
				blurValue || 0
			}${values['blur-unit']?.value || 'px'} ${spreadValue || 0}${
				values['spread-unit']?.value || 'px'
			} ${color || defaultColor}`;

			if (!(prefix === 'image-' && clipPathExists)) {
				response[breakpoint] = {
					'box-shadow': boxShadowString.trim(),
				};
			} else {
				response[breakpoint] = {
					'box-shadow': 'none',
				};
			}
		}
	});

	return response;
};

export default getBoxShadowStyles;
