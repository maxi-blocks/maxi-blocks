const actions = {
	addBlock(uniqueID, clientId, blockRoot) {
		return {
			type: 'ADD_BLOCK',
			uniqueID,
			clientId,
			blockRoot,
		};
	},
	removeBlock(uniqueID, clientId) {
		return {
			type: 'REMOVE_BLOCK',
			uniqueID,
			clientId,
		};
	},
	updateBlockStylesRoot(uniqueID, blockRoot) {
		return {
			type: 'UPDATE_BLOCK_STYLES_ROOT',
			uniqueID,
			blockRoot,
		};
	},
	saveLastInsertedBlocks() {
		return {
			type: 'SAVE_LAST_INSERTED_BLOCKS',
		};
	},
	saveBlockClientIds(blockClientIds) {
		return {
			type: 'SAVE_BLOCK_CLIENT_IDS',
			blockClientIds,
		};
	},
};

export default actions;
