import { isEmpty, has } from 'lodash';
import getActiveStyleCard from '../getActiveStyleCard';

export const receiveMaxiStyleCards = state => {
	if (state.styleCards) return state.styleCards;

	return false;
};

export const receiveSavedMaxiStyleCards = state => {
	if (state.savedStyleCards) return state.savedStyleCards;

	return false;
};

export const receiveMaxiActiveStyleCard = state => {
	if (state.savedStyleCards) {
		return getActiveStyleCard(state.savedStyleCards);
	}
	return false;
};

export const receiveMaxiSelectedStyleCard = state => {
	if (state.styleCards) {
		return getActiveStyleCard(state.styleCards);
	}
	return false;
};

export const receiveStyleCardsList = state => {
	if (state.styleCards)
		return Object.entries(state.styleCards).map(([key, value]) => {
			return { label: value.name, value: key };
		});

	return false;
};

export const receiveStyleCardValue = (state, target, blockStyle, SCEntry) => {
	if (state.styleCards) {
		const selectedSCStyleCard =
			state.styleCards.sc_maxi?.[blockStyle]?.styleCard;

		return !isEmpty(selectedSCStyleCard) &&
			has(selectedSCStyleCard[SCEntry], target)
			? selectedSCStyleCard[SCEntry][target]
			: false;
	}
	return false;
};
