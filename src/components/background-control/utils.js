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
	hoverStatus,
}) => {
	const response = {};

	const sameLabelAttr = [
		'type',
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

		if (key === 'display') {
			if (isHover || breakpoint !== 'general')
				response['display-general'] = 'none';

			// In case hover status is enabled, makes the layers added
			// on normal be hidden by default on hover
			if (hoverStatus || breakpoint !== 'general')
				response['display-general-hover'] = 'none';

			if (!hoverStatus && breakpoint !== 'general')
				response[`display-${breakpoint}-hover`] = 'block';
		}
	});

	return response;
};

export const getDefaultLayerAttr = (layerType, target) =>
	backgroundLayers[layerType][target];
