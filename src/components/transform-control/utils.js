/**
 * External dependencies
 */
import { isEmpty, pickBy, uniq, without } from 'lodash';

/**
 * Internal dependencies
 */
import { getBgLayersSelectorsCss } from '../custom-css-control/utils';

const getBgLayersSelectorsKeys = bgLayersSelectors =>
	uniq(
		Object.keys({
			...bgLayersSelectors['background hover'],
			...bgLayersSelectors.background,
		})
	);

const getKey = key => {
	switch (key) {
		case 'background-displayer':
			// Exception for background wrapper, as it existed before with the label 'background'
			return 'background';
		default:
			return key;
	}
};

export const getTransformSelectors = (selectors, attributes) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	const bgLayersSelectors = getBgLayersSelectorsCss(
		[...bgLayers, ...bgLayersHover],
		false
	);

	return {
		...(!isEmpty(selectors) &&
			Object.entries(selectors).reduce((acc, [key, obj]) => ({
				...acc,
				[key]: ['normal', 'hover'].reduce(
					(acc, type) => ({
						...acc,
						[type]: {
							...obj[key],
							label: key,
						},
					}),
					{}
				),
			}))),
		...getBgLayersSelectorsKeys(bgLayersSelectors).reduce((acc, key) => {
			const bgLayerSelectors = bgLayersSelectors.background[key];
			const bgLayerHoverSelectors =
				bgLayersSelectors['background hover'][key];

			if (
				[bgLayerSelectors, bgLayerHoverSelectors].some(
					item => !isEmpty(item)
				)
			)
				acc[getKey(key)] = pickBy(
					{
						normal: bgLayerSelectors,
						hover: bgLayerHoverSelectors,
					},
					value => !isEmpty(value)
				);

			return acc;
		}, {}),
	};
};

export const getTransformCategories = (categories, attributes) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	const bgLayersSelectors = getBgLayersSelectorsCss(
		[...bgLayers, ...bgLayersHover],
		false
	);

	return without(
		[
			...without(categories, 'background', 'background hover'),
			...getBgLayersSelectorsKeys(bgLayersSelectors).map(key =>
				getKey(key)
			),
		],
		isEmpty(bgLayers) && isEmpty(bgLayersHover) && 'background'
	);
};
