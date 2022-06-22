/**
 * External dependencies
 */
import { without, isEmpty } from 'lodash';

const bgDisplayerSelector = {
	normal: {
		label: 'background wrapper',
		target: ' .maxi-background-displayer',
	},
	hover: {
		label: 'background wrapper on hover',
		target: ':hover .maxi-background-displayer',
	},
};

export const getTransformSelectors = selectors => {
	return { ...selectors, background: bgDisplayerSelector };
};

export const getTransformCategories = (categories, attributes) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	return without(
		categories,
		'background hover',
		isEmpty(bgLayers) && isEmpty(bgLayersHover) && 'background'
	);
};
