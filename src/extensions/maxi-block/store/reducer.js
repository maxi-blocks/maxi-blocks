const reducer = (
	state = {
		blocks: {},
		lastInsertedBlocks: [],
		blockClientIds: [],
		newBlocksUniqueIDs: [],
		blockClientIdsWithUpdatedAttributes: [],
		// Cache of all uniqueIDs for O(1) lookup (site-wide from DB + current editor)
		uniqueIDCache: {},
		uniqueIDCacheLoaded: false,
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
				// Also add to uniqueID cache for O(1) lookup
				uniqueIDCache: {
					...state.uniqueIDCache,
					[uniqueID]: true,
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
				blockClientIdsWithUpdatedAttributes:
					state.blockClientIdsWithUpdatedAttributes.filter(
						item => item !== clientId
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
		case 'ADD_BLOCK_WITH_UPDATED_ATTRIBUTES': {
			if (!action.clientId) return state;

			return {
				...state,
				blockClientIdsWithUpdatedAttributes: [
					...state.blockClientIdsWithUpdatedAttributes,
					action.clientId,
				],
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
		case 'LOAD_UNIQUE_ID_CACHE': {
			const { uniqueIDs } = action;
			const cache = {};

			// Convert array to object for O(1) lookup
			uniqueIDs.forEach(id => {
				cache[id] = true;
			});

			return {
				...state,
				uniqueIDCache: cache,
				uniqueIDCacheLoaded: true,
			};
		}
		case 'ADD_TO_UNIQUE_ID_CACHE': {
			const { uniqueID } = action;

			return {
				...state,
				uniqueIDCache: {
					...state.uniqueIDCache,
					[uniqueID]: true,
				},
			};
		}
		case 'REMOVE_FROM_UNIQUE_ID_CACHE': {
			const { uniqueID } = action;
			const newCache = { ...state.uniqueIDCache };
			delete newCache[uniqueID];

			return {
				...state,
				uniqueIDCache: newCache,
			};
		}
		case 'ADD_MULTIPLE_TO_UNIQUE_ID_CACHE': {
			const { uniqueIDs } = action;
			const newCache = { ...state.uniqueIDCache };

			uniqueIDs.forEach(id => {
				newCache[id] = true;
			});

			return {
				...state,
				uniqueIDCache: newCache,
			};
		}
		default:
			return state;
	}
};

export default reducer;
