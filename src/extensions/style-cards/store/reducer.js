/**
 * Internal dependencies
 */
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import {
	setActiveCard,
	setSelectedCard,
} from '@extensions/style-cards/stateTransitions';
import controls from './controls';
import standardSC from '@maxi-core/defaults/defaultSC.json';

/**
 * External dependencies
 */
import { cloneDeep, merge } from 'lodash';

const mergeWithStandardStyleCard = styleCards =>
	Object.entries(cloneDeep(styleCards)).reduce(
		(mergedStyleCards, [key, value]) => {
			const standardMerge = cloneDeep(standardSC?.sc_maxi);
			const mergeWith = cloneDeep(value);
			mergedStyleCards[key] = merge(standardMerge, mergeWith);

			return mergedStyleCards;
		},
		{}
	);

export const getNewActiveStyleCards = (styleCards, cardKey) => {
	return setActiveCard(mergeWithStandardStyleCard(styleCards), cardKey);
};

export const getNewSelectedStyleCards = (styleCards, cardKey) => {
	return setSelectedCard(cloneDeep(styleCards), cardKey);
};

export const removeStyleCard = (styleCards, cardKey) => {
	const newStyleCards = getNewActiveStyleCards(styleCards, 'sc_maxi');
	const nextStyleCards = { ...newStyleCards };

	delete nextStyleCards[cardKey];

	return nextStyleCards;
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
