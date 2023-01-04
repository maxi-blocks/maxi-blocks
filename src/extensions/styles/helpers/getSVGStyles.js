/* eslint-disable default-param-last */
/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';
import getAttributeValue from '../getAttributeValue';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getSVGWidthStyles = ({ obj, prefix = '' }) => {
	const response = {
		label: 'SVG width',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const svgWidth = obj[`${prefix}svg-width-${breakpoint}`];

		if (!isNil(svgWidth))
			response[
				breakpoint
			].width = `${svgWidth}${getLastBreakpointAttribute({
				target: `${prefix}svg-width-unit`,
				breakpoint,
				attributes: obj,
			})}`;

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGWidth: response };
};

const getSVGPathStyles = (obj, prefix = 'svg-', isHover) => {
	const response = {
		label: 'SVG path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconStroke = getAttributeValue({
			target: 'stroke',
			prefix,
			isHover,
			breakpoint,
			props: obj,
		});

		if (!isNil(iconStroke)) {
			response[breakpoint]['stroke-width'] = iconStroke;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGPath: response };
};

const getSVGPathFillStyles = (obj, blockStyle, prefix = 'svg-', isHover) => {
	const response = {
		label: 'SVG path-fill',
		general: {},
	};

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
	useIconColor = true
) => {
	const response = {
		label: 'SVG Path stroke',
	};

	if (isHover && !useIconColor && !obj['typography-status-hover']) {
		response.general = {};
		response.general.stroke = '';

		return response;
	}

	(!useIconColor ? breakpoints : ['general']).forEach(breakpoint => {
		response[breakpoint] = {};

		const linePrefix =
			prefix === 'icon-' || prefix === 'active-icon-'
				? `${prefix}stroke-`
				: `${prefix}line-`;

		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: useIconColor ? linePrefix : '',
				...(!useIconColor && { breakpoint }),
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
				response[breakpoint].stroke = getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				});
		} else if (!paletteStatus && !isNil(color))
			response[breakpoint].stroke = color;
	});

	return { SVGPathStroke: response };
};

export const getSVGStyles = ({
	obj,
	target,
	blockStyle,
	prefix,
	isHover = false,
	useIconColor = true,
	iconType = '',
}) => {
	const pathFillStyles = getSVGPathFillStyles(
		obj,
		blockStyle,
		prefix,
		isHover
	);
	const pathStrokeStyles = getSVGPathStrokeStyles(
		obj,
		blockStyle,
		prefix,
		isHover,
		useIconColor
	);
	const pathStyles = getSVGPathStyles(obj, prefix, isHover);

	const response = {
		...(iconType !== 'line' && {
			[` ${target} svg[data-fill]:not([fill^="none"])`]: pathFillStyles,
			[` ${target} svg[data-fill]:not([fill^="none"]) *`]: pathFillStyles,
			[` ${target} svg g[data-fill]:not([fill^="none"])`]: pathFillStyles,
			[` ${target} svg use[data-fill]:not([fill^="none"])`]:
				pathFillStyles,
			[` ${target} svg circle[data-fill]:not([fill^="none"])`]:
				pathFillStyles,
			[` ${target} svg path[data-fill]:not([fill^="none"])`]:
				pathFillStyles,
		}),
		[` ${target} svg path`]: pathStyles,
		...(iconType !== 'shape' && {
			[` ${target} svg[data-stroke]:not([stroke^="none"]) *`]:
				pathStrokeStyles,
			[` ${target} svg path[data-stroke]:not([stroke^="none"])`]:
				pathStrokeStyles,
			[` ${target} svg[data-stroke]:not([stroke^="none"])`]:
				pathStrokeStyles,
			[` ${target} svg g[data-stroke]:not([stroke^="none"])`]:
				pathStrokeStyles,
			[` ${target} svg use[data-stroke]:not([stroke^="none"])`]:
				pathStrokeStyles,
			[` ${target} svg circle[data-stroke]:not([stroke^="none"])`]:
				pathStrokeStyles,
		}),
	};

	if (isHover) {
		return {
			...response,
			...{
				[` ${target} svg[data-hover-stroke] path`]: pathStyles,
				[` ${target} svg path[data-hover-stroke]`]: pathStyles,
				...(iconType !== 'line' && {
					[` ${target} svg[data-hover-fill] path:not([fill^="none"])`]:
						pathFillStyles,
					[` ${target} svg path[data-hover-fill]:not([fill^="none"])`]:
						pathFillStyles,
					[` ${target} svg g[data-hover-fill]:not([fill^="none"])`]:
						pathFillStyles,
					[` ${target} svg use[data-hover-fill]:not([fill^="none"])`]:
						pathFillStyles,
				}),
				...(iconType !== 'shape' && {
					[` ${target} svg[data-hover-stroke] path:not([stroke^="none"])`]:
						pathStrokeStyles,
					[` ${target} svg path[data-hover-stroke]:not([stroke^="none"])`]:
						pathStrokeStyles,
					[` ${target} svg g[data-hover-stroke]:not([stroke^="none"])`]:
						pathStrokeStyles,
					[` ${target} svg use[data-hover-stroke]:not([stroke^="none"])`]:
						pathStrokeStyles,
				}),
			},
		};
	}

	return response;
};
