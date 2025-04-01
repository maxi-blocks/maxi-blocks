const selectors = {
	receiveMaxiBlocksSavedStyles(state) {
		if (state && state.savedStyles) return state.savedStyles;
		return {};
	},
};

export default selectors;
