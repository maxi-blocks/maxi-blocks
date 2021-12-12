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

	if (obj['svg-fill-palette-status'] && obj['svg-fill-palette-color'])
		response.general.fill = getColorRGBAString({
			firstVar: 'icon-fill',
			secondVar: `color-${obj['svg-fill-palette-color']}`,
			opacity: obj['svg-fill-palette-opacity'],
			blockStyle,
		});
	else if (!obj['svg-fill-palette-status'] && !isNil(obj['svg-fill-color']))
		response.general.fill = obj['svg-fill-color'];

	return { SVGPathFill: response };
};

const getSVGPathStrokeStyles = (obj, blockStyle) => {
	const response = {
		label: 'SVG',
		general: {},
	};

	if (obj['svg-line-palette-status'] && obj['svg-line-palette-color'])
		response.general.stroke = getColorRGBAString({
			firstVar: 'icon-line',
			secondVar: `color-${obj['svg-line-palette-color']}`,
			opacity: obj['svg-line-palette-opacity'],
			blockStyle,
		});
	else if (!obj['svg-line-palette-status'] && !isNil(obj['svg-line-color']))
		response.general.stroke = obj['svg-line-color'];

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
