/**
 * Internal dependencies
 */
import getActiveStyleCard from '../getActiveStyleCard';
import controls from './controls';
import standardSC from '../../../../core/utils/defaultSC.json';

/**
 * External dependencies
 */
import { cloneDeep, merge } from 'lodash';

const getNewActiveStyleCards = (styleCards, cardKey, activate = true) => {
	const newStyleCards = cloneDeep(styleCards);
	const currentSC = getActiveStyleCard(newStyleCards).key;

	Object.entries(newStyleCards).forEach(([key, value]) => {
		const standardMerge = cloneDeep(standardSC?.sc_maxi);
		const mergeWith = cloneDeep(value);
		const newSCvalue = merge(standardMerge, mergeWith);
		if (!activate) {
			newStyleCards[key] = { ...newSCvalue };
		} else {
			if (key === currentSC)
				newStyleCards[key] = { ...newSCvalue, status: '' };
			if (key === cardKey) {
				newStyleCards[key] = {
					...newSCvalue,
					status: 'active',
				};
			}
		}
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
					action.cardKey,
					false
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
