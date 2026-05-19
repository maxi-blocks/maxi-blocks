/**
 * Internal dependencies
 */

import { handleSetAttributes } from '@extensions/maxi-block';
import {
	getAttributeKey,
	getBreakpointFromAttribute,
	getHoverAttributeKey,
	getIsHoverAttribute,
	getSimpleLabel,
} from '@extensions/styles';
import * as backgroundLayers from './layers';

/**
 * External dependencies
 */
import { cloneDeep, findIndex, isEqual, isNil, omitBy } from 'lodash';

/**
 * Utils
 */
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

const layerMetaAttrs = ['id', 'order', 'isReset', 'meta'];

export const setBreakpointToLayer = ({
	layer,
	breakpoint,
	isHover = false,
}) => {
	const response = {};

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

const getHoverLayerChangeObject = layer =>
	Object.entries(layer).reduce((response, [key, val]) => {
		if (
			sameLabelAttr.includes(key) ||
			layerMetaAttrs.includes(key) ||
			getIsHoverAttribute(key)
		) {
			response[key] = val;

			return response;
		}

		const breakpoint = getBreakpointFromAttribute(key);

		if (breakpoint) {
			response[
				getAttributeKey(
					getSimpleLabel(key, breakpoint),
					true,
					false,
					breakpoint
				)
			] = val;
		} else {
			response[getHoverAttributeKey(key)] = val;
		}

		return response;
	}, {});

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

const cleanRedundantPositionPairSync = layer =>
	Object.entries(layer).reduce((acc, [key, value]) => {
		if (
			value === false &&
			(key.includes('position-sync-horizontal') ||
				key.includes('position-sync-vertical'))
		) {
			const pair = key.includes('position-sync-horizontal')
				? 'horizontal'
				: 'vertical';
			const prefix = key.slice(0, key.indexOf(`sync-${pair}`));
			const breakpoint = key.slice(key.lastIndexOf('-') + 1);
			const sides =
				pair === 'horizontal'
					? ['left', 'right']
					: ['top', 'bottom'];

			if (
				layer[`${prefix}sync-${breakpoint}`] === 'none' &&
				sides.some(
					side => !isNil(layer[`${prefix}${side}-${breakpoint}`])
				)
			)
				return acc;
		}

		acc[key] = value;
		return acc;
	}, {});

/**
 * Handle the onChange event for a layer
 *
 * @param {Object}   rawLayer    - The raw layer
 * @param {Function} onChange    - The onChange function
 * @param {Object}   layersHover - The hover layers
 * @param {Object}   layers      - The layers
 * @param {boolean}  target      - Inline styles target
 */
export const onChangeLayer = (
	rawLayer,
	onChange,
	layersHover,
	layers,
	target = false
) => {
	const layer = omitBy(cleanRedundantPositionPairSync(rawLayer), isNil);
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

/**
 * Handle the responsive attributes for a layer
 *
 * @param {Object}  layer        - The layer to update
 * @param {Object}  currentLayer - The current layer
 * @param {boolean} isHover      - Whether the layer is a hover layer
 * @returns {Object} The updated layer
 */
export const handleOnChangeLayer = (layer, currentLayer, isHover) => {
	const response = handleSetAttributes({
		obj: isHover ? getHoverLayerChangeObject(layer) : layer,
		attributes: currentLayer,
		onChange: result => result,
		defaultAttributes: {
			...setBreakpointToLayer({
				layer: backgroundLayers[getLayerLabel(currentLayer.type)],
				breakpoint: 'general',
				isHover,
			}),
		},
	});

	return Object.entries(response).reduce((acc, [key, value]) => {
		if (value === false) {
			if (
				key.includes('position-sync-horizontal') ||
				key.includes('position-sync-vertical')
			) {
				const pair = key.includes('position-sync-horizontal')
					? 'horizontal'
					: 'vertical';
				const prefix = key.slice(0, key.indexOf(`sync-${pair}`));
				const breakpoint = key.slice(key.lastIndexOf('-') + 1);
				const sides =
					pair === 'horizontal'
						? ['left', 'right']
						: ['top', 'bottom'];
				const syncValue =
					layer[`${prefix}sync-${breakpoint}`] ??
					currentLayer[`${prefix}sync-${breakpoint}`];

				if (
					syncValue === 'none' &&
					sides.some(
						side =>
							!isNil(layer[`${prefix}${side}-${breakpoint}`]) ||
							!isNil(
								currentLayer[`${prefix}${side}-${breakpoint}`]
							)
					)
				) {
					acc[key] = undefined;
					return acc;
				}
			}
		}

		acc[key] = value;
		return acc;
	}, {});
};
