import {
	rawBackgroundColor,
	rawBackgroundGradient,
	rawBackgroundImage,
	rawBackgroundVideo,
	rawBackgroundSVG,
	rawImageShape,
} from '../../extensions/styles/defaults';

/**
 * Layers
 */
const getLayerAttributes = (attr, prefix = '') => {
	const response = {};

	Object.entries(attr).forEach(([key, val]) => {
		response[prefix + key] = val.default;
	});

	return response;
};

export const colorOptions = {
	type: 'color',
	display: 'block',
	...getLayerAttributes(rawBackgroundColor),
};

export const imageOptions = {
	type: 'image',
	display: 'block',
	...getLayerAttributes(rawBackgroundImage),
};

export const videoOptions = {
	type: 'video',
	display: 'block',
	...getLayerAttributes(rawBackgroundVideo),
};

export const gradientOptions = {
	type: 'gradient',
	display: 'block',
	...getLayerAttributes(rawBackgroundGradient),
};

export const SVGOptions = {
	type: 'shape',
	display: 'block',
	...getLayerAttributes(rawBackgroundSVG),
	...getLayerAttributes(rawImageShape, 'background-svg-'),
};
