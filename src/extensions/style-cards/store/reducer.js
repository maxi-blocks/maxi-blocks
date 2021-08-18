/**
 * Internal dependencies
 */
import getActiveStyleCard from '../getActiveStyleCard';
import controls from './controls';

const getNewActiveStyleCards = (styleCards, cardKey) => {
	const newStyleCards = { ...styleCards };
	const currentSC = getActiveStyleCard(newStyleCards).key;

	Object.entries(newStyleCards).forEach(([key, value]) => {
		if (key === currentSC) newStyleCards[key] = { ...value, status: '' };
		if (key === cardKey)
			newStyleCards[key] = { ...value, status: 'active' };
	});

	return newStyleCards;
};

const removeStyleCard = (styleCards, cardKey) => {
	const newStyleCards = { ...getNewActiveStyleCards(styleCards, 'sc_maxi') };

	Object.keys(newStyleCards).forEach(key => {
		if (key === cardKey) delete newStyleCards[key];
	});

	return newStyleCards;
};

function reducer(state = { styleCards: {}, savedStyleCards: {} }, action) {
	switch (action.type) {
		case 'SEND_STYLE_CARDS':
			return {
				...state,
				styleCards: action.styleCards,
				savedStyleCards: action.styleCards,
			};
		case 'SAVE_STYLE_CARDS':
			if (action.isUpdate) controls.SAVE_STYLE_CARDS(action.styleCards);

			return {
				...state,
				styleCards: action.styleCards,
				...(action.isUpdate && { savedStyleCards: action.styleCards }),
			};
		case 'SET_ACTIVE_STYLE_CARD':
			controls.SAVE_STYLE_CARDS(
				getNewActiveStyleCards(state.styleCards, action.cardKey)
			);
			return {
				...state,
				styleCards: getNewActiveStyleCards(
					state.styleCards,
					action.cardKey
				),
			};
		case 'SET_SELECTED_STYLE_CARD':
			return {
				...state,
				styleCards: getNewActiveStyleCards(
					state.styleCards,
					action.cardKey
				),
			};
		case 'REMOVE_STYLE_CARD':
			controls.SAVE_STYLE_CARDS(
				removeStyleCard(state.styleCards, action.cardKey)
			);

			return {
				...state,
				styleCards: removeStyleCard(state.styleCards, action.cardKey),
			};
		case 'UPDATE_STYLE_CARD':
			controls.UPDATE_STYLE_CARD(
				getActiveStyleCard(state.styleCards),
				action.isUpdate
			);

			return {
				...state,
			};
		case 'RESET_STYLE_CARDS':
			controls.RESET_STYLE_CARDS();

			return {
				...state,
			};
		default:
			return state;
	}
}

export default reducer;
