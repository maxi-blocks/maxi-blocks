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
	isHover = false,
	prefix = '',
	iconType = ''
) => {
	const response = {
		label: 'Icon',
		general: {},
	};

	const isShape = iconType !== 'shape';

	if (isIconInherit && !obj['typography-status-hover']) return response;

	if (isIconInherit) {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix,
				isHover,
				breakpoint: 'general',
			});
		response.general.fill = 'none';

		if (!isShape && !paletteStatus && color) {
			response.general.stroke = color;
		} else if (!isShape && paletteStatus && paletteColor) {
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}
	} else {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({ obj, prefix: `${prefix}icon-`, isHover });

		if (!isShape && !paletteStatus && !isNil(color)) {
			response.general.stroke = color;
		} else if (!isShape && paletteStatus && paletteColor) {
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
