/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';

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

	// Early return if conditions are not met
	if (isIconInherit && !obj['typography-status-hover']) return response;

	const paletteAttributes = getPaletteAttributes({
		obj,
		prefix: isIconInherit ? prefix : `${prefix}icon-`,
		isHover,
		breakpoint: isIconInherit ? 'general' : undefined,
	});

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		paletteAttributes;

	if (!isShape) {
		if (!paletteStatus && !isNil(color)) {
			response.general.stroke = color;
		} else if (paletteStatus && paletteColor) {
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: isIconInherit ? paletteOpacity : obj[paletteOpacity],
				blockStyle,
			});
		}
	}

	return response;
};

export default getIconStyles;
