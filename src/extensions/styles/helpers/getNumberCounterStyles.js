/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getNumberCounterStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'Number Counter',
		general: {},
	};

	if (target === 'circle-bar') {
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
				blockStyle: parentBlockStyle,
			});
	}

	if (target === 'circle-background') {
		if (
			!obj['number-counter-palette-circle-background-color-status'] &&
			!isNil(obj['number-counter-circle-background-color'])
		)
			response.general.stroke =
				obj['number-counter-circle-background-color'];
		else if (
			obj['number-counter-palette-circle-background-color-status'] &&
			obj['number-counter-palette-circle-background-color']
		)
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${obj['number-counter-palette-circle-background-color']}`,
				opacity:
					obj['number-counter-palette-circle-background-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	if (target === 'text') {
		if (
			!obj['number-counter-palette-text-color-status'] &&
			!isNil(obj['number-counter-text-color'])
		)
			response.general.stroke = obj['number-counter-text-color'];
		else if (
			obj['number-counter-palette-text-color-status'] &&
			obj['number-counter-palette-text-color']
		)
			response.general.color = getColorRGBAString({
				firstVar: `color-${obj['number-counter-palette-text-color']}`,
				opacity: obj['number-counter-palette-text-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	if (target === 'text' && !isNil(obj['number-counter-title-font-family']))
		response.general['font-family'] =
			obj['number-counter-title-font-family'];

	if (target === 'text' && !isNil(obj['number-counter-title-font-size']))
		response.general[
			'font-size'
		] = `${obj['number-counter-title-font-size']}px`;

	if (target === 'sup' && !isNil(obj['number-counter-title-font-size']))
		response.general['font-size'] = `calc(${
			obj['number-counter-title-font-size'] / 1.5
		}px)`;

	return response;
};

export default getNumberCounterStyles;
