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
	getLastParentBlocks(state) {
		if (state) return state.lastParentBlocks;

		return false;
	},
	getBlockClientIds(state) {
		if (state) return Object.keys(state.clientIdsWithBlockCount);

		return false;
	},
};

export default selectors;
