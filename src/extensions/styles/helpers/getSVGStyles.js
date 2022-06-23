/* eslint-disable default-param-last */
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

export const getSVGWidthStyles = (obj, prefix = 'svg-') => {
	const response = {
		label: 'SVG width',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const svgWidth = obj[`${prefix}width-${breakpoint}`];
		const svgResponsive = obj[`${prefix}responsive-${breakpoint}`];

		if (!isNil(svgWidth))
			response[
				breakpoint
			].width = `${svgWidth}${getLastBreakpointAttribute({
				target: `${prefix}width-unit`,
				breakpoint,
				attributes: obj,
			})}`;

		if (isBoolean(svgResponsive))
			response[breakpoint]['max-width'] = svgResponsive ? '100%' : 'none';

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGWidth: response };
};

const getSVGPathStyles = (obj, isHover, prefix = 'svg-') => {
	const response = {
		label: 'SVG path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		if (
			!isNil(
				obj[`${prefix}stroke-${breakpoint}${isHover ? '-hover' : ''}`]
			)
		) {
			response[breakpoint]['stroke-width'] = `${
				obj[`${prefix}stroke-${breakpoint}${isHover ? '-hover' : ''}`]
			}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGPath: response };
};

const getSVGPathFillStyles = (
	obj,
	blockStyle,
	prefix = 'svg-',
	isHover = false
) => {
	const response = {
		label: 'SVG path-fill',
		general: {},
	};

	console.log('fill prefix', prefix);

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({ obj, prefix: `${prefix}fill-`, isHover });

	if (paletteStatus && paletteColor)
		response.general.fill = getColorRGBAString({
			firstVar: `icon-fill${isHover ? '-hover' : ''}`,
			secondVar: `color-${paletteColor}`,
			opacity: paletteOpacity,
			blockStyle,
		});
	else if (!paletteStatus && !isNil(color)) response.general.fill = color;

	return { SVGPathFill: response };
};

const getSVGPathStrokeStyles = (
	obj,
	blockStyle,
	prefix = 'svg-',
	isHover,
	useIconColor
) => {
	const response = {
		label: 'SVG Path stroke',
		general: {},
	};

	if (isHover && !useIconColor && !obj['typography-status-hover']) {
		response.general.stroke = '';

		return response;
	}

	let linePrefix = '';

	switch (prefix) {
		case 'icon-':
			linePrefix = `${prefix}stroke-`;
			break;
		case 'navigation-arrow-both-icon-':
			linePrefix = `${prefix}stroke-`;
			break;
		case 'navigation-dot-icon-':
			linePrefix = `${prefix}stroke-`;
			break;
		default:
			linePrefix = `${prefix}line-`;
			break;
	}

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix: useIconColor ? linePrefix : '',
			isHover,
		});

	if (paletteStatus && paletteColor) {
		if (useIconColor)
			response.general.stroke = getColorRGBAString({
				firstVar: `icon-stroke${isHover ? '-hover' : ''}`,
				secondVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		else
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
	} else if (!paletteStatus && !isNil(color)) response.general.stroke = color;

	return { SVGPathStroke: response };
};

export const getSVGStyles = ({
	obj,
	target,
	blockStyle,
	prefix,
	isHover = false,
	useIconColor = true,
}) => {
	const response = {
		[` ${target} svg[data-fill]:not([fill^="none"])`]: getSVGPathFillStyles(
			obj,
			blockStyle,
			prefix,
			isHover
		),
		[` ${target} svg[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(
				obj,
				blockStyle,
				prefix,
				isHover,
				useIconColor
			),
		[` ${target} svg path`]: getSVGPathStyles(obj, prefix, isHover),
		[` ${target} svg path[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
		[` ${target} svg path[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(
				obj,
				blockStyle,
				prefix,
				isHover,
				useIconColor
			),
		[` ${target} svg g[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
		[` ${target} svg g[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(
				obj,
				blockStyle,
				prefix,
				isHover,
				useIconColor
			),
		[` ${target} svg use[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
		[` ${target} svg use[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(
				obj,
				blockStyle,
				prefix,
				isHover,
				useIconColor
			),
		[` ${target} svg circle[data-fill]:not([fill^="none"])`]:
			getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
		[` ${target} svg circle[data-stroke]:not([stroke^="none"])`]:
			getSVGPathStrokeStyles(
				obj,
				blockStyle,
				prefix,
				isHover,
				useIconColor
			),
	};

	if (isHover) {
		return {
			...response,
			...{
				[` ${target} svg[data-hover-stroke] path`]: getSVGPathStyles(
					obj,
					prefix,
					isHover
				),
				[` ${target} svg path[data-hover-stroke]`]: getSVGPathStyles(
					obj,
					prefix,
					isHover
				),
				[` ${target} svg[data-hover-fill] path:not([fill^="none"])`]:
					getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
				[` ${target} svg path[data-hover-fill]:not([fill^="none"])`]:
					getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
				[` ${target} svg g[data-hover-fill]:not([fill^="none"])`]:
					getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
				[` ${target} svg[data-hover-stroke] path:not([stroke^="none"])`]:
					getSVGPathStrokeStyles(
						obj,
						blockStyle,
						prefix,
						isHover,
						useIconColor
					),
				[` ${target} svg g[data-hover-stroke]:not([stroke^="none"])`]:
					getSVGPathStrokeStyles(
						obj,
						blockStyle,
						prefix,
						isHover,
						useIconColor
					),
				[` ${target} svg use[data-hover-fill]:not([fill^="none"])`]:
					getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
				[` ${target} svg use[data-hover-stroke]:not([stroke^="none"])`]:
					getSVGPathStrokeStyles(
						obj,
						blockStyle,
						prefix,
						isHover,
						useIconColor
					),
				[` ${target} svg circle[data-hover-fill]:not([fill^="none"])`]:
					getSVGPathFillStyles(obj, blockStyle, prefix, isHover),
			},
		};
	}

	return response;
};
