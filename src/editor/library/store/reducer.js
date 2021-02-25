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
		cloudCat: {},
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
		case 'REQUEST_CLOUD_LIBRARY':
			// Maybe needs an optimization...
			if (action.newContent)
				action.newContent.forEach(content => {
					const { type } = content;

					state.cloudLibrary[type].push(content);
				});
			return {
				...state,
				cloudLibrary: state.cloudLibrary,
			};
		case 'SEND_LIBRARY_CAT':
			return {
				...state,
				cloudCat: action.cloudCat,
			};
		default:
			return state;
	}
};

export default reducer;
