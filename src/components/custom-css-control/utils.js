/**
 * External dependencies
 */
import { isEmpty, without } from 'lodash';

function getBgLayersSelectorsCss(bgLayers) {
	const bgLayersSelectors = {
		background: {},
		'background hover': {},
	};
	let bgLayersShowedOrder = 1;

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
					label: `background ${bgLayer.type} ${
						bgLayer.order + 1
					} on hover`,
					target: `:hover .maxi-background-displayer .maxi-background-displayer__${bgLayer.order}`,
				},
			};

			bgLayersSelectors['background hover'] = newBgHoverSelectors;
			if (!bgLayer?.isHover) {
				bgLayersSelectors.background = newBgLayersSelectors;
				bgLayersShowedOrder += 1;
			}
		});

	return bgLayersSelectors;
}

export function getSelectorsCss(selectors, attributes) {
	const {
		'block-background-hover-status': blockBackgroundHoverStatus,
		'background-layers': bgLayers = [],
		'background-layers-hover': bgLayersHover = [],
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
		'block-background-hover-status': blockBackgroundHoverStatus,
		'background-layers': bgLayers,
	} = attributes;

	return without(
		categories,
		isEmpty(bgLayers) && 'background',
		!blockBackgroundHoverStatus && 'background hover'
	);
}
