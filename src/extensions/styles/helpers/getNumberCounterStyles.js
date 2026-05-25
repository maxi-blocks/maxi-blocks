/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';
/**
 * External dependencies
 */
import { isNil } from 'lodash';
import { __ } from '@wordpress/i18n';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const LEGACY_DEFAULT_FONT_FAMILY = 'Roboto';

const isLegacyDefaultFontFamily = fontFamily =>
	fontFamily?.replaceAll('"', '').trim() === LEGACY_DEFAULT_FONT_FAMILY;

const getSCColourString = ({
	obj,
	prefix,
	breakpoint,
	blockStyle,
	scVariable,
}) => {
	const { paletteStatus, paletteSCStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix,
			breakpoint,
		});

	if (paletteStatus && paletteColor) {
		const paletteVariable = `color-${paletteColor}`;
		const shouldUseStyleCardVariable = !paletteSCStatus;

		return getColorRGBAString({
			firstVar: shouldUseStyleCardVariable
				? scVariable
				: paletteVariable,
			...(shouldUseStyleCardVariable && {
				secondVar: paletteVariable,
			}),
			opacity: paletteOpacity,
			blockStyle,
		});
	}

	return color || null;
};

const getCircleBarStyles = (obj, blockStyle) => {
	const response = {
		label: __('Number Counter', 'maxi-blocks'),
		general: {},
	};

	const getColor = breakpoint => {
		return getSCColourString({
			obj,
			prefix: 'number-counter-circle-bar-',
			breakpoint,
			blockStyle,
			scVariable: 'number-counter-circle-bar',
		});
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = { stroke: getColor(breakpoint) };
	});

	return { numberCounterCircleBar: response };
};

const getCircleBackgroundStyles = (obj, blockStyle) => {
	const response = {
		label: __('Number Counter', 'maxi-blocks'),
		general: {},
	};

	const color = getSCColourString({
		obj,
		prefix: 'number-counter-circle-background-',
		blockStyle,
		scVariable: 'number-counter-circle-background',
	});

	if (!isNil(color)) response.general.stroke = color;

	return { numberCounterBackground: response };
};

const getTextStyles = (obj, blockStyle) => {
	const response = {
		label: __('Number Counter', 'maxi-blocks'),
		general: {},
	};

	const getColor = breakpoint => {
		return getSCColourString({
			obj,
			prefix: 'number-counter-text-',
			breakpoint,
			blockStyle,
			scVariable: 'number-counter-color',
		});
	};

	breakpoints.forEach(breakpoint => {
		const fontFamily = obj[`font-family-${breakpoint}`];

		response[breakpoint] = {
			...(!isNil(obj[`number-counter-title-font-size-${breakpoint}`]) && {
				'font-size': `${
					obj[`number-counter-title-font-size-${breakpoint}`]
				}px`,
			}),
			...(!isNil(fontFamily) &&
				!isLegacyDefaultFontFamily(fontFamily) && {
					'font-family': `${fontFamily}`,
				}),
			...(!isNil(obj[`font-weight-${breakpoint}`]) && {
				'font-weight': `${obj[`font-weight-${breakpoint}`]}`,
			}),
			color: getColor(breakpoint),
		};
	});

	return { numberCounterText: response };
};

const getSupStyles = obj => {
	const response = {
		label: __('Number Counter', 'maxi-blocks'),
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
