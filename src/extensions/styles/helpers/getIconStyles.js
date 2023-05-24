/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import getAttributeKey from '../../attributes/getAttributeKey';

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

	if (isIconInherit && !obj[getAttributeKey({ key: 't.sh' })])
		return response;

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
			getPaletteAttributes({ obj, prefix: `${prefix}i-`, isHover });

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
