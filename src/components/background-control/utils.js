/**
 * Internal dependencies
 */

import { getAttributeKey } from '../../extensions/styles';
import * as backgroundLayers from './layers';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Utils
 */
export const setBreakpointToLayer = ({
	layer,
	breakpoint,
	isHover = false,
}) => {
	const response = {};

	const sameLabelAttr = [
		'type',
		'isHover',
		'background-video-mediaID',
		'background-video-mediaURL',
		'background-video-startTime',
		'background-video-endTime',
		'background-video-loop',
		'background-svg-SVGElement',
		'background-svg-SVGData',
		'background-image-mediaURL',
		'background-image-mediaID',
		'background-image-parallax-status',
		'background-image-parallax-speed',
		'background-image-parallax-direction',
	];

	Object.entries(layer).forEach(([key, val]) => {
		if (!sameLabelAttr.includes(key)) {
			// Current non-hover values
			response[getAttributeKey(key, false, false, breakpoint)] = val;

			// Current hover values
			if (isHover)
				response[getAttributeKey(key, isHover, false, breakpoint)] =
					val;

			if (breakpoint !== 'general') {
				// General non-hover values
				response[getAttributeKey(key, false, false, 'general')] = val;

				// General hover values
				if (isHover)
					response[getAttributeKey(key, isHover, false, 'general')] =
						val;
			}
		} else response[key] = val;

		if (key === 'display' && (isHover || breakpoint !== 'general'))
			response['display-general'] = 'none';

		response.isHover = isHover;
	});

	return response;
};

export const getDefaultLayerAttr = (layerType, target) =>
	backgroundLayers[layerType][target];

export const getLayerLabel = type => {
	switch (type) {
		case 'color':
			return 'colorOptions';
		case 'image':
			return 'imageOptions';
		case 'video':
			return 'videoOptions';
		case 'gradient':
			return 'gradientOptions';
		case 'shape':
			return 'SVGOptions';
		default:
			return false;
	}
};

const getLayerUniqueParameter = (parameter, layers) =>
	layers && !isEmpty(layers)
		? Math.max(
				...layers.map(layer =>
					typeof layer[parameter] === 'number' ? layer[parameter] : 0
				)
		  ) + 1
		: 1;

export const getObject = (type, breakpoint, isHover, layers) => {
	return {
		...setBreakpointToLayer({
			layer: backgroundLayers[getLayerLabel(type)],
			breakpoint,
			isHover,
		}),
		order: getLayerUniqueParameter('order', layers),
		id: getLayerUniqueParameter('id', layers),
	};
};
