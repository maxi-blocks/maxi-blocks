/**
 * WordPress dependencies
 */
const { select } = wp.data;

/**
 * External dependencies
 */
import { uniqueId, isObject, isEmpty, isElement } from 'lodash';

/**
 * Utils
 */
export const injectImgSVG = (svg, SVGData = {}) => {
	const { getBlockAttributes, getSelectedBlockClientId } = select(
		'core/block-editor'
	);

	const { uniqueID } = getBlockAttributes(getSelectedBlockClientId());

	const SVGValue = !isObject(SVGData) ? JSON.parse(SVGData) : SVGData;

	const SVGElement = !isElement(svg)
		? new DOMParser().parseFromString(svg, 'text/xml').firstChild
		: svg;

	const SVGLayers = Array.from(
		SVGElement.querySelectorAll(
			'path, circle, rect, polygon, line, ellipse'
		)
	);

	Object.entries(SVGValue).forEach(([id, el], i) => {
		if (!isEmpty(el.imageURL)) {
			const pattern = document.createElement('pattern');
			pattern.id = `${id}__img`;
			pattern.classList.add('maxi-svg-block__pattern');
			pattern.setAttribute('width', '100%');
			pattern.setAttribute('height', '100%');
			pattern.setAttribute('x', '0');
			pattern.setAttribute('y', '0');
			pattern.setAttribute('patternUnits', 'userSpaceOnUse');

			const image = document.createElement('image');
			image.classList.add('maxi-svg-block__pattern__image');
			image.setAttribute('width', '100%');
			image.setAttribute('height', '100%');
			image.setAttribute('x', '0');
			image.setAttribute('y', '0');
			image.setAttribute('xlink:href', el.imageURL);

			pattern.append(image);
			SVGElement.prepend(pattern);

			SVGLayers[i].style.fill = `url(#${id}__img)`;
			SVGLayers[i].setAttribute('fill', `url(#${id}__img)`);
		} else if (!isEmpty(el.color)) {
			SVGLayers[i].style.fill = el.color;
			SVGLayers[i].setAttribute('fill', el.color);
		}
	});

	SVGElement.dataset.item = `${uniqueID}__svg`;

	return SVGElement;
};

export const generateDataObject = (data, svg) => {
	const response = data ? (!isObject(data) ? JSON.parse(data) : data) : {};
	const obj = {
		color: '',
		imageID: '',
		imageURL: '',
	};
	const { getBlockAttributes, getSelectedBlockClientId } = select(
		'core/block-editor'
	);
	const { uniqueID } = getBlockAttributes(getSelectedBlockClientId());
	const SVGLayers = Array.from(
		svg.querySelectorAll('path, circle, rect, polygon, line, ellipse')
	);

	if (Object.keys(response).length > SVGLayers.length)
		do {
			delete response[
				Object.keys(response)[Object.keys(response).length - 1]
			];
		} while (Object.keys(response).length !== SVGLayers.length);
	else if (Object.keys(response).length < SVGLayers.length)
		SVGLayers.forEach((layer, i) => {
			if (
				Object.keys(response).length <= i ||
				Object.keys(response).length === 0
			)
				response[`${uniqueID}__${uniqueId()}`] = obj;
		});

	return response;
};
