const actions = {
	addRelation(triggerBlock, targetBlock) {
		return {
			type: 'ADD_RELATION',
			triggerBlock,
			targetBlock,
		};
	},
	removeRelation(triggerBlock, targetBlock) {
		return {
			type: 'REMOVE_RELATION',
			triggerBlock,
			targetBlock,
		};
	},
	removeBlockRelation(uniqueID) {
		return {
			type: 'REMOVE_BLOCK_RELATION',
			uniqueID,
		};
	},
	updateRelation(prevUniqueID, uniqueID) {
		return {
			type: 'UPDATE_RELATION',
			prevUniqueID,
			uniqueID,
		};
	},
};

export default actions;
