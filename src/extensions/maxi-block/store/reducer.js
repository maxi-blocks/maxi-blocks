const isSafeMapKey = key =>
	key !== '__proto__' && key !== 'prototype' && key !== 'constructor';

const reducer = (
	state = {
		blocks: {},
		blockClientIdsByUniqueID: {},
		blocksByClientId: {},
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
			const nextBlocksByClientId = {
				...state.blocksByClientId,
				[clientId]: {
					clientId,
					uniqueID,
					blockRoot,
					customLabel,
				},
			};

			if (customLabel != null) {
				const labelKey = String(customLabel);
				const existingLabelClientIds =
					state.customLabelClientIds[labelKey] ?? [];

				if (isSafeMapKey(labelKey)) {
					nextCustomLabelClientIds[labelKey] =
					existingLabelClientIds.includes(clientId)
						? existingLabelClientIds
						: [...existingLabelClientIds, clientId];
				}
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
				blocksByClientId: nextBlocksByClientId,
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
			const blockDataByClientId = state.blocksByClientId[clientId];
			const resolvedCustomLabel =
				customLabel ??
				blockDataByClientId?.customLabel ??
				blockData?.customLabel;
			const existingClientIds =
				state.blockClientIdsByUniqueID[uniqueID] ?? [];
			const nextClientIds = existingClientIds.filter(
				existingClientId => existingClientId !== clientId
			);
			const nextBlockClientIdsByUniqueID = {
				...state.blockClientIdsByUniqueID,
			};
			const nextCustomLabelClientIds = { ...state.customLabelClientIds };
			const nextBlocksByClientId = { ...state.blocksByClientId };

			delete nextBlocksByClientId[clientId];

			if (nextClientIds.length) {
				nextBlockClientIdsByUniqueID[uniqueID] = nextClientIds;
			} else {
				delete nextBlockClientIdsByUniqueID[uniqueID];
			}

			if (resolvedCustomLabel != null) {
				const labelKey = String(resolvedCustomLabel);

				if (isSafeMapKey(labelKey)) {
					const existingLabelClientIds =
						state.customLabelClientIds[labelKey] ?? [];
					const nextLabelClientIds = existingLabelClientIds.filter(
						existingClientId => existingClientId !== clientId
					);
					if (nextLabelClientIds.length) {
						nextCustomLabelClientIds[labelKey] = nextLabelClientIds;
					} else {
						delete nextCustomLabelClientIds[labelKey];
					}
				}
			}

			const remainingClientId = nextClientIds[0];
			const nextBlocks = { ...state.blocks };

			if (remainingClientId) {
				const remainingBlockData =
					nextBlocksByClientId[remainingClientId];
				nextBlocks[uniqueID] = {
					...nextBlocks[uniqueID],
					clientId: remainingClientId,
					blockRoot: remainingBlockData?.blockRoot,
					customLabel: remainingBlockData?.customLabel,
				};
			} else {
				delete nextBlocks[uniqueID];
			}

			return {
				...state,
				blocks: nextBlocks,
				blockClientIdsByUniqueID: nextBlockClientIdsByUniqueID,
				blocksByClientId: nextBlocksByClientId,
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
			const newBlocksByClientId = {
				...state.blocksByClientId,
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
					newBlocksByClientId[clientId] = {
						clientId,
						uniqueID,
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

					if (customLabel != null) {
						const labelKey = String(customLabel);

						if (isSafeMapKey(labelKey)) {
							const existingLabelClientIds =
								newCustomLabelClientIds[labelKey] ?? [];
							if (!existingLabelClientIds.includes(clientId)) {
								newCustomLabelClientIds[labelKey] = [
									...existingLabelClientIds,
									clientId,
								];
							}
						}
					}
					newUniqueIDCache[uniqueID] = true;
				}
			);

			return {
				...state,
				blocks: newBlocks,
				blockClientIdsByUniqueID: newBlockClientIdsByUniqueID,
				blocksByClientId: newBlocksByClientId,
				customLabelClientIds: newCustomLabelClientIds,
				uniqueIDCache: newUniqueIDCache,
			};
		}
		default:
			return state;
	}
};

export default reducer;
