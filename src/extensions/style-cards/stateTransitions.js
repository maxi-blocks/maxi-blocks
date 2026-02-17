/**
 * External dependencies
 */
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import standardSC from '@maxi-core/defaults/defaultSC.json';

const ACTIVE_STATUS = 'active';

const getCardStatus = isActive => (isActive ? ACTIVE_STATUS : '');
const omitSelected = ({ selected, ...card }) => card;

export const mergeWithStandardStyleCard = (styleCards = {}) => {
	const standardTemplate = standardSC?.sc_maxi;

	return Object.entries(styleCards).reduce(
		(mergedStyleCards, [key, value]) => {
			mergedStyleCards[key] = merge({}, standardTemplate, value);

			return mergedStyleCards;
		},
		{}
	);
};

export const setCardStatus = (styleCards = {}, cardKey, isActive) => {
	if (!styleCards?.[cardKey]) return { ...styleCards };

	return {
		...styleCards,
		[cardKey]: {
			...styleCards[cardKey],
			status: getCardStatus(isActive),
		},
	};
};

export const setActiveCard = (styleCards = {}, cardKey) => {
	return Object.entries(styleCards).reduce((nextStyleCards, [key, value]) => {
		nextStyleCards[key] = {
			...value,
			status: getCardStatus(key === cardKey),
		};

		return nextStyleCards;
	}, {});
};

export const setSelectedCard = (styleCards = {}, cardKey) => {
	return Object.entries(styleCards).reduce((nextStyleCards, [key, value]) => {
		if (key === cardKey) {
			nextStyleCards[key] = {
				...value,
				selected: true,
			};

			return nextStyleCards;
		}

		nextStyleCards[key] = omitSelected(value);

		return nextStyleCards;
	}, {});
};

const getToneCardWithCustomColors = (toneCard = {}, customColors = []) => ({
	...toneCard,
	styleCard: {
		...(toneCard.styleCard || {}),
		color: {
			...(toneCard.styleCard?.color || {}),
			customColors: [...customColors],
		},
	},
});

export const updateCardCustomColors = (
	styleCards = {},
	cardKey,
	colors = []
) => {
	if (!styleCards?.[cardKey]) return { ...styleCards };

	const card = styleCards[cardKey];

	return {
		...styleCards,
		[cardKey]: {
			...card,
			color: {
				...(card.color || {}),
				customColors: [...colors],
			},
			light: getToneCardWithCustomColors(card.light, colors),
			dark: getToneCardWithCustomColors(card.dark, colors),
		},
	};
};

export const upsertCard = (styleCards = {}, cardKey, payload = {}) => {
	if (cardKey == null) return { ...styleCards };

	return {
		...styleCards,
		[cardKey]: {
			...styleCards[cardKey],
			...payload,
		},
	};
};
