/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getShapeStyles = (obj, target, blockStyle) => {
	const response = {
		label: 'Shape',
		general: {},
	};

	if (target === 'svg' && !isNil(obj['shape-width'])) {
		response.general[
			'max-width'
		] = `${obj['shape-width']}${obj['shape-width-unit']}`;
		response.general[
			'max-height'
		] = `${obj['shape-width']}${obj['shape-width-unit']}`;
	}

	if (target === 'path') {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({ obj, prefix: 'shape-fill-' });

		if (paletteStatus && paletteColor)
			response.general.fill = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		else if (!paletteStatus && !isNil(color)) response.general.fill = color;
	}

	return response;
};

export default getShapeStyles;
