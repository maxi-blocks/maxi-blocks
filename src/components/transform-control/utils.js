/**
 * Internal dependencies
 */
import { getBgLayersSelectorsCss } from '../custom-css-control/utils';

/**
 * External dependencies
 */
import { isEmpty, pickBy, uniq, without } from 'lodash';
import { getAttributesValue } from '../../extensions/attributes';
import { getSelectorKeyLongLabel } from '../../extensions/attributes/dictionary/objectKeyParsers';

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
			return 'bg';
		default:
			return key;
	}
};

export const getTransformSelectors = (selectors, attributes = {}) => {
	const [bgLayers = [], bgLayersHover = []] = getAttributesValue({
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
					[key]: ['n', 'h'].reduce(
						(acc, type) => ({
							...acc,
							[type]: {
								...obj[type],
								label: getSelectorKeyLongLabel(key),
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
						n: bgLayerSelectors,
						h: bgLayerHoverSelectors,
					},
					value => !isEmpty(value)
				);

			return acc;
		}, {}),
	};
};

export const getTransformCategories = (categories, attributes) => {
	const [bgLayers = [], bgLayersHover = []] = getAttributesValue({
		target: ['b_ly', 'b_ly.h'],
		props: attributes,
	});

	const bgLayersSelectors = getBgLayersSelectorsCss(
		[...bgLayers, ...bgLayersHover],
		false
	);

	return without(
		[
			...without(categories, 'bg', 'bg h'),
			...getBgLayersSelectorsKeys(bgLayersSelectors).map(key =>
				getKey(key)
			),
		],
		isEmpty(bgLayers) && isEmpty(bgLayersHover) && 'bg'
	);
};
