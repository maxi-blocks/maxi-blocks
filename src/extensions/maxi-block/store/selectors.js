const EMPTY_ARRAY = [];

const selectors = {
	getBlocks(state) {
		if (state) return state.blocks;

		return false;
	},
	getBlock(state, uniqueID) {
		if (state && uniqueID) return state.blocks[uniqueID];

		return false;
	},
	getBlockByClientId(state, clientId) {
		if (state && clientId) {
			if (state.blocksByClientId?.[clientId]) {
				return state.blocksByClientId[clientId];
			}

			for (const uniqueID in state.blocks) {
				if (state.blocks[uniqueID].clientId === clientId) {
					return state.blocks[uniqueID];
				}
			}
		}

		return false;
	},
	getBlockRoot(state, uniqueID) {
		if (state && uniqueID) return state.blocks?.[uniqueID]?.blockRoot;

		return false;
	},
	getIsNewBlock(state, uniqueID) {
		if (state && uniqueID)
			return state.newBlocksUniqueIDs.includes(uniqueID);

		return false;
	},
	getIsBlockWithUpdatedAttributes(state, clientId) {
		if (state && clientId)
			return state.blockClientIdsWithUpdatedAttributes.includes(clientId);

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
	getUniqueIDClientIds(state, uniqueID) {
		if (!state || !uniqueID) return EMPTY_ARRAY;
		return state.blockClientIdsByUniqueID?.[uniqueID] ?? EMPTY_ARRAY;
	},
	getUniqueIDCount(state, uniqueID) {
		if (!state || !uniqueID) return 0;
		return state.blockClientIdsByUniqueID?.[uniqueID]?.length ?? 0;
	},
	getCustomLabelClientIds(state, customLabel) {
		if (!state || customLabel == null) return EMPTY_ARRAY;
		return state.customLabelClientIds?.[customLabel] ?? EMPTY_ARRAY;
	},
	getCustomLabelCount(state, customLabel) {
		if (!state || customLabel == null) return 0;
		return state.customLabelClientIds?.[customLabel]?.length ?? 0;
	},
	// UniqueID cache selectors for O(1) lookup performance
	isUniqueIDCacheLoaded(state) {
		return state?.uniqueIDCacheLoaded ?? false;
	},
	isUniqueIDInCache(state, uniqueID) {
		if (!state || !uniqueID) return false;
		return uniqueID in state.uniqueIDCache;
	},
	getUniqueIDCache(state) {
		if (state) return state.uniqueIDCache;
		return {};
	},
};

export default selectors;
