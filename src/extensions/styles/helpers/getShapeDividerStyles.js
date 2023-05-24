/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';
import getMarginPaddingStyles from './getMarginPaddingStyles';
import getGroupAttributes from '../../attributes/getGroupAttributes';
import getAttributeKey from '../../attributes/getAttributeKey';

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

		if (
			!isNil(
				obj[getAttributeKey({ key: `sd${location[0]}_h`, breakpoint })]
			)
		)
			response[breakpoint].height = `${
				obj[getAttributeKey({ key: `sd${location[0]}_h`, breakpoint })]
			}${
				obj[
					getAttributeKey({ key: `sd${location[0]}_h.u`, breakpoint })
				] ?? 'px'
			}`;
		if (
			!isNil(
				obj[getAttributeKey({ key: `sd${location[0]}_o`, breakpoint })]
			)
		)
			response[breakpoint].opacity =
				obj[getAttributeKey({ key: `sd${location[0]}_o`, breakpoint })];
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
				prefix: `sd${location[0]}-`,
				breakpoint,
			});

		if (!paletteStatus && !isNil(color)) {
			response[breakpoint].fill = color;
		} else if (paletteStatus && paletteColor) {
			response[breakpoint].fill = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		}
	});

	return response;
};
