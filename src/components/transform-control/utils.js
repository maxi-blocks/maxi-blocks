/**
 * Internal dependencies
 */
import { getBgLayersSelectorsCss } from '@components/custom-css-control/utils';
import { prefixes as searchPrefixes } from '@blocks/search-maxi/data';

/**
 * External dependencies
 */
import { isEmpty, pickBy, uniq, without } from 'lodash';
import { __ } from '@wordpress/i18n';

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

export const getTransformSelectors = (
	selectors,
	attributes = {},
	cleanParallaxLayers
) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	const bgLayersSelectors = getBgLayersSelectorsCss(
		[...bgLayers, ...bgLayersHover],
		false,
		false,
		cleanParallaxLayers
	);

	return {
		...(!isEmpty(selectors) &&
			Object.entries(selectors).reduce(
				(acc, [key, obj]) => ({
					...acc,
					[key]: ['normal', 'hover', 'canvas hover'].reduce(
						(acc, type) =>
							obj[type]
								? {
										...acc,
										[type]: {
											...obj[type],
											label: key,
										},
								  }
								: acc,
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

export const getTransformCategories = (categories, attributes, blockName) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
		'shape-divider-top-status': shapeDividerTopStatus,
		'shape-divider-bottom-status': shapeDividerBottomStatus,
		'icon-content': iconContent,
		[`${searchPrefixes.closeIconPrefix}icon-content`]: closeIconContent,
		skin,
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
		isEmpty(bgLayers) && isEmpty(bgLayersHover) && 'background',
		...(blockName === 'container-maxi' && [
			!shapeDividerTopStatus && 'top shape divider',
			!shapeDividerBottomStatus && 'bottom shape divider',
		]),
		...(blockName === 'button-maxi' && [isEmpty(iconContent) && 'icon']),
		...(blockName === 'search-maxi' && [
			isEmpty(iconContent) && 'icon',
			isEmpty(closeIconContent) && 'close icon',
			skin !== 'icon-reveal' && 'close icon',
		])
	);
};

export const getDisabledTransformCategories = (
	disabledCategories,
	attributes
) => {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
	} = attributes;

	const allBgLayers = [...bgLayers, ...bgLayersHover];

	let message;

	const bgLayersWithParallaxCategories = allBgLayers
		.map(bgLayer => {
			const { 'background-image-parallax-status': parallaxStatus } =
				bgLayer;

			if (parallaxStatus) {
				if (!message)
					message = __(
						'Transform settings is not compatible with parallax effect. Please disable parallax effect to use transform settings.',
						'maxi-blocks'
					);

				return {
					category: `_${bgLayer.id}`,
					message,
				};
			}

			return null;
		})
		.filter(Boolean);

	if (isEmpty(bgLayersWithParallaxCategories)) return disabledCategories;

	if (isEmpty(disabledCategories)) return bgLayersWithParallaxCategories;

	return [...disabledCategories, ...bgLayersWithParallaxCategories];
};
