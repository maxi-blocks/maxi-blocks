import getActiveStyleCard from '../getActiveStyleCard';
import { getIsValid } from '../../styles';

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
		return getActiveStyleCard(state.styleCards, true);
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

const getSCValues = (SC, rawTarget, blockStyle, SCEntry) => {
	const getSCValue = target => {
		const styleCardEntry = {
			...SC.value?.[blockStyle]?.defaultStyleCard[SCEntry],
			...SC.value?.[blockStyle]?.styleCard[SCEntry],
		};
		const value = styleCardEntry?.[target];

		return getIsValid(value, true) ? value : false;
	};

	if (typeof rawTarget === 'string') return getSCValue(rawTarget);

	const response = {};

	rawTarget.forEach(target => {
		response[target] = getSCValue(target);
	});

	return response;
};

export const receiveActiveStyleCardValue = (
	state,
	rawTarget,
	blockStyle,
	SCEntry
) => {
	if (state.styleCards)
		return getSCValues(
			getActiveStyleCard(state.styleCards),
			rawTarget,
			blockStyle,
			SCEntry
		);

	return false;
};

export const receiveSelectedStyleCardValue = (
	state,
	rawTarget,
	blockStyle,
	SCEntry
) => {
	if (state.styleCards)
		return getSCValues(
			getActiveStyleCard(state.styleCards, true),
			rawTarget,
			blockStyle,
			SCEntry
		);

	return false;
};
