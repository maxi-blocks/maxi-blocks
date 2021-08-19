/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getSvgStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'SVG',
		general: {},
	};

	if (target === 'svg' && !isNil(obj['svg-width'])) {
		response.general.maxWidth = `${obj['svg-width']}${obj['svg-width-unit']}`;
		response.general.maxHeight = `${obj['svg-width']}${obj['svg-width-unit']}`;
	}

	if (target === 'path' && !isNil(obj['svg-stroke'])) {
		response.general['stroke-width'] = `${obj['svg-stroke']}`;
	}

	if (target === 'path-fill') {
		if (
			obj['svg-palette-fill-color-status'] &&
			obj['svg-palette-fill-color']
		)
			response.general.fill = getColorRGBAString({
				firstVar: 'icon-fill',
				secondVar: `color-${obj['svg-palette-fill-color']}`,
				opacity: obj['svg-palette-fill-opacity'],
				blockStyle: parentBlockStyle,
			});
		else if (
			!obj['svg-palette-fill-color-status'] &&
			!isNil(obj['svg-fill-color'])
		)
			response.general.fill = obj['svg-fill-color'];
	}

	if (target === 'path-stroke') {
		if (
			obj['svg-palette-line-color-status'] &&
			obj['svg-palette-line-color']
		)
			response.general.stroke = getColorRGBAString({
				firstVar: 'icon-line',
				secondVar: `color-${obj['svg-palette-line-color']}`,
				opacity: obj['svg-palette-line-opacity'],
				blockStyle: parentBlockStyle,
			});
		else if (
			!obj['svg-palette-line-color-status'] &&
			!isNil(obj['svg-line-color'])
		)
			response.general.stroke = obj['svg-line-color'];
	}

	return response;
};

export default getSvgStyles;
