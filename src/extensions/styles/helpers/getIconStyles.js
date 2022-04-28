/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getIconStyles = (
	obj,
	blockStyle,
	isIconInherit = true,
	isHover = false
) => {
	const response = {
		label: 'Icon',
		general: {},
	};

	if (isIconInherit) {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: '',
				isHover,
				breakpoint: 'general',
			});
		response.general.fill = 'none';

		if (!paletteStatus && color) {
			response.general.stroke = color;
		} else if (paletteStatus && paletteColor) {
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}
	} else {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({ obj, prefix: 'icon-', isHover });

		if (!paletteStatus && !isNil(color)) {
			response.general.stroke = color;
		} else if (paletteStatus && paletteColor) {
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: obj[paletteOpacity],
				blockStyle,
			});
		}
	}

	return response;
};

export default getIconStyles;
