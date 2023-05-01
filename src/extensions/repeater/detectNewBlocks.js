import { dispatch, select } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';
import { isEqual, isEmpty } from 'lodash';
import { uniqueIDGenerator } from '../attributes';
import { goThroughMaxiBlocks } from '../maxi-block';
import { cleanInnerBlocks } from '../copy-paste';
import {
	findBlockPosition,
	findTargetParent,
	getChildColumns,
	goThroughColumns,
} from './utils';

// TODO: support nested deletion, avoid doing it when repeater is disabled
const detectNewBlocks = (
	rawBlock,
	isAdding = true,
	blockPositionTest,
	parentColumnTest,
	parentInnerBlocksCount
) => {
	console.log('detectNewBlocks call');
	const { getBlock, getBlockParentsByBlockName } =
		select('core/block-editor');

	const block = getBlock(rawBlock.clientId);

	// Check if a new block has been added
	if (block || !isAdding) {
		const childColumns = getChildColumns(block?.clientId, parentColumnTest);

		// Get the index of the selected block within the initial column
		const initialColumn = getBlock(
			parentColumnTest ||
				getBlockParentsByBlockName(
					block.clientId,
					'maxi-blocks/column-maxi'
				)[0]
		);

		if (!initialColumn?.innerBlocks) {
			return;
		}

		const blockPosition =
			blockPositionTest ?? findBlockPosition(block, initialColumn);
		const blockIndex = blockPosition[blockPosition.length - 1];

		const clientIdsToRemove = [];
		let wasBlockRemoved = false;

		// Iterate through all child columns and insert the same block
		goThroughColumns(childColumns, initialColumn.clientId, column => {
			const targetParent = findTargetParent(blockPosition, column);

			if (targetParent) {
				if (isAdding) {
					const newUniqueID = uniqueIDGenerator({
						blockName: block.name,
					});
					console.log('detectNewBlocks newUniqueID', newUniqueID);
					// Clone the block with a new clientId
					const clonedBlock = cloneBlock(block, {
						uniqueID: newUniqueID,
					});

					const {
						insertBlock,
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					markNextChangeAsNotPersistent();

					setTimeout(() => {
						// Insert the cloned block into the column at the same index
						console.log(
							'Inserting block into ',
							targetParent.name,
							' at index ',
							blockIndex
						);
						insertBlock(
							clonedBlock,
							blockIndex,
							targetParent.clientId,
							false
						);
					}, 150);
				} else {
					const blockToRemoveClientId =
						targetParent.innerBlocks[blockIndex]?.clientId;

					if (
						blockToRemoveClientId &&
						targetParent.innerBlocks[blockIndex]
					) {
						if (
							targetParent.innerBlocks.length !==
							parentInnerBlocksCount
						) {
							wasBlockRemoved = true;
						}

						clientIdsToRemove.push(blockToRemoveClientId);
					}
				}
			}
		});

		if (!isAdding && !wasBlockRemoved && !isEmpty(clientIdsToRemove)) {
			const {
				removeBlocks,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = dispatch('core/block-editor');

			markNextChangeAsNotPersistent();
			console.log('Removing blocks', clientIdsToRemove);
			removeBlocks(clientIdsToRemove);
		}
	}
};

export default detectNewBlocks;
