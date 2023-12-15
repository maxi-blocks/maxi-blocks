export function sendMaxiStyleCards(styleCards) {
	return {
		type: 'SEND_STYLE_CARDS',
		styleCards,
	};
}

export function receiveMaxiStyleCards() {
	return {
		type: 'RECEIVE_STYLE_CARDS',
	};
}

export function updateStyleCardOnEditor(styleCards, activeSCColour) {
	return {
		type: 'UPDATE_STYLE_CARD_ON_EDITOR',
		styleCards,
		activeSCColour,
	};
}

export function saveMaxiStyleCards(styleCards, isUpdate = false) {
	return {
		type: 'SAVE_STYLE_CARDS',
		styleCards,
		isUpdate,
	};
}

export function setActiveStyleCard(cardKey) {
	return {
		type: 'SET_ACTIVE_STYLE_CARD',
		cardKey,
	};
}

export function setSelectedStyleCard(cardKey) {
	return {
		type: 'SET_SELECTED_STYLE_CARD',
		cardKey,
	};
}

export function removeStyleCard(cardKey) {
	return {
		type: 'REMOVE_STYLE_CARD',
		cardKey,
	};
}

export function saveSCStyles(isUpdate) {
	return {
		type: 'UPDATE_STYLE_CARD',
		isUpdate,
	};
}

export function resetSC() {
	return {
		type: 'RESET_STYLE_CARDS',
	};
}
