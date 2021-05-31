import getActiveStyleCard from '../getActiveStyleCard';

export const receiveMaxiStyleCards = state => {
	if (state.styleCards) return state.styleCards;

	return false;
};

export const receiveMaxiActiveStyleCard = state => {
	if (state.styleCards) {
		return getActiveStyleCard(state.styleCards);
	}
	return false;
};
