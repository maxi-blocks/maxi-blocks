/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getCircleBarStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	if (
		!obj['number-counter-palette-circle-bar-color-status'] &&
		!isNil(obj['number-counter-circle-bar-color'])
	)
		response.general.stroke = obj['number-counter-circle-bar-color'];
	else if (
		obj['number-counter-palette-circle-bar-color-status'] &&
		obj['number-counter-palette-circle-bar-color']
	)
		response.general.stroke = getColorRGBAString({
			firstVar: `color-${obj['number-counter-palette-circle-bar-color']}`,
			opacity: obj['number-counter-palette-circle-bar-opacity'],
			blockStyle,
		});

	return { numberCounterCircleBar: response };
};

const getCircleBackgroundStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	if (
		!obj['number-counter-palette-circle-background-color-status'] &&
		!isNil(obj['number-counter-circle-background-color'])
	)
		response.general.stroke = obj['number-counter-circle-background-color'];
	else if (
		obj['number-counter-palette-circle-background-color-status'] &&
		obj['number-counter-palette-circle-background-color']
	)
		response.general.stroke = getColorRGBAString({
			firstVar: `color-${obj['number-counter-palette-circle-background-color']}`,
			opacity: obj['number-counter-palette-circle-background-opacity'],
			blockStyle,
		});

	return { numberCounterBackground: response };
};

const getTextStyles = (obj, blockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	if (
		!obj['number-counter-palette-text-color-status'] &&
		!isNil(obj['number-counter-text-color'])
	)
		response.general.stroke = obj['number-counter-text-color'];
	else if (
		obj['number-counter-palette-text-color-status'] &&
		obj['number-counter-palette-text-color']
	)
		response.general.fill = getColorRGBAString({
			firstVar: `color-${obj['number-counter-palette-text-color']}`,
			opacity: obj['number-counter-palette-text-opacity'],
			blockStyle,
		});

	if (!isNil(obj['number-counter-title-font-family']))
		response.general['font-family'] =
			obj['number-counter-title-font-family'];

	if (!isNil(obj['number-counter-title-font-size']))
		response.general[
			'font-size'
		] = `${obj['number-counter-title-font-size']}px`;

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
		[` ${target} .maxi-number-counter__box__text sup`]: getSupStyles(
			obj,
			blockStyle
		),
	};

	return response;
};

export default getNumberCounterStyles;
