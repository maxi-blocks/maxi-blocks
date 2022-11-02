/**
 * External dependencies
 */
import { without, isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { getBgLayersSelectorsCss } from '../custom-css-control/utils';

const getBgLayersSelectorsKeys = bgLayersSelectors =>
	Array.from(
		new Set(
			Object.keys({
				...bgLayersSelectors.background,
				...bgLayersSelectors['background hover'],
			})
		)
	);

const getLabel = (key, bgLayersSelectors) => {
	const rawLabel = (bgLayersSelectors.background ||
		bgLayersSelectors['background hover'])[key].label;
	switch (rawLabel) {
		// Exception for background wrapper, as it existed before with the label 'background'
		case 'background wrapper':
			return 'background';
		default:
			return rawLabel;
	}
};

export const getTransformSelectors = (selectors, attributes) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	const bgLayersSelectors = getBgLayersSelectorsCss([
		...bgLayers,
		...bgLayersHover,
	]);

	return {
		...selectors,
		...getBgLayersSelectorsKeys(bgLayersSelectors).reduce((acc, key) => {
			const bgLayerSelectors = bgLayersSelectors.background[key];
			const bgLayerHoverSelectors =
				bgLayersSelectors['background hover'][key];

			if (
				[bgLayerSelectors, bgLayerHoverSelectors].some(
					item => !isEmpty(item)
				)
			) {
				const label = getLabel(key, bgLayersSelectors);

				acc[label] = {};
				if (!isEmpty(bgLayerSelectors)) {
					acc[label].normal = bgLayerSelectors;
				}
				if (!isEmpty(bgLayerHoverSelectors)) {
					acc[label].hover = bgLayerHoverSelectors;
				}
			}

			return acc;
		}, {}),
	};
};

export const getTransformCategories = (categories, attributes) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	const bgLayersSelectors = getBgLayersSelectorsCss([
		...bgLayers,
		...bgLayersHover,
	]);

	return without(
		[
			...without(categories, 'background', 'background hover'),
			...getBgLayersSelectorsKeys(bgLayersSelectors).map(key =>
				getLabel(key, bgLayersSelectors)
			),
		],
		isEmpty(bgLayers) && isEmpty(bgLayersHover) && 'background'
	);
};
