/**
 * External dependencies
 */
import { isEmpty, omit } from 'lodash';

const transformTypes = [
	'transform-scale',
	'transform-translate',
	'transform-skew',
	'transform-perspective',
	'transform-translate3d',
	'transform-scale3d',
	'transform-rotate',
	'transform-rotate3d',
	'transform-origin',
];

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getLayerTransformCleanupAttributes = (
	transformAttributes = {},
	layerId
) => {
	const layerTarget = `_${layerId}`;
	const response =
		transformAttributes['transform-target'] === layerTarget
			? { 'transform-target': undefined }
			: {};

	return transformTypes.reduce((acc, transformType) => {
		breakpoints.forEach(breakpoint => {
			const attributeKey = `${transformType}-${breakpoint}`;
			const value = transformAttributes[attributeKey];

			if (!value?.[layerTarget]) return;

			const cleanedValue = omit(value, layerTarget);

			acc[attributeKey] = isEmpty(cleanedValue)
				? undefined
				: cleanedValue;
		});

		return acc;
	}, response);
};
