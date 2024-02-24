// source: https://github.com/WordPress/gutenberg/blob/fc0917f8de3647bd2e01cdccab673efe45a37edd/packages/block-library/src/list-item/hooks/use-outdent-list-item.js

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { useSelect, useDispatch, useRegistry } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

export default function useOutdentListItem() {
	const registry = useRegistry();
	const {
		moveBlocksToPosition,
		removeBlock,
		insertBlock,
		updateBlockListSettings,
	} = useDispatch('core/block-editor');
	const {
		getBlockRootClientId,
		getBlockName,
		getBlockOrder,
		getBlockIndex,
		getSelectedBlockClientIds,
		getBlock,
		getBlockListSettings,
	} = useSelect('core/block-editor');

	function getParentListItemId(id) {
		const listId = getBlockRootClientId(id);
		const parentListItemId = getBlockRootClientId(listId);
		if (!parentListItemId) return null;
		if (getBlockName(parentListItemId) !== 'core/list-item') return null;
		return parentListItemId;
	}

	return useCallback((rawClientIds = getSelectedBlockClientIds()) => {
		const clientIds = Array.isArray(rawClientIds)
			? rawClientIds
			: [rawClientIds];

		if (!clientIds.length) return;

		const firstClientId = clientIds[0];

		// Can't outdent if it's not a list item.
		if (getBlockName(firstClientId) !== 'core/list-item') return;

		const parentListItemId = getParentListItemId(firstClientId);

		// Can't outdent if it's at the top level.
		if (!parentListItemId) return;

		const parentListId = getBlockRootClientId(firstClientId);
		const lastClientId = clientIds[clientIds.length - 1];
		const order = getBlockOrder(parentListId);
		const followingListItems = order.slice(getBlockIndex(lastClientId) + 1);

		registry.batch(() => {
			if (followingListItems.length) {
				let nestedListId = getBlockOrder(firstClientId)[0];

				if (!nestedListId) {
					const nestedListBlock = cloneBlock(
						getBlock(parentListId),
						{},
						[]
					);
					nestedListId = nestedListBlock.clientId;
					insertBlock(nestedListBlock, 0, firstClientId, false);
					// Immediately update the block list settings, otherwise
					// blocks can't be moved here due to canInsert checks.
					updateBlockListSettings(
						nestedListId,
						getBlockListSettings(parentListId)
					);
				}

				moveBlocksToPosition(
					followingListItems,
					parentListId,
					nestedListId
				);
			}
			moveBlocksToPosition(
				clientIds,
				parentListId,
				getBlockRootClientId(parentListItemId),
				getBlockIndex(parentListItemId) + 1
			);
			if (!getBlockOrder(parentListId).length) {
				const shouldSelectParent = false;
				removeBlock(parentListId, shouldSelectParent);
			}
		});
	}, []);
}
