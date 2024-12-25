/* eslint-disable default-param-last */
/**
 * Internal dependencies
 */
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';
import getAttributeKey from '@extensions/styles/getAttributeKey';
import getAttributeValue from '@extensions/styles/getAttributeValue';

/**
 * External dependencies
 */
import { isNil, round } from 'lodash';

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

	const getAttribute = (attr, breakpoint) => {
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

	breakpoints.forEach(breakpoint => {
		const iconSize =
			getAttribute('width', breakpoint) ??
			getAttribute('height', breakpoint);
		const iconUnit =
			getAttribute('width-unit', breakpoint) ??
			getAttribute('height-unit', breakpoint) ??
			'px';
		const iconWidthFitContent = getAttribute(
			'width-fit-content',
			breakpoint
		);
		const iconStrokeWidth =
			svgType !== 'Shape' ? getAttribute('stroke', breakpoint) : 1;

		if (iconSize != null && iconSize !== '') {
			const heightToStrokeWidthCoefficient =
				1 +
				((iconStrokeWidth - 1) *
					perStrokeWidthCoefficient *
					iconWidthHeightRatio) /
					100;

			response[breakpoint] = {};
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

		if (
			Object.keys(response[breakpoint] || {}).length === 0 &&
			breakpoint !== 'general'
		) {
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

	const attributeCache = {};

	breakpoints.forEach(breakpoint => {
		const key = `stroke-${breakpoint}-${isHover}`;
		if (attributeCache[key] === undefined) {
			attributeCache[key] = getAttributeKey(
				'stroke',
				isHover,
				prefix,
				breakpoint
			);
		}
		const iconStroke = obj[attributeCache[key]];

		if (iconStroke != null) {
			if (!response[breakpoint]) response[breakpoint] = {};
			response[breakpoint]['stroke-width'] = iconStroke;
		}
	});

	// Remove empty breakpoints
	Object.keys(response).forEach(breakpoint => {
		if (
			breakpoint !== 'general' &&
			Object.keys(response[breakpoint]).length === 0
		) {
			delete response[breakpoint];
		}
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
	} else if (!paletteStatus && color != null) {
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
		} else if (!paletteStatus && color != null) {
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

	const response = {
		[`${target} svg path`]: pathStyles,
		...(!isHover
			? {}
			: {
					[`${target} svg[data-hover-stroke] path`]: pathStyles,
					[`${target} svg path[data-hover-stroke]`]: pathStyles,
			  }),
	};

	const addStyles = (selectors, styles, dataAttr, hoverDataAttr) => {
		selectors.forEach(selector => {
			response[selector] = styles;
		});
		if (isHover) {
			selectors
				.map(selector =>
					selector.replace(`[${dataAttr}]`, `[${hoverDataAttr}]`)
				)
				.forEach(hoverSelector => {
					response[hoverSelector] = styles;
				});
		}
	};

	if (iconType !== 'line') {
		const fillSelectors = [
			`${target} svg[data-fill]:not([fill^="none"])`,
			`${target} svg[data-fill]:not([fill^="none"]) *`,
			`${target} svg g[data-fill]:not([fill^="none"])`,
			`${target} svg use[data-fill]:not([fill^="none"])`,
			`${target} svg circle[data-fill]:not([fill^="none"])`,
			`${target} svg path[data-fill]:not([fill^="none"])`,
		];
		addStyles(
			fillSelectors,
			pathFillStyles,
			'data-fill',
			'data-hover-fill'
		);
	}

	if (iconType !== 'shape') {
		const strokeSelectors = [
			`${target} svg[data-stroke]:not([stroke^="none"]) *`,
			`${target} svg path[data-stroke]:not([stroke^="none"])`,
			`${target} svg[data-stroke]:not([stroke^="none"])`,
			`${target} svg g[data-stroke]:not([stroke^="none"])`,
			`${target} svg use[data-stroke]:not([stroke^="none"])`,
			`${target} svg circle[data-stroke]:not([stroke^="none"])`,
		];
		addStyles(
			strokeSelectors,
			pathStrokeStyles,
			'data-stroke',
			'data-hover-stroke'
		);
	}

	return response;
};
