/**
 * External dependencies
 */
import { isNil, isEmpty, without } from 'lodash';

function getBgLayersSelectorsCss(bgLayers) {
	const bgLayersSelectors = {
		background: {
			'background-displayer': {
				label: 'background wrapper',
				target: ' .maxi-background-displayer',
			},
		},
		'background hover': {
			'background-displayer': {
				label: 'background wrapper on hover',
				target: ':hover .maxi-background-displayer',
			},
		},
	};
	let bgLayersShowedOrder = 1;
	let bgHoverLayersShowedOrder = 1;

	bgLayers
		?.sort((a, b) => a.order - b.order)
		.forEach(bgLayer => {
			const newBgLayersSelectors = {
				...bgLayersSelectors.background,
				[`_${bgLayer.id}`]: {
					label: `background ${bgLayer.type} ${bgLayersShowedOrder}`,
					target: ` .maxi-background-displayer .maxi-background-displayer__${bgLayer.order}`,
				},
			};

			const newBgHoverSelectors = {
				...bgLayersSelectors['background hover'],
				[`_${bgLayer.id}`]: {
					label: `background ${bgLayer.type} ${bgHoverLayersShowedOrder} on hover`,
					target: `:hover .maxi-background-displayer .maxi-background-displayer__${bgLayer.order}`,
				},
			};

			bgLayersSelectors['background hover'] = newBgHoverSelectors;
			bgHoverLayersShowedOrder += 1;
			if (!bgLayer?.isHover) {
				bgLayersSelectors.background = newBgLayersSelectors;
				bgLayersShowedOrder += 1;
			}
		});

	return bgLayersSelectors;
}

export function getSelectorsCss(selectors, attributes) {
	if (isNil(attributes)) return null;

	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
		'block-background-hover-status': blockBackgroundHoverStatus = false,
	} = attributes;

	const newSelectors = {
		...selectors,
		...getBgLayersSelectorsCss([...bgLayers, ...bgLayersHover]),
	};

	if (!blockBackgroundHoverStatus) {
		delete newSelectors['background hover'];
	}

	return newSelectors;
}

export function getCategoriesCss(categories, attributes) {
	const {
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
		'block-background-hover-status': blockBackgroundHoverStatus = false,
	} = attributes;

	return without(
		categories,
		isEmpty(bgLayers) && isEmpty(bgLayersHover) && 'background',
		((isEmpty(bgLayers) && isEmpty(bgLayersHover)) ||
			!blockBackgroundHoverStatus) &&
			'background hover'
	);
}
