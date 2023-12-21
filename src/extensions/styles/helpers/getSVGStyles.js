/* eslint-disable default-param-last */
/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';
import getAttributeKey from '../getAttributeKey';
import getAttributeValue from '../getAttributeValue';

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
		target: 'svgType',
		props: obj,
		isHover,
		prefix,
	});

	const perStrokeWidthCoefficient = 4;
	const attributeCache = {};

	breakpoints.forEach(breakpoint => {
		const getAttribute = attr => {
			const key = `${attr}-${breakpoint}-${isHover}`;
			if (attributeCache[key] === undefined) {
				attributeCache[key] = getLastBreakpointAttribute({
					target: `${prefix}${attr}`,
					isHover,
					breakpoint,
					attributes: obj,
				});
			}
			return attributeCache[key];
		};

		const iconSize = getAttribute('width') ?? getAttribute('height');
		const iconUnit =
			getAttribute('width-unit') ?? getAttribute('height-unit') ?? 'px';
		const iconWidthFitContent = getAttribute('width-fit-content');
		const iconStrokeWidth =
			svgType !== 'Shape' ? getAttribute('stroke') : 1;

		const heightToStrokeWidthCoefficient =
			1 +
			((iconStrokeWidth - 1) *
				perStrokeWidthCoefficient *
				iconWidthHeightRatio) /
				100;

		if (!isNil(iconSize) && !isEmpty(iconSize)) {
			response[breakpoint] = response[breakpoint] || {}; // Ensure the object exists
			if (iconWidthFitContent || !disableHeight) {
				const calculatedHeight =
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
						: iconSize;
				response[breakpoint].height = `${calculatedHeight}${iconUnit}`;
			}
			response[breakpoint].width = `${iconSize}${iconUnit}`;
		}

		if (isEmpty(response[breakpoint]) && breakpoint !== 'general') {
			delete response[breakpoint];
		}
	});

	return { iconSize: response };
};

const getSVGPathStyles = (obj, prefix = 'svg-', isHover = false) => {
	const response = {
		label: 'SVG path',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const iconStroke =
			obj[getAttributeKey('stroke', isHover, prefix, breakpoint)];

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
	prefix = 'svg-',
	isHover = false
) => {
	const response = {
		label: 'SVG path-fill',
		general: {},
	};

	const {
		paletteStatus,
		paletteSCStatus,
		paletteColor,
		paletteOpacity,
		color,
	} = getPaletteAttributes({ obj, prefix: `${prefix}fill-`, isHover });

	if (paletteStatus && paletteColor) {
		const colorParams = {
			firstVar: paletteSCStatus
				? `color-${paletteColor}`
				: `icon-fill${isHover ? '-hover' : ''}`,
			opacity: paletteOpacity,
			blockStyle,
		};
		if (!paletteSCStatus) {
			colorParams.secondVar = `color-${paletteColor}`;
		}
		response.general.fill = getColorRGBAString(colorParams);
	} else if (!paletteStatus && !isNil(color)) {
		response.general.fill = color;
	}

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
		return {
			SVGPathStroke: { label: response.label, general: { stroke: '' } },
		};
	}

	const breakpointsToUse = useIconColor ? ['general'] : breakpoints;
	const linePrefix = [
		'icon-',
		'close-icon-',
		'active-icon-',
		'navigation-arrow-both-icon-',
		'navigation-dot-icon-',
		'active-navigation-dot-icon-',
	].includes(prefix)
		? `${prefix}stroke-`
		: `${prefix}line-`;

	breakpointsToUse.forEach(breakpoint => {
		const {
			paletteStatus,
			paletteSCStatus,
			paletteColor,
			paletteOpacity,
			color,
		} = getPaletteAttributes({
			obj,
			prefix: useIconColor ? linePrefix : '',
			...(!useIconColor && { breakpoint }),
			isHover,
		});

		if (paletteStatus && paletteColor) {
			const strokeColor = getColorRGBAString({
				firstVar:
					paletteSCStatus || !useIconColor
						? `color-${paletteColor}`
						: `icon-stroke${isHover ? '-hover' : ''}`,
				secondVar:
					!paletteSCStatus && useIconColor
						? `color-${paletteColor}`
						: undefined,
				opacity: paletteOpacity,
				blockStyle,
			});

			if (useIconColor) {
				response.general = { stroke: strokeColor };
			} else {
				response[breakpoint] = { stroke: strokeColor };
			}
		} else if (!paletteStatus && !isNil(color)) {
			response[breakpoint] = { stroke: color };
		}
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

	const fillSelectors = [
		`${target} svg[data-fill]:not([fill^="none"])`,
		`${target} svg[data-fill]:not([fill^="none"]) *`,
		`${target} svg g[data-fill]:not([fill^="none"])`,
		`${target} svg use[data-fill]:not([fill^="none"])`,
		`${target} svg circle[data-fill]:not([fill^="none"])`,
		`${target} svg path[data-fill]:not([fill^="none"])`,
	];

	const strokeSelectors = [
		`${target} svg[data-stroke]:not([stroke^="none"]) *`,
		`${target} svg path[data-stroke]:not([stroke^="none"])`,
		`${target} svg[data-stroke]:not([stroke^="none"])`,
		`${target} svg g[data-stroke]:not([stroke^="none"])`,
		`${target} svg use[data-stroke]:not([stroke^="none"])`,
		`${target} svg circle[data-stroke]:not([stroke^="none"])`,
	];

	const response = {
		[`${target} svg path`]: pathStyles,
		...(!isHover
			? {}
			: {
					[`${target} svg[data-hover-stroke] path`]: pathStyles,
					[`${target} svg path[data-hover-stroke]`]: pathStyles,
			  }),
	};

	if (iconType !== 'line') {
		fillSelectors.forEach(selector => {
			response[selector] = pathFillStyles;
		});
		if (isHover) {
			fillSelectors
				.map(selector =>
					selector.replace('[data-fill]', '[data-hover-fill]')
				)
				.forEach(hoverSelector => {
					response[hoverSelector] = pathFillStyles;
				});
		}
	}

	if (iconType !== 'shape') {
		strokeSelectors.forEach(selector => {
			response[selector] = pathStrokeStyles;
		});
		if (isHover) {
			strokeSelectors
				.map(selector =>
					selector.replace('[data-stroke]', '[data-hover-stroke]')
				)
				.forEach(hoverSelector => {
					response[hoverSelector] = pathStrokeStyles;
				});
		}
	}

	return response;
};
