const DEFAULT_STATE = {
	savedStyles: {},
};

const reducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case 'GET_MAXI_BLOCKS_SAVED_STYLES':
			return state;
		case 'SET_MAXI_BLOCKS_SAVED_STYLES':
			return {
				...state,
				savedStyles: action.styles || state.savedStyles,
			};
		default:
			return state;
	}
};

export default reducer;
