/**
 * External dependencies
 */
import { round } from 'lodash';

/**
 * Calculates the width to height ratio of an SVG element.
 *
 * @param {SVGElement|null} svg - The SVG element to calculate the ratio for.
 * @returns {number} The width to height ratio, rounded to 2 decimal places. Returns 1 if the SVG is invalid.
 */
const getSVGWidthHeightRatio = svg => {
	if (!svg) return 1;

	const svgWindow = svg.ownerDocument?.defaultView;
	const SvgElementCtor = svgWindow?.SVGElement;
	const isSvgElement = SvgElementCtor
		? svg instanceof SvgElementCtor
		: svg?.nodeName?.toLowerCase?.() === 'svg';

	if (!isSvgElement || typeof svg.getBBox !== 'function') return 1;

	try {
		const { width, height } = svg.getBBox();
		return height > 0 ? round(width / height, 2) : 1;
	} catch (error) {
		return 1;
	}
};

export default getSVGWidthHeightRatio;
