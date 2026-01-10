const reducer = (
	state = {
		blocks: {},
		blockClientIdsByUniqueID: {},
		customLabelClientIds: {},
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
			const { uniqueID, clientId, blockRoot, customLabel } = action;
			const existingClientIds =
				state.blockClientIdsByUniqueID[uniqueID] ?? [];
			const nextClientIds = existingClientIds.includes(clientId)
				? existingClientIds
				: [...existingClientIds, clientId];
			const nextCustomLabelClientIds = { ...state.customLabelClientIds };

			if (customLabel) {
				const existingLabelClientIds =
					state.customLabelClientIds[customLabel] ?? [];
				nextCustomLabelClientIds[customLabel] =
					existingLabelClientIds.includes(clientId)
						? existingLabelClientIds
						: [...existingLabelClientIds, clientId];
			}

			return {
				...state,
				blocks: {
					...state.blocks,
					[uniqueID]: {
						clientId,
						blockRoot,
						customLabel,
					},
				},
				blockClientIdsByUniqueID: {
					...state.blockClientIdsByUniqueID,
					[uniqueID]: nextClientIds,
				},
				customLabelClientIds: nextCustomLabelClientIds,
				// Also add to uniqueID cache for O(1) lookup
				uniqueIDCache: {
					...state.uniqueIDCache,
					[uniqueID]: true,
				},
			};
		}
		case 'REMOVE_BLOCK': {
			const { uniqueID, clientId, customLabel } = action;
			const blockData = state.blocks[uniqueID];
			const resolvedCustomLabel = customLabel ?? blockData?.customLabel;
			const existingClientIds =
				state.blockClientIdsByUniqueID[uniqueID] ?? [];
			const nextClientIds = existingClientIds.filter(
				existingClientId => existingClientId !== clientId
			);
			const nextBlockClientIdsByUniqueID = {
				...state.blockClientIdsByUniqueID,
			};
			const nextCustomLabelClientIds = { ...state.customLabelClientIds };

			if (nextClientIds.length) {
				nextBlockClientIdsByUniqueID[uniqueID] = nextClientIds;
			} else {
				delete nextBlockClientIdsByUniqueID[uniqueID];
			}

			if (resolvedCustomLabel) {
				const existingLabelClientIds =
					state.customLabelClientIds[resolvedCustomLabel] ?? [];
				const nextLabelClientIds = existingLabelClientIds.filter(
					existingClientId => existingClientId !== clientId
				);
				if (nextLabelClientIds.length) {
					nextCustomLabelClientIds[resolvedCustomLabel] =
						nextLabelClientIds;
				} else {
					delete nextCustomLabelClientIds[resolvedCustomLabel];
				}
			}

			const remainingClientId = nextClientIds[0];
			const nextBlocks = { ...state.blocks };

			if (remainingClientId) {
				nextBlocks[uniqueID] = {
					...nextBlocks[uniqueID],
					clientId: remainingClientId,
				};
			} else {
				delete nextBlocks[uniqueID];
			}

			return {
				...state,
				blocks: nextBlocks,
				blockClientIdsByUniqueID: nextBlockClientIdsByUniqueID,
				customLabelClientIds: nextCustomLabelClientIds,
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
		case 'ADD_MULTIPLE_BLOCKS': {
			const { blocks } = action;

			// Batch add multiple blocks in a single state update (performance optimization)
			const newBlocks = { ...state.blocks };
			const newBlockClientIdsByUniqueID = {
				...state.blockClientIdsByUniqueID,
			};
			const newCustomLabelClientIds = {
				...state.customLabelClientIds,
			};
			const newUniqueIDCache = { ...state.uniqueIDCache };

			blocks.forEach(
				({ uniqueID, clientId, blockRoot, customLabel }) => {
					newBlocks[uniqueID] = {
						clientId,
						blockRoot,
						customLabel,
					};

					const existingClientIds =
						newBlockClientIdsByUniqueID[uniqueID] ?? [];
					if (!existingClientIds.includes(clientId)) {
						newBlockClientIdsByUniqueID[uniqueID] = [
							...existingClientIds,
							clientId,
						];
					}

					if (customLabel) {
						const existingLabelClientIds =
							newCustomLabelClientIds[customLabel] ?? [];
						if (!existingLabelClientIds.includes(clientId)) {
							newCustomLabelClientIds[customLabel] = [
								...existingLabelClientIds,
								clientId,
							];
						}
					}
					newUniqueIDCache[uniqueID] = true;
				}
			);

			return {
				...state,
				blocks: newBlocks,
				blockClientIdsByUniqueID: newBlockClientIdsByUniqueID,
				customLabelClientIds: newCustomLabelClientIds,
				uniqueIDCache: newUniqueIDCache,
			};
		}
		default:
			return state;
	}
};

export default reducer;
