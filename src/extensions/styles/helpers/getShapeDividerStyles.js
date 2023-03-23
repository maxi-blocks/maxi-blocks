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
import getAttributeKey from '../getAttributeKey';

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

		if (
			!isNil(
				obj[
					getAttributeKey(
						`shape-divider-${location}-height`,
						false,
						false,
						breakpoint
					)
				]
			)
		)
			response[breakpoint].height = `${
				obj[
					getAttributeKey(
						`shape-divider-${location}-height`,
						false,
						false,
						breakpoint
					)
				]
			}${
				obj[
					getAttributeKey(
						`shape-divider-${location}-height-unit`,
						false,
						false,
						breakpoint
					)
				] ?? 'px'
			}`;
		if (
			!isNil(
				obj[
					getAttributeKey(
						`shape-divider-${location}-opacity`,
						false,
						false,
						breakpoint
					)
				]
			)
		)
			response[breakpoint].opacity =
				obj[
					getAttributeKey(
						`shape-divider-${location}-opacity`,
						false,
						false,
						breakpoint
					)
				];
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
