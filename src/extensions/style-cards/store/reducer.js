/**
 * Internal dependencies
 */
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import controls from './controls';
import standardSC from '@maxi-core/defaults/defaultSC.json';

/**
 * External dependencies
 */
import { cloneDeep, merge } from 'lodash';

const getNewActiveStyleCards = (styleCards, cardKey) => {
	const newStyleCards = cloneDeep(styleCards);

	Object.entries(newStyleCards).forEach(([key, value]) => {
		const standardMerge = cloneDeep(standardSC?.sc_maxi);
		const mergeWith = cloneDeep(value);
		const newSCvalue = merge(standardMerge, mergeWith);
		newStyleCards[key] = { ...newSCvalue, status: '' };
		if (key === cardKey) {
			newStyleCards[key] = {
				...newSCvalue,
				status: 'active',
			};
		}
	});

	return newStyleCards;
};

export const getNewSelectedStyleCards = (styleCards, cardKey) => {
	const newStyleCards = cloneDeep(styleCards);

	Object.entries(newStyleCards).forEach(([key, value]) => {
		if (key === cardKey) newStyleCards[key] = { ...value, selected: true };
		else delete newStyleCards[key].selected;
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
