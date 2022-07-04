/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../getPaletteAttributes';
/**
 * External dependencies
 */
import { isNil } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getCircleBarStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: 'number-counter-circle-bar-',
				breakpoint,
			});
		if (!paletteStatus && !isNil(color)) {
			return color;
		}
		if (paletteStatus && paletteColor) {
			return getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			stroke: getColor(breakpoint),
		};
	});

	return { numberCounterCircleBar: response };
};

const getCircleBackgroundStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix: 'number-counter-circle-background-',
		});

	if (!paletteStatus && !isNil(color)) response.general.stroke = color;
	else if (paletteStatus && paletteColor)
		response.general.stroke = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});

	return { numberCounterBackground: response };
};

const getTextStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	const typeOfStyle = obj['number-counter-circle-status'] ? 'color' : 'fill';

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: 'number-counter-text-',
				breakpoint,
			});
		if (!paletteStatus && !isNil(color)) return color;
		if (paletteStatus && paletteColor)
			return getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(!isNil(obj[`number-counter-title-font-size-${breakpoint}`]) && {
				'font-size': `${
					obj[`number-counter-title-font-size-${breakpoint}`]
				}px`,
			}),
			...(!isNil(obj[`font-family-${breakpoint}`]) && {
				'font-family': `${obj[`font-family-${breakpoint}`]}`,
			}),
			...(!isNil(obj[`font-weight-${breakpoint}`]) && {
				'font-weight': `${obj[`font-weight-${breakpoint}`]}`,
			}),
			[typeOfStyle]: getColor(breakpoint),
		};
	});

	return { numberCounterText: response };
};

const getSupStyles = obj => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		if (!isNil(obj[`number-counter-title-font-size-${breakpoint}`]))
			response.general['font-size'] = `${
				obj[`number-counter-title-font-size-${breakpoint}`] / 1.5
			}px`;
	});

	return { numberCounterSup: response };
};

const getNumberCounterStyles = ({ obj, target, blockStyle }) => {
	const response = {
		[` ${target} .maxi-number-counter__box__circle`]: getCircleBarStyles(
			obj,
			blockStyle
		),
		[` ${target} .maxi-number-counter__box__background`]:
			getCircleBackgroundStyles(obj, blockStyle),
		[` ${target} .maxi-number-counter__box__text`]: getTextStyles(
			obj,
			blockStyle
		),
		[` ${target} .maxi-number-counter__box__text tspan`]: getSupStyles(
			obj,
			blockStyle
		),
	};

	return response;
};

export default getNumberCounterStyles;
