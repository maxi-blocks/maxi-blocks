/**
 * Internal dependencies
 */
import defaultBoxShadow from '../defaults/boxShadow';
import defaultBoxShadowHover from '../defaults/boxShadowHover';
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { round, isNumber, isNil } from 'lodash';
import getAttributeValue from '../getAttributeValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getPrevBreakpoint = breakpoint =>
	breakpoints[breakpoints.indexOf(breakpoint) - 1];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getBoxShadowStyles = ({
	obj,
	isHover = false,
	dropShadow = false,
	prefix = '',
	blockStyle,
}) => {
	const response = {};
	const defaultObj = isHover ? defaultBoxShadowHover : defaultBoxShadow;

	breakpoints.forEach(breakpoint => {
		let boxShadowString = '';

		const getValue = target => {
			const value = getAttributeValue({
				target,
				props: obj,
				isHover,
				prefix: `${prefix}box-shadow-`,
				breakpoint,
			});

			const defaultValue =
				breakpoint === 'general'
					? defaultObj[
							`box-shadow-${target}-${breakpoint}${
								isHover ? '-hover' : ''
							}`
					  ].default ||
					  defaultBoxShadow[`box-shadow-${target}-${breakpoint}`]
							.default
					: getLastBreakpointAttribute({
							target: `${prefix}box-shadow-${target}`,
							breakpoint: getPrevBreakpoint(breakpoint),
							attributes: obj,
							isHover,
					  });

			return {
				value,
				defaultValue,
			};
		};

		// Horizontal
		const { value: horizontal, defaultValue: defaultHorizontal } =
			getValue('horizontal');

		// Vertical
		const { value: vertical, defaultValue: defaultVertical } =
			getValue('vertical');

		// Blur
		const { value: blur, defaultValue: defaultBlur } = getValue('blur');

		// Spread
		const { value: spread, defaultValue: defaultSpread } =
			getValue('spread');

		// Horizontal Unit
		const { value: horizontalUnit, defaultValue: defaultHorizontalUnit } =
			getValue('horizontal-unit');

		// Vertical Unit
		const { value: verticalUnit, defaultValue: defaultVerticalUnit } =
			getValue('vertical-unit');

		// Blur Unit
		const { value: blurUnit, defaultValue: defaultBlurUnit } =
			getValue('blur-unit');

		// Spread Unit
		const { value: spreadUnit, defaultValue: defaultSpreadUnit } =
			getValue('spread-unit');

		// Palette
		const paletteStatus = getLastBreakpointAttribute({
			target: `${prefix}box-shadow-palette-status`,
			breakpoint,
			attributes: obj,
			isHover,
		});

		// Color
		const { value: paletteColor, defaultValue: defaultColor } =
			paletteStatus ? getValue('palette-color') : getValue('color');

		const color =
			paletteStatus && paletteColor
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: getValue('palette-opacity').value,
						blockStyle,
				  })
				: paletteColor;

		const isNotDefault =
			(isNumber(horizontal) &&
				horizontal !== 0 &&
				horizontal !== defaultHorizontal) ||
			(isNumber(vertical) &&
				vertical !== 0 &&
				vertical !== defaultVertical) ||
			(isNumber(blur) && blur !== 0 && blur !== defaultBlur) ||
			(isNumber(spread) && spread !== 0 && spread !== defaultSpread) ||
			(!isNil(horizontalUnit) &&
				horizontalUnit !== defaultHorizontalUnit) ||
			(!isNil(verticalUnit) && verticalUnit !== defaultVerticalUnit) ||
			(!isNil(blurUnit) && blurUnit !== defaultBlurUnit) ||
			(!isNil(spreadUnit) && spreadUnit !== defaultSpreadUnit);

		const horizontalValue = isNumber(horizontal)
			? horizontal
			: defaultHorizontal;
		const verticalValue = isNumber(vertical) ? vertical : defaultVertical;

		if (isNotDefault && dropShadow) {
			const blurValue = isNumber(blur)
				? round(blur / 3)
				: round(defaultBlur / 3);

			boxShadowString += `${horizontalValue || 0}${
				horizontalUnit || 'px'
			} `;
			boxShadowString += `${verticalValue || 0}${verticalUnit || 'px'} `;
			boxShadowString += `${blurValue || 0}${blurUnit || 'px'} `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				filter: `drop-shadow(${boxShadowString.trim()})`,
			};
		} else if (isNotDefault) {
			const blurValue = isNumber(blur) ? blur : defaultBlur;
			const spreadValue = isNumber(spread) ? spread : defaultSpread;

			boxShadowString += `${horizontalValue || 0}${
				horizontalUnit || 'px'
			} `;
			boxShadowString += `${verticalValue || 0}${verticalUnit || 'px'} `;
			boxShadowString += `${blurValue || 0}${blurUnit || 'px'} `;
			boxShadowString += `${spreadValue || 0}${spreadUnit || 'px'} `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				'box-shadow': `${boxShadowString.trim()}`,
			};
		}
	});

	return response;
};

export default getBoxShadowStyles;
