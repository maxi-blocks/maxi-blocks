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

export function saveMaxiStyleCards(styleCards) {
	return {
		type: 'SAVE_STYLE_CARDS',
		styleCards,
	};
}
