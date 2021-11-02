/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { uniqueId, isObject } from 'lodash';

const generateDataObject = (data, svg) => {
	const response = data ? (!isObject(data) ? JSON.parse(data) : data) : {};
	const obj = {
		color: '',
		imageID: '',
		imageURL: '',
	};
	const { getBlockAttributes, getSelectedBlockClientId } =
		select('core/block-editor');
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

export default generateDataObject;
