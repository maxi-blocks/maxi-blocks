/**
 * Internal dependencies
 */

import { getAttributeKey } from '../../extensions/attributes';
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
		'bi_mu',
		'bi_mi',
		'bi_pa.s',
		'bi_psp',
		'bi_pd',
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

		if (key === '_d' && (isHover || breakpoint !== 'general'))
			response[getAttributeKey('_d', false, false, 'general')] = 'none';

		response.isHover = isHover;
	});

	return response;
};

export const getDefaultLayerAttrs = layerType => backgroundLayers[layerType];

export const getDefaultLayerAttr = (layerType, target) =>
	getDefaultLayerAttrs(layerType)?.[target];

export const getDefaultLayerWithBreakpoint = (
	layerType,
	breakpoint,
	isHover = false
) => {
	const layer = getDefaultLayerAttrs(layerType);

	return setBreakpointToLayer({
		layer,
		breakpoint,
		isHover,
	});
};
