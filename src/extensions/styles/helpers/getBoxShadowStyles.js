/**
 * Internal dependencies
 */
import defaultBoxShadow from '../defaults/boxShadow';
import defaultBoxShadowHover from '../defaults/boxShadowHover';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { round, isNumber } from 'lodash';

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
	parentBlockStyle,
}) => {
	const response = {};
	const defaultObj = isHover ? defaultBoxShadowHover : defaultBoxShadow;

	breakpoints.forEach(breakpoint => {
		let boxShadowString = '';

		const getValue = target => {
			const value =
				obj[
					`box-shadow-${target}-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				] || obj[`box-shadow-${target}-${breakpoint}`];
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
							`box-shadow-${target}`,
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
			'box-shadow-palette-color-status',
			breakpoint,
			obj,
			isHover
		);

		// Color
		const { value: paletteColor, defaultValue: defaultColor } =
			paletteStatus ? getValue('palette-color') : getValue('color');

		const color =
			paletteStatus && paletteColor
				? `var(--maxi-${parentBlockStyle}-color-${paletteColor})`
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

		if (isNotDefault && dropShadow) {
			const blurValue = round(blur / 3);
			const defaultBlurValue = round(defaultBlur / 3);

			boxShadowString += `${horizontal || defaultHorizontal || 0}px `;
			boxShadowString += `${vertical || defaultVertical || 0}px `;
			boxShadowString += `${blurValue || defaultBlurValue || 0}px `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				filter: `drop-shadow(${boxShadowString.trim()})`,
			};
		} else if (isNotDefault) {
			boxShadowString += `${horizontal || defaultHorizontal || 0}px `;
			boxShadowString += `${vertical || defaultVertical || 0}px `;
			boxShadowString += `${blur || defaultBlur || 0}px `;
			boxShadowString += `${spread || defaultSpread || 0}px `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				'box-shadow': `${boxShadowString.trim()}`,
			};
		}
	});

	return response;
};

export default getBoxShadowStyles;
