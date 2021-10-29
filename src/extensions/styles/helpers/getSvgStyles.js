/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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

	if (obj['svg-palette-fill-color-status'] && obj['svg-palette-fill-color'])
		response.general.fill = getColorRGBAString({
			firstVar: 'icon-fill',
			secondVar: `color-${obj['svg-palette-fill-color']}`,
			opacity: obj['svg-palette-fill-opacity'],
			blockStyle,
		});
	else if (
		!obj['svg-palette-fill-color-status'] &&
		!isNil(obj['svg-fill-color'])
	)
		response.general.fill = obj['svg-fill-color'];

	return { SVGPathFill: response };
};

const getSVGPathStrokeStyles = (obj, blockStyle) => {
	const response = {
		label: 'SVG',
		general: {},
	};

	if (obj['svg-palette-line-color-status'] && obj['svg-palette-line-color'])
		response.general.stroke = getColorRGBAString({
			firstVar: 'icon-line',
			secondVar: `color-${obj['svg-palette-line-color']}`,
			opacity: obj['svg-palette-line-opacity'],
			blockStyle,
		});
	else if (
		!obj['svg-palette-line-color-status'] &&
		!isNil(obj['svg-line-color'])
	)
		response.general.stroke = obj['svg-line-color'];

	return { SVGPathStroke: response };
};

export const getSvgStyles = ({ obj, target, blockStyle }) => {
	const response = {
		// [` ${target} svg`]: getSVGWidthStyles(obj),
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
