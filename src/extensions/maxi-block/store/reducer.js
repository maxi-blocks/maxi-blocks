const reducer = (
	state = {
		blocks: {},
		lastInsertedBlocks: [],
		blockClientIds: [],
	},
	action
) => {
	switch (action.type) {
		case 'ADD_BLOCK': {
			const { uniqueID, clientId, blockRoot } = action;

			return {
				...state,
				blocks: {
					...state.blocks,
					[uniqueID]: {
						clientId,
						blockRoot,
					},
				},
			};
		}
		case 'REMOVE_BLOCK': {
			const { uniqueID } = action;

			delete state.blocks[uniqueID];

			return state;
		}
		case 'UPDATE_BLOCK_STYLES_ROOT': {
			const { uniqueID, blockRoot } = action;

			return {
				...state,
				blocks: {
					...state.blocks,
					[uniqueID]: {
						...state.blocks[uniqueID],
						blockRoot,
					},
				},
			};
		}
		case 'SAVE_LAST_INSERTED_BLOCKS': {
			const { lastInsertedBlocks } = action;

			return {
				...state,
				lastInsertedBlocks,
			};
		}
		case 'SAVE_BLOCK_CLIENT_IDS': {
			const { blockClientIds } = action;

			return {
				...state,
				blockClientIds,
			};
		}
		default:
			return state;
	}
};

export default reducer;
