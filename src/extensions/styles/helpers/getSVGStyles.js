/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil, isEmpty, isBoolean } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getSVGWidthStyles = obj => {
	const response = {
		label: 'SVG width',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const svgWidth = obj[`svg-width-${breakpoint}`];
		const svgResponsive = obj[`svg-responsive-${breakpoint}`];

		if (!isNil(svgWidth))
			response[
				breakpoint
			].width = `${svgWidth}${getLastBreakpointAttribute(
				'svg-width-unit',
				breakpoint,
				obj
			)}`;

		if (isBoolean(svgResponsive))
			response[breakpoint]['max-width'] = svgResponsive ? '100%' : 'none';

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGWidth: response };
};

const getSVGPathStyles = obj => {
	const response = {
		label: 'SVG path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (!isNil(obj[`svg-stroke-${breakpoint}`])) {
			response[breakpoint]['stroke-width'] = `${
				obj[`svg-stroke-${breakpoint}`]
			}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGPath: response };
};

const getSVGPathFillStyles = (obj, blockStyle) => {
	const response = {
		label: 'SVG path-fill',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({ obj, prefix: 'svg-fill-' });

	if (paletteStatus && paletteColor)
		response.general.fill = getColorRGBAString({
			firstVar: 'icon-fill',
			secondVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	else if (!paletteStatus && !isNil(color)) response.general.fill = color;

	return { SVGPathFill: response };
};

const getSVGPathStrokeStyles = (obj, blockStyle) => {
	const response = {
		label: 'SVG',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({ obj, prefix: 'svg-line-' });

	if (paletteStatus && paletteColor)
		response.general.stroke = getColorRGBAString({
			firstVar: 'icon-line',
			secondVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	else if (!paletteStatus && !isNil(color)) response.general.stroke = color;

	return { SVGPathStroke: response };
};

export const getSVGStyles = ({ obj, target, blockStyle }) => {
	const response = {
		[` ${target} svg path`]: getSVGPathStyles(obj),
		[` ${target} svg path[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle),
		[` ${target} svg path[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(obj, blockStyle),
		[` ${target} svg g[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle),
		[` ${target} svg g[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(obj, blockStyle),
		[` ${target} svg use[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle),
		[` ${target} svg use[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(obj, blockStyle),
	};

	return response;
};
