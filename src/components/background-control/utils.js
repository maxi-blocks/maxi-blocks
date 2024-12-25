/**
 * Internal dependencies
 */

import { getAttributeKey } from '@extensions/styles';
import * as backgroundLayers from './layers';

/**
 * External dependencies
 */
import { cloneDeep, findIndex, isEqual, isNil, omitBy } from 'lodash';

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

export const onChangeLayer = (
	rawLayer,
	onChange,
	layersHover,
	layers,
	target = false
) => {
	const layer = omitBy(rawLayer, isNil);
	const isHoverLayer = layer.isHover;
	const newLayers = cloneDeep(isHoverLayer ? layersHover : layers);

	const index = findIndex(newLayers, { order: layer.order });

	newLayers[index] = layer;

	if (!isEqual(newLayers, isHoverLayer ? layersHover : layers))
		onChange(
			{
				[`background-layers${isHoverLayer ? '-hover' : ''}`]: newLayers,
			},
			target
		);
};
