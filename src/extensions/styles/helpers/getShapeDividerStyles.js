/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';
import getMarginPaddingStyles from './getMarginPaddingStyles';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getShapeDividerStyles = (obj, location) => {
	const response = {
		label: 'Shape Divider',
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (!isNil(obj[`shape-divider-${location}-height-${breakpoint}`]))
			response[breakpoint].height = `${
				obj[`shape-divider-${location}-height-${breakpoint}`]
			}${
				obj[`shape-divider-${location}-height-unit-${breakpoint}`] ??
				'px'
			}`;
		if (!isNil(obj[`shape-divider-${location}-opacity-${breakpoint}`]))
			response[breakpoint].opacity =
				obj[`shape-divider-${location}-opacity-${breakpoint}`];
	});

	const rawPositions = getMarginPaddingStyles({
		obj: {
			...getGroupAttributes(obj, 'padding'),
		},
	});

	Object.entries(rawPositions).forEach(([breakpoint, value]) => {
		const result = {};

		Object.entries(value).forEach(([pos, val]) => {
			if (pos.replace('padding-', '') === location)
				result[pos.replace('padding-', '')] = `-${val}`;
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

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: `shape-divider-${location}-`,
				breakpoint,
			});

		if (!paletteStatus && !isNil(color)) {
			response[breakpoint].fill = color;
		} else if (paletteStatus && paletteColor) {
			response[breakpoint].fill = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: obj[paletteOpacity],
				blockStyle,
			});
		}
	});

	return response;
};
