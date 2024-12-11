export function sendMaxiProStatus(data) {
	return {
		type: 'SEND_PRO_STATUS',
		data,
	};
}

export function receiveMaxiProStatus() {
	return {
		type: 'RECEIVE_PRO_STATUS',
	};
}

export function saveMaxiProStatus(data) {
	return {
		type: 'SAVE_PRO_STATUS',
		data,
	};
}
