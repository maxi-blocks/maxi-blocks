/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getMapStyles = (obj, target, blockStyle) => {
	const response = {
		label: 'Map',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix: `map-marker-${target}-`,
		});

	if (!paletteStatus && !isNil(color)) response.general.color = color;
	else if (paletteStatus && paletteColor)
		response.general.color = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});

	return response;
};

export default getMapStyles;
