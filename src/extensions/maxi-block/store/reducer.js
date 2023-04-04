const reducer = (
	state = {
		blocks: {},
	},
	action
) => {
	switch (action.type) {
		case 'ADD_BLOCK': {
			const { uniqueID, clientId } = action;

			return {
				...state,
				blocks: {
					...state.blocks,
					[uniqueID]: clientId,
				},
			};
		}
		case 'REMOVE_BLOCK': {
			const { uniqueID } = action;

			delete state.blocks[uniqueID];

			return state;
		}
		case 'UPDATE_BLOCK': {
			const { uniqueID, clientId } = action;

			// Remove old block looking its clientId
			const oldBlock = Object.keys(state.blocks).find(
				blockUniqueID => state.blocks[blockUniqueID] === clientId
			);

			if (oldBlock) delete state.blocks[oldBlock];

			return {
				...state,
				blocks: {
					...state.blocks,
					[uniqueID]: clientId,
				},
			};
		}
		default:
			return state;
	}
};

export default reducer;
