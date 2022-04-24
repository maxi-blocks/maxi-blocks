/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getCircleBarStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({ obj, prefix: 'number-counter-circle-bar-' });

	if (!paletteStatus && !isNil(color)) {
		response.general.stroke = color;
	} else if (paletteStatus && paletteColor) {
		response.general.stroke = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: obj[paletteOpacity],
			blockStyle,
		});
	}

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

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({ obj, prefix: 'number-counter-text-' });

	const typeOfStyle = obj['number-counter-circle-status'] ? 'color' : 'fill';

	if (!paletteStatus && !isNil(color)) response.general[typeOfStyle] = color;
	else if (paletteStatus && paletteColor)
		response.general[typeOfStyle] = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});

	if (!isNil(obj['number-counter-title-font-family']))
		response.general['font-family'] =
			obj['number-counter-title-font-family'];

	if (!isNil(obj['number-counter-title-font-size']))
		response.general[
			'font-size'
		] = `${obj['number-counter-title-font-size']}px`;

	if (!isNil(obj['number-counter-title-font-weight']))
		response.general['font-weight'] =
			obj['number-counter-title-font-weight'];

	return { numberCounterText: response };
};

const getSupStyles = obj => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	if (!isNil(obj['number-counter-title-font-size']))
		response.general['font-size'] = `calc(${
			obj['number-counter-title-font-size'] / 1.5
		}px)`;

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
