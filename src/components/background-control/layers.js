import {
	rawBackgroundColor,
	rawBackgroundGradient,
	rawBackgroundImage,
	rawBackgroundVideo,
	rawBackgroundSVG,
	rawImageShape,
} from '@extensions/styles/defaults';

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
	isHover: false,
	...getLayerAttributes(rawBackgroundColor),
};

export const imageOptions = {
	type: 'image',
	display: 'block',
	isHover: false,
	...getLayerAttributes(rawBackgroundImage),
};

export const videoOptions = {
	type: 'video',
	display: 'block',
	isHover: false,
	...getLayerAttributes(rawBackgroundVideo),
};

export const gradientOptions = {
	type: 'gradient',
	display: 'block',
	isHover: false,
	...getLayerAttributes(rawBackgroundGradient),
};

export const SVGOptions = {
	type: 'shape',
	display: 'block',
	isHover: false,
	...getLayerAttributes(rawBackgroundSVG),
	...getLayerAttributes(rawImageShape, 'background-svg-'),
};
