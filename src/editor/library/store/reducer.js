/**
 * Reducer
 */
const reducer = (
	state = {
		cloudLibrary: {
			pages: [],
			patterns: [],
			blocks: [],
			styleCards: [],
		},
	},
	action
) => {
	switch (action.type) {
		case 'SEND_CLOUD_LIBRARY':
			return {
				...state,
				cloudLibrary: {
					...state.cloudLibrary,
					[action.objType]: action.cloudLibrary,
				},
			};
		default:
			return state;
	}
};

export default reducer;
