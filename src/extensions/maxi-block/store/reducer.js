const reducer = (
	state = {
		blocks: {},
		lastInsertedBlocks: [],
		blockClientIds: [],
		newBlocksUniqueIDs: [],
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
			const { uniqueID, clientId } = action;

			delete state.blocks[uniqueID];

			return {
				...state,
				lastInsertedBlocks: state.lastInsertedBlocks.filter(
					item => item !== clientId
				),
				blockClientIds: state.blockClientIds.filter(
					item => item !== clientId
				),
				newBlocksUniqueIDs: state.newBlocksUniqueIDs.filter(
					item => item !== uniqueID
				),
			};
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
		case 'ADD_NEW_BLOCK': {
			const { uniqueID } = action;

			return {
				...state,
				newBlocksUniqueIDs: [...state.newBlocksUniqueIDs, uniqueID],
			};
		}
		case 'SAVE_LAST_INSERTED_BLOCKS': {
			if (action.isCurrentPostClean) {
				return state;
			}

			const { allClientIds } = action;
			const savedClientIds = state.blockClientIds;

			const lastInsertedBlocks = [...allClientIds].filter(
				clientId => !savedClientIds.includes(clientId)
			);

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
