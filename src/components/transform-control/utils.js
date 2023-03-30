/**
 * Internal dependencies
 */
import { getBgLayersSelectorsCss } from '../custom-css-control/utils';

/**
 * External dependencies
 */
import { isEmpty, pickBy, uniq, without } from 'lodash';
import { getAttributesValue } from '../../extensions/attributes';

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

export const getTransformSelectors = (selectors, attributes = {}) => {
	const { b_ly: bgLayers = [], 'b_ly.h': bgLayersHover = [] } =
		getAttributesValue({
			target: ['b_ly', 'b_ly.h'],
			props: attributes,
		});

	const bgLayersSelectors = getBgLayersSelectorsCss(
		[...bgLayers, ...bgLayersHover],
		false,
		false
	);

	return {
		...(!isEmpty(selectors) &&
			Object.entries(selectors).reduce(
				(acc, [key, obj]) => ({
					...acc,
					[key]: ['normal', 'hover'].reduce(
						(acc, type) => ({
							...acc,
							[type]: {
								...obj[type],
								label: key,
							},
						}),
						{}
					),
				}),
				{}
			)),
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
	const { b_ly: bgLayers = [], 'b_ly.h': bgLayersHover = [] } =
		getAttributesValue({
			target: ['b_ly', 'b_ly.h'],
			props: attributes,
		});

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
