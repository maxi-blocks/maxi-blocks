const ACTIVE_STATUS = 'active';

const getCardStatus = isActive => (isActive ? ACTIVE_STATUS : '');

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

		nextStyleCards[key] = { ...value };
		delete nextStyleCards[key].selected;

		return nextStyleCards;
	}, {});
};

const getToneCardWithCustomColors = (toneCard = {}, customColors = []) => ({
	...toneCard,
	defaultStyleCard: {
		...(toneCard.defaultStyleCard || {}),
	},
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

	const customColors = [...colors];
	const card = styleCards[cardKey];

	return {
		...styleCards,
		[cardKey]: {
			...card,
			color: {
				...(card.color || {}),
				customColors: [...customColors],
			},
			light: getToneCardWithCustomColors(card.light, customColors),
			dark: getToneCardWithCustomColors(card.dark, customColors),
		},
	};
};

export const upsertCard = (styleCards = {}, cardKey, payload = {}) => {
	if (!cardKey) return { ...styleCards };

	return {
		...styleCards,
		[cardKey]: {
			...styleCards[cardKey],
			...payload,
		},
	};
};
