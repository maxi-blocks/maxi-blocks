/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../getPaletteAttributes';
import getMarginPaddingStyles from './getMarginPaddingStyles';
import getGroupAttributes from '../getGroupAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

export const getShapeDividerStyles = (obj, location) => {
	const response = {
		label: 'Shape Divider',
		general: {},
	};

	if (!isNil(obj[`shape-divider-${location}-opacity`]))
		response.general.opacity = obj[`shape-divider-${location}-opacity`];

	if (!isNil(obj[`shape-divider-${location}-height`]))
		response.general.height = `${obj[`shape-divider-${location}-height`]}${
			obj[`shape-divider-${location}-height-unit`]
		}`;

	const rawPositions = getMarginPaddingStyles({
		obj: {
			...getGroupAttributes(obj, 'padding'),
		},
	});

	Object.entries(rawPositions).forEach(([breakpoint, value]) => {
		const result = {};

		Object.entries(value).forEach(([pos, val]) => {
			result[pos.replace('padding-', '')] = `${
				location === 'top' ? '-' : ''
			}${val}`;
		});

		response[breakpoint] = { ...response[breakpoint], ...result };
	});

	return response;
};

export const getShapeDividerSVGStyles = (obj, location, blockStyle) => {
	const response = {
		label: 'Shape Divider SVG',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix: `shape-divider-${location}-`,
		});

	if (!paletteStatus && !isNil(color)) {
		response.general.fill = color;
	} else if (paletteStatus && paletteColor) {
		response.general.fill = getColorRGBAString({
			firstVar: `color-${paletteColor}`,
			opacity: obj[paletteOpacity],
			blockStyle: blockStyle,
		});
	}

	return response;
};
