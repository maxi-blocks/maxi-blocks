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
	if (!svg || !(svg instanceof SVGElement)) return 1;

	const { width, height } = svg.getBBox();
	return height > 0 ? round(width / height, 2) : 1;
};

export default getSVGWidthHeightRatio;
