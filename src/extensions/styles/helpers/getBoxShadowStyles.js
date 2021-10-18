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
import { round, isNumber } from 'lodash';
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
	parentBlockStyle,
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
				prefix: 'box-shadow-',
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
					: getLastBreakpointAttribute(
							`${prefix}box-shadow-${target}`,
							getPrevBreakpoint(breakpoint),
							obj,
							isHover
					  );

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

		// Palette
		const paletteStatus = getLastBreakpointAttribute(
			`${prefix}box-shadow-palette-color-status`,
			breakpoint,
			obj,
			isHover
		);

		// Color
		const { value: paletteColor, defaultValue: defaultColor } =
			paletteStatus ? getValue('palette-color') : getValue('color');

		const color =
			paletteStatus && paletteColor
				? getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: getValue('palette-opacity').value,
						blockStyle: parentBlockStyle,
				  })
				: paletteColor;

		const isColorDefault =
			paletteStatus &&
			isNumber(paletteColor) &&
			paletteColor === defaultColor;

		const isNotDefault =
			(isNumber(horizontal) && horizontal !== defaultHorizontal) ||
			(isNumber(vertical) && vertical !== defaultVertical) ||
			(isNumber(blur) && blur !== defaultBlur) ||
			(isNumber(spread) && spread !== defaultSpread) ||
			(!!color && !isColorDefault);

		const horizontalValue = isNumber(horizontal)
			? horizontal
			: defaultHorizontal;
		const verticalValue = isNumber(vertical) ? vertical : defaultVertical;

		if (isNotDefault && dropShadow) {
			const blurValue = isNumber(blur)
				? round(blur / 3)
				: round(defaultBlur / 3);

			boxShadowString += `${horizontalValue || 0}px `;
			boxShadowString += `${verticalValue || 0}px `;
			boxShadowString += `${blurValue || 0}px `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				filter: `drop-shadow(${boxShadowString.trim()})`,
			};
		} else if (isNotDefault) {
			const blurValue = isNumber(blur) ? blur : defaultBlur;
			const spreadValue = isNumber(spread) ? spread : defaultSpread;

			boxShadowString += `${horizontalValue || 0}px `;
			boxShadowString += `${verticalValue || 0}px `;
			boxShadowString += `${blurValue || 0}px `;
			boxShadowString += `${spreadValue || 0}px `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				'box-shadow': `${boxShadowString.trim()}`,
			};
		}
	});

	return response;
};

export default getBoxShadowStyles;
