/**
 * Internal dependencies
 */

import { getAttributeKey } from '../../extensions/styles';
import * as backgroundLayers from './layers';

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
		'background-svg-SVGMediaID',
		'background-svg-SVGMediaURL',
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
