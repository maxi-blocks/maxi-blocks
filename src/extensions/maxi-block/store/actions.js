import { select } from '@wordpress/data';

const actions = {
	addBlock(uniqueID, clientId, blockRoot) {
		return {
			type: 'ADD_BLOCK',
			uniqueID,
			clientId,
			blockRoot,
		};
	},
	removeBlock(uniqueID, clientId) {
		return {
			type: 'REMOVE_BLOCK',
			uniqueID,
			clientId,
		};
	},
	updateBlockStylesRoot(uniqueID, blockRoot) {
		return {
			type: 'UPDATE_BLOCK_STYLES_ROOT',
			uniqueID,
			blockRoot,
		};
	},
	addNewBlock(uniqueID) {
		return {
			type: 'ADD_NEW_BLOCK',
			uniqueID,
		};
	},
	/**
	 * `updateBlockAttributes` is an async action, so in some cases when it's used,
	 * it should be remembered to avoid in that cases using props.attributes[attributeName] = ...
	 * changes, because they will be overwritten by the async action.
	 */
	addBlockWithUpdatedAttributes(clientId) {
		return {
			type: 'ADD_BLOCK_WITH_UPDATED_ATTRIBUTES',
			clientId,
		};
	},
	saveLastInsertedBlocks(blockClientIds) {
		const { __experimentalGetDirtyEntityRecords: getDirtyEntityRecords } =
			select('core');
		const { getCurrentPostId } = select('core/editor');

		const isCurrentPostClean = !getDirtyEntityRecords().some(
			item => item.key === getCurrentPostId()
		);

		return {
			type: 'SAVE_LAST_INSERTED_BLOCKS',
			allClientIds: blockClientIds,
			isCurrentPostClean,
		};
	},
	saveBlockClientIds(blockClientIds) {
		return {
			type: 'SAVE_BLOCK_CLIENT_IDS',
			blockClientIds,
		};
	},
};

export default actions;
