const selectors = {
	receiveRelations(state) {
		if (state) return state.relations;

		return false;
	},
};

export default selectors;
