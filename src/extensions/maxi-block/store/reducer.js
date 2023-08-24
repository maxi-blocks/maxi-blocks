/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const reducer = (
	state = {
		blocks: {},
		lastInsertedBlocks: [],
		lastParentBlocks: [],
		clientIdsWithBlockCount: {},
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
			delete state.clientIdsWithBlockCount[clientId];

			return {
				...state,
				lastInsertedBlocks: state.lastInsertedBlocks.filter(
					item => item !== clientId
				),
				lastParentBlocks: state.lastParentBlocks.filter(
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
		case 'SAVE_BLOCK_CLIENT_IDS': {
			const { allClientIds } = action;
			const { clientIdsWithBlockCount } = state;
			const blockClientIdsSet = new Set(
				Object.keys(clientIdsWithBlockCount)
			);

			const lastInsertedBlocks = [];
			const lastParentBlocks = [];
			const newClientIdsWithBlockCount = {};

			const { getBlockCount } = select('core/block-editor');

			allClientIds.forEach(clientId => {
				const blockCount = getBlockCount(clientId);

				if (!blockClientIdsSet.has(clientId)) {
					lastInsertedBlocks.push(clientId);
				}

				if (
					blockCount !== clientIdsWithBlockCount[clientId] &&
					(clientId in clientIdsWithBlockCount || blockCount > 0)
				) {
					lastParentBlocks.push(clientId);
				}

				// Build new client IDs with block count
				newClientIdsWithBlockCount[clientId] = blockCount;
			});

			return {
				...state,
				lastInsertedBlocks,
				lastParentBlocks,
				clientIdsWithBlockCount: newClientIdsWithBlockCount,
			};
		}
		default:
			return state;
	}
};

export default reducer;
