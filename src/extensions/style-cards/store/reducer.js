/**
 * Internal dependencies
 */
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import {
	mergeWithStandardStyleCard,
	setActiveCard,
	setSelectedCard,
} from '@extensions/style-cards/stateTransitions';
import controls from './controls';

export const getNewActiveStyleCards = (styleCards, cardKey) => {
	return setActiveCard(mergeWithStandardStyleCard(styleCards), cardKey);
};

export const getNewSelectedStyleCards = (styleCards, cardKey) => {
	return setSelectedCard(styleCards, cardKey);
};

export const removeStyleCard = (styleCards, cardKey) => {
	const newStyleCards = getNewActiveStyleCards(styleCards, 'sc_maxi');
	delete newStyleCards[cardKey];

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
		case 'SET_ACTIVE_STYLE_CARD': {
			const newActiveStyleCards = getNewActiveStyleCards(
				state.styleCards,
				action.cardKey
			);

			controls.SAVE_STYLE_CARDS(newActiveStyleCards);

			return {
				...state,
				styleCards: newActiveStyleCards,
			};
		}
		case 'SET_SELECTED_STYLE_CARD':
			return {
				...state,
				styleCards: getNewSelectedStyleCards(
					state.styleCards,
					action.cardKey
				),
			};
		case 'REMOVE_STYLE_CARD':
			controls.SAVE_STYLE_CARDS(
				removeStyleCard(
					{ ...state.styleCards, ...state.savedStyleCards },
					action.cardKey
				)
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
