/* eslint-disable default-param-last */
/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';
import getAttributeKey from '../../attributes/getAttributeKey';
import getAttributeValue from '../../attributes/getAttributesValue';

/**
 * External dependencies
 */
import { isNil, isEmpty, round } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getSVGWidthStyles = ({
	obj,
	isHover = false,
	prefix = '',
	iconWidthHeightRatio = 1,
	disableHeight = true,
}) => {
	const response = {
		label: 'Icon size',
		general: {},
	};

	const svgType = getAttributeValue({
		target: '_st',
		props: obj,
		isHover,
		prefix,
	});

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconSize =
			getLastBreakpointAttribute({
				target: '_w',
				prefix,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			getLastBreakpointAttribute({
				target: '_h',
				prefix,
				isHover,
				breakpoint,
				attributes: obj,
			});

		const iconUnit =
			getLastBreakpointAttribute({
				target: '_w.u',
				prefix,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			getLastBreakpointAttribute({
				target: '_h.u',
				prefix,
				isHover,
				breakpoint,
				attributes: obj,
			}) ??
			'px';

		const iconWidthFitContent = getLastBreakpointAttribute({
			target: '_wfc',
			prefix,
			isHover,
			breakpoint,
			attributes: obj,
		});

		const iconStrokeWidth =
			svgType !== 'Shape'
				? getLastBreakpointAttribute({
						target: 'str',
						prefix,
						isHover,
						breakpoint,
						attributes: obj,
				  })
				: 1;

		const perStrokeWidthCoefficient = 4;

		const heightToStrokeWidthCoefficient =
			1 +
			((iconStrokeWidth - 1) *
				perStrokeWidthCoefficient *
				iconWidthHeightRatio) /
				100;

		if (!isNil(iconSize) && !isEmpty(iconSize)) {
			/**
			 * Ignore `disableHeight` if `iconWidthFitContent` is true,
			 * because it's necessary to have height in this case.
			 */
			if (iconWidthFitContent || !disableHeight)
				response[breakpoint].height = `${
					iconWidthFitContent && iconWidthHeightRatio !== 1
						? round(
								iconWidthHeightRatio > 1
									? (iconSize *
											heightToStrokeWidthCoefficient) /
											iconWidthHeightRatio
									: iconSize /
											(iconWidthHeightRatio *
												heightToStrokeWidthCoefficient)
						  )
						: iconSize
				}${iconUnit}`;
			response[breakpoint].width = `${iconSize}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { iconSize: response };
};

const getSVGPathStyles = (obj, prefix = 's-', isHover = false) => {
	const response = {
		label: 'SVG path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconStroke =
			obj[getAttributeKey('_str', isHover, prefix, breakpoint)];

		if (!isNil(iconStroke)) {
			response[breakpoint]['stroke-width'] = iconStroke;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general')
			delete response[breakpoint];
	});

	return { SVGPath: response };
};

const getSVGPathFillStyles = (
	obj,
	blockStyle,
	prefix = 's',
	isHover = false
) => {
	const response = {
		label: 'SVG path-fill',
		general: {},
	};

	const { paletteStatus, paletteColor, paletteOpacity, color } =
		getPaletteAttributes({
			obj,
			prefix: `${prefix}f${prefix === 'i-' ? '' : 'i'}-`,
			isHover,
		});

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
	prefix = 's',
	isHover,
	useIconColor = true
) => {
	const response = {
		label: 'SVG Path stroke',
	};

	if (isHover && !useIconColor && !obj[getAttributeKey('t.sh')]) {
		response.general = {};
		response.general.stroke = '';

		return response;
	}

	(!useIconColor ? breakpoints : ['general']).forEach(breakpoint => {
		response[breakpoint] = {};

		let linePrefix = '';

		switch (prefix) {
			case 'i-':
			case 'cl-i-':
			case 'a-i-':
			case 'nab-i-':
			case 'nd-i-':
			case 'a-nd-i-':
				linePrefix = `${prefix}str-`;
				break;
			default:
				linePrefix = `${prefix}li-`;
				break;
		}

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
