const selectors = {
	receiveRelations(state) {
		if (state) return state.relations;

		return false;
	},

	// Giving a concrete block uniqueID, return the trigger blocks affecting this block
	receiveBlockUnderRelationClientIDs(state, uniqueID) {
		if (!state) return false;

		const { relations } = state;

		if (relations) {
			const result = [];

			Object.entries(relations).forEach(([triggerUniqueID, relation]) => {
				if (uniqueID in relation)
					result.push({
						uniqueID: triggerUniqueID,
						clientId: relation.clientId,
					});
			});

			return result;
		}

		return false;
	},
};

export default selectors;
