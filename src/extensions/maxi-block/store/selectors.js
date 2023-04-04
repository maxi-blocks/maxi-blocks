const selectors = {
	receiveBlocks(state) {
		if (state) return state.blocks;

		return false;
	},
};

export default selectors;
