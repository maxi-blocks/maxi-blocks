import { useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { cloneBlock, createBlock } from '@wordpress/blocks';

import { appendBlocksToListItem } from './listItemIndentation';

const useIndentListItem = clientId => {
	const { replaceBlocks, selectionChange, multiSelect } =
		useDispatch('core/block-editor');

	const selectors = useSelect(select => {
		const blockEditor = select('core/block-editor');

		return {
			getBlock: blockEditor.getBlock,
			getBlockRootClientId: blockEditor.getBlockRootClientId,
			getPreviousBlockClientId: blockEditor.getPreviousBlockClientId,
			getSelectionStart: blockEditor.getSelectionStart,
			getSelectionEnd: blockEditor.getSelectionEnd,
			hasMultiSelection: blockEditor.hasMultiSelection,
			getMultiSelectedBlockClientIds:
				blockEditor.getMultiSelectedBlockClientIds,
		};
	}, []);

	return useCallback(() => {
		const hasMultiSelection = selectors.hasMultiSelection();
		const clientIds = hasMultiSelection
			? selectors.getMultiSelectedBlockClientIds()
			: [clientId];
		const previousSiblingClientId =
			selectors.getPreviousBlockClientId(clientId);

		if (!previousSiblingClientId) return;

		const clonedBlocks = clientIds.map(selectedClientId =>
			cloneBlock(selectors.getBlock(selectedClientId))
		);
		const parentListClientId = selectors.getBlockRootClientId(clientId);
		const parentListAttributes =
			selectors.getBlock(parentListClientId)?.attributes;
		const newListItem = appendBlocksToListItem({
			listItemBlock: cloneBlock(
				selectors.getBlock(previousSiblingClientId)
			),
			blocks: clonedBlocks,
			createBlock,
			parentListAttributes,
		});
		const selectionStart = selectors.getSelectionStart();
		const selectionEnd = selectors.getSelectionEnd();

		replaceBlocks([previousSiblingClientId, ...clientIds], [newListItem]);

		if (hasMultiSelection) {
			multiSelect(
				clonedBlocks[0].clientId,
				clonedBlocks[clonedBlocks.length - 1].clientId
			);
			return;
		}

		if (selectionStart && selectionEnd)
			selectionChange(
				clonedBlocks[0].clientId,
				selectionEnd.attributeKey,
				selectionEnd.clientId === selectionStart.clientId
					? selectionStart.offset
					: selectionEnd.offset,
				selectionEnd.offset
			);
	}, [
		clientId,
		multiSelect,
		replaceBlocks,
		selectionChange,
		selectors,
	]);
};

export default useIndentListItem;
