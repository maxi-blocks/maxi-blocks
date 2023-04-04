const actions = {
	addBlock(uniqueID, clientId) {
		return {
			type: 'ADD_BLOCK',
			uniqueID,
			clientId,
		};
	},
	removeBlock(uniqueID, clientId) {
		return {
			type: 'REMOVE_BLOCK',
			uniqueID,
			clientId,
		};
	},
	updateBlock(uniqueID, clientId) {
		return {
			type: 'UPDATE_BLOCK',
			uniqueID,
			clientId,
		};
	},
};

export default actions;
