/**
 * External dependencies
 */
import { round } from 'lodash';

/**
 * Calculates the width to height ratio of an SVG element.
 *
 * @param {SVGElement|null} svg - The SVG element to calculate the ratio for.
 * @param {string|null}     fallbackSvg - Raw SVG markup to measure if the rendered
 * SVG is not available.
 * @returns {number} The width to height ratio, rounded to 2 decimal places. Returns 1 if the SVG is invalid.
 */
const getRatioFromElement = svg => {
	if (!svg) return null;

	const svgWindow = svg.ownerDocument?.defaultView;
	const SvgElementCtor = svgWindow?.SVGElement;
	const isSvgElement = SvgElementCtor
		? svg instanceof SvgElementCtor
		: svg?.nodeName?.toLowerCase?.() === 'svg';

	if (!isSvgElement || typeof svg.getBBox !== 'function') return null;

	try {
		const { width, height } = svg.getBBox();
		return height > 0 ? round(width / height, 2) : null;
	} catch (error) {
		return null;
	}
};

const getRatioFromMarkup = svgMarkup => {
	if (
		typeof svgMarkup !== 'string' ||
		typeof document === 'undefined' ||
		!svgMarkup
	)
		return null;

	const wrapper = document.createElement('div');
	wrapper.style.cssText =
		'position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:-9999px;';
	wrapper.innerHTML = svgMarkup.trim();

	const svg = wrapper.querySelector('svg');
	if (!svg) return null;

	if (document.body) document.body.appendChild(wrapper);

	try {
		return getRatioFromElement(svg);
	} finally {
		wrapper.remove();
	}
};

const getSVGWidthHeightRatio = (svg, fallbackSvg = null) =>
	getRatioFromElement(svg) ??
	getRatioFromMarkup(fallbackSvg) ??
	getRatioFromMarkup(svg) ??
	1;

export default getSVGWidthHeightRatio;
