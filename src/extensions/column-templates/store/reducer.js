/**
 * Reducer managing the columns
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function reducer(state = { contentBackup: {} }, action) {
	switch (action.type) {
		case 'RECEIVE_CONTENT_BACKUP':
			return {
				...state,
				clientId: action.clientId,
			};
		case 'SEND_CONTENT_BACKUP':
			return {
				...state,
				contentBackup: {
					...state.contentBackup,
					[action.clientId]: {
						...state.contentBackup[action.clientId],
						...action.contentBackup,
					},
				},
			};
		case 'REMOVE_CONTENT_BACKUP':
			delete state.contentBackup[action.clientId];
			return state;
		default:
			return state;
	}
}

export default reducer;
