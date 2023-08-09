const selectors = {
	getBlocks(state) {
		if (state) return state.blocks;

		return false;
	},
	getBlock(state, uniqueID) {
		if (state && uniqueID) return state.blocks[uniqueID];

		return false;
	},
	getBlockRoot(state, uniqueID) {
		if (state && uniqueID) return state.blocks?.[uniqueID]?.blockRoot;

		return false;
	},
	getLastInsertedBlocks(state) {
		if (state) return state.lastInsertedBlocks;

		return false;
	},
	getBlockClientIds(state) {
		if (state) return state.blockClientIds;

		return false;
	},
};

export default selectors;
