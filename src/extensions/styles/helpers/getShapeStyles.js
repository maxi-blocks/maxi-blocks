/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getAttributesValue from '../../attributes/getAttributesValue';

const getShapeStyles = (obj, target, blockStyle) => {
	const response = {
		label: 'Shape',
		general: {},
	};

	if (target === 'svg' && !isNil(obj['shape-width'])) {
		const [shapeWidth, shapeWidthUnit] = getAttributesValue({
			target: ['shape-width', 'shape-width-unit'],
			props: obj,
		});

		response.general['max-width'] = `${shapeWidth}${shapeWidthUnit}`;
		response.general['max-height'] = `${shapeWidth}${shapeWidthUnit}`;
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
