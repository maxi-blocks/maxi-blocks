/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getSVGPosition from './getSVGPosition';
import getSVGRatio from './getSVGRatio';

/**
 * External dependencies
 */
import { isObject, isEmpty, isElement } from 'lodash';

/**
 * Injects an image into an SVG element
 * @param {string|Element} svg           - The SVG element to inject the image into
 * @param {Object|string}  SVGData       - The data to inject into the SVG element
 * @param {boolean}        removeMode    - Whether to remove the image from the SVG element
 * @param {string}         blockUniqueID - The unique ID of the block
 * @returns {Element} The SVG element with the image injected
 */
const injectImgSVG = (
	svg,
	SVGData = {},
	removeMode = false,
	blockUniqueID = null
) => {
	const imageShapePosition = getSVGPosition(svg.outerHTML ?? svg);
	const imageShapeRatio = getSVGRatio(svg.outerHTML ?? svg);

	const imageShapeRatioValue =
		imageShapeRatio === 'meet' ? ' meet' : ' slice';

	const SVGValue = !isObject(SVGData) ? JSON.parse(SVGData) : SVGData;

	const SVGElement = !isElement(svg)
		? new DOMParser().parseFromString(svg, 'text/xml').firstChild
		: svg;

	const SVGLayers = Array.from(
		SVGElement.querySelectorAll(
			'path, circle, rect, polygon, line, ellipse'
		)
	);
	const SVGViewBox = SVGElement.getAttribute('viewBox')
		.replace(/,/g, '')
		.split(' ');

	Object.entries(SVGValue).forEach(([id, el]) => {
		SVGLayers.forEach((item, i) => {
			const svgImage = SVGElement.querySelector(
				'.maxi-svg-block__pattern'
			);

			const shouldAddImage =
				!isEmpty(el.imageURL) && !el.isImageUrlInvalid;

			if (!shouldAddImage && removeMode) {
				SVGLayers[i].removeAttribute('style');
				svgImage?.remove();
			}

			if (
				svgImage &&
				svgImage?.querySelector('image').href !== el.imageURL
			)
				svgImage?.remove();

			if (shouldAddImage) {
				const pattern = document.createElement('pattern');
				pattern.id = `${id}__img`;
				pattern.classList.add('maxi-svg-block__pattern');
				pattern.setAttribute('width', '100%');
				pattern.setAttribute('height', '100%');
				pattern.setAttribute('x', SVGViewBox[0]);
				pattern.setAttribute('y', SVGViewBox[1]);
				pattern.setAttribute('patternUnits', 'userSpaceOnUse');

				const image = document.createElement('image');
				image.classList.add('maxi-svg-block__pattern__image');
				image.setAttribute('width', '100%');
				image.setAttribute('height', '100%');
				image.setAttribute('x', '0');
				image.setAttribute('y', '0');
				image.setAttribute('href', el.imageURL);

				if (!isEmpty(imageShapePosition))
					image.setAttribute(
						'preserveAspectRatio',
						`${imageShapePosition}${imageShapeRatioValue}`
					);
				else
					image.setAttribute(
						'preserveAspectRatio',
						`xMidYMid${imageShapeRatioValue}`
					);

				pattern.append(image);
				SVGElement.prepend(pattern);

				SVGLayers[i].setAttribute('style', `fill: url(#${id}__img)`);
				SVGLayers[i].setAttribute('fill', `url(#${id}__img)`);
			} else if (!isEmpty(el.color)) {
				SVGLayers[i].setAttribute('fill', el.color);
			} else {
				SVGLayers[i].setAttribute('fill', '');
			}
		});
	});

	if (SVGElement.dataset) {
		const { getBlockAttributes, getSelectedBlockClientId } =
			select('core/block-editor');
		const uniqueID =
			blockUniqueID ??
			getBlockAttributes(getSelectedBlockClientId()).uniqueID;

		SVGElement.dataset.item = `${uniqueID}__svg`;
	}

	return SVGElement;
};

export default injectImgSVG;
