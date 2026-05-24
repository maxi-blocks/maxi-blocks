import { useCallback } from '@wordpress/element';
import { useDispatch, useRegistry, useSelect } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

import {
	canOutdentListItem,
	getParentListItemClientId,
	TEXT_BLOCK,
} from './listItemIndentation';

const useOutdentListItem = () => {
	const registry = useRegistry();
	const {
		moveBlocksToPosition,
		removeBlock,
		insertBlock,
		updateBlockListSettings,
	} = useDispatch('core/block-editor');

	const selectors = useSelect(select => {
		const blockEditor = select('core/block-editor');

		return {
			getBlock: blockEditor.getBlock,
			getBlockIndex: blockEditor.getBlockIndex,
			getBlockName: blockEditor.getBlockName,
			getBlockOrder: blockEditor.getBlockOrder,
			getBlockRootClientId: blockEditor.getBlockRootClientId,
			getSelectedBlockClientIds: blockEditor.getSelectedBlockClientIds,
			getBlockListSettings: blockEditor.getBlockListSettings,
		};
	}, []);

	return useCallback(
		(rawClientIds = selectors.getSelectedBlockClientIds()) => {
			const clientIds = Array.isArray(rawClientIds)
				? rawClientIds
				: [rawClientIds];

			if (!clientIds.length) return;

			const firstClientId = clientIds[0];

			if (!canOutdentListItem(selectors, firstClientId)) return;

			const parentListItemClientId = getParentListItemClientId(
				selectors,
				firstClientId
			);
			const parentListClientId =
				selectors.getBlockRootClientId(firstClientId);
			const lastClientId = clientIds[clientIds.length - 1];
			const order = selectors.getBlockOrder(parentListClientId);
			const followingListItems = order.slice(
				selectors.getBlockIndex(lastClientId) + 1
			);

			registry.batch(() => {
				if (followingListItems.length) {
					let nestedListClientId = selectors
						.getBlockOrder(firstClientId)
						.find(
							innerClientId =>
								selectors.getBlockName(innerClientId) ===
									TEXT_BLOCK &&
								selectors.getBlock(innerClientId)?.attributes
									?.isList
						);

					if (!nestedListClientId) {
						const nestedListBlock = cloneBlock(
							selectors.getBlock(parentListClientId),
							{},
							[]
						);
						nestedListClientId = nestedListBlock.clientId;
						insertBlock(nestedListBlock, 0, firstClientId, false);
						updateBlockListSettings?.(
							nestedListClientId,
							selectors.getBlockListSettings?.(
								parentListClientId
							)
						);
					}

					moveBlocksToPosition(
						followingListItems,
						parentListClientId,
						nestedListClientId
					);
				}

				moveBlocksToPosition(
					clientIds,
					parentListClientId,
					selectors.getBlockRootClientId(parentListItemClientId),
					selectors.getBlockIndex(parentListItemClientId) + 1
				);

				if (!selectors.getBlockOrder(parentListClientId).length)
					removeBlock(parentListClientId, false);
			});
		},
		[
			insertBlock,
			moveBlocksToPosition,
			registry,
			removeBlock,
			selectors,
			updateBlockListSettings,
		]
	);
};

export default useOutdentListItem;
