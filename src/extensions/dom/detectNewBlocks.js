import { dispatch, select } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';
import { isEqual } from 'lodash';

const findBlockIndex = (clientId, block) =>
	block?.innerBlocks.findIndex(
		innerBlock => innerBlock.clientId === clientId
	);

export const findBlockPosition = (block, rootColumn) => {
	const blockPosition = [];

	if (!block || !rootColumn) return blockPosition;

	const { getBlockParents } = select('core/block-editor');

	const rawBlockParents = getBlockParents(block.clientId).filter(
		parentId => parentId !== block.clientId
	);
	const blockParents = rawBlockParents.slice(
		rawBlockParents.indexOf(rootColumn.clientId) + 1,
		rawBlockParents.length
	);

	let currentParent = rootColumn;

	blockParents.forEach(parentId => {
		if (!currentParent?.innerBlocks) return;

		const index = findBlockIndex(parentId, currentParent);
		blockPosition.push(index);

		const parentBlock = currentParent.innerBlocks.find(
			innerBlock => innerBlock.clientId === parentId
		);
		currentParent = parentBlock;
	});

	blockPosition.push(findBlockIndex(block.clientId, currentParent));

	return blockPosition;
};

const findTargetParent = (blockPosition, column) => {
	let currentBlock = column;

	for (let i = 0; i < blockPosition.length - 1; i += 1) {
		currentBlock = currentBlock.innerBlocks[blockPosition[i]];
	}

	return currentBlock;
};

// TODO: support nested deletion, avoid doing it when repeater is disabled
const detectNewBlocks = (
	rawBlock,
	isAdding = true,
	blockPositionTest,
	parentColumnTest
) => {
	console.log('detectNewBlocks call');
	const { getBlock, getBlocks, getBlockParentsByBlockName } =
		select('core/block-editor');

	const block = getBlock(rawBlock.clientId);

	// Check if a new block has been added
	if (block || !isAdding) {
		const parentRow = getBlock(
			getBlockParentsByBlockName(
				parentColumnTest ?? block.clientId,
				'maxi-blocks/row-maxi'
			)[0]
		);

		// Check if the selected block is a child of your custom row block
		if (parentRow) {
			// Get all child columns of your custom row block
			const childColumns = getBlocks(parentRow.clientId);

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

			// Iterate through all child columns and insert the same block
			childColumns.forEach(column => {
				// Skip the column where the block was originally added
				if (column.clientId !== initialColumn.clientId) {
					const targetParent = findTargetParent(
						blockPosition,
						column
					);

					if (targetParent) {
						if (isAdding) {
							// Clone the block with a new clientId
							const clonedBlock = cloneBlock(block);

							// Insert the cloned block into the column at the same index
							dispatch('core/block-editor').insertBlock(
								clonedBlock,
								blockIndex,
								targetParent.clientId,
								false
							);
						} else {
							const blockToRemoveClientId =
								targetParent.innerBlocks[blockIndex]?.clientId;

							if (blockToRemoveClientId) {
								// Remove the block from the column at the same index
								dispatch('core/block-editor').removeBlock(
									targetParent.innerBlocks[blockIndex]
										?.clientId,
									false
								);
							}
						}
					}
				}
			});
		}
	}
};

export const handleBlockMove = (rawBlock, prevPosition, nextPosition) => {
	console.log('handleBlockMove call');
	const { getBlock, getBlocks, getBlockParentsByBlockName } =
		select('core/block-editor');

	const block = getBlock(rawBlock.clientId);

	// Check if a new block has been added
	if (block) {
		const parentRow = getBlock(
			getBlockParentsByBlockName(
				block.clientId,
				'maxi-blocks/row-maxi'
			)[0]
		);

		// Check if the selected block is a child of your custom row block
		if (parentRow) {
			// Get all child columns of your custom row block
			const childColumns = getBlocks(parentRow.clientId);

			// Get the index of the selected block within the initial column
			const initialColumn = getBlock(
				getBlockParentsByBlockName(
					block.clientId,
					'maxi-blocks/column-maxi'
				)[0]
			);

			if (!initialColumn?.innerBlocks) {
				return;
			}

			// const blockPosition = findBlockPosition(block, initialColumn);
			// const blockIndex = blockPosition[blockPosition.length - 1];
			const prevBlockIndex = prevPosition[prevPosition.length - 1];

			// Iterate through all child columns and insert the same block
			childColumns.forEach(column => {
				// Skip the column where the block was originally added
				if (column.clientId !== initialColumn.clientId) {
					const nextTargetParent = findTargetParent(
						nextPosition,
						column
					);

					if (nextTargetParent) {
						if (!isEqual(prevPosition, nextPosition)) {
							// let's find the block to move
							const blockToMove = getBlock(
								nextTargetParent.innerBlocks[prevBlockIndex]
									?.clientId
							);

							// let's compare if his current position is the same as the next position
							const currentPosition = findBlockPosition(
								blockToMove,
								column
							);

							console.log(
								'current and next',
								currentPosition,
								nextPosition
							);

							if (!isEqual(currentPosition, nextPosition)) {
								const { moveBlockToPosition } =
									dispatch('core/block-editor');

								const prevTargetParent = findTargetParent(
									prevPosition,
									column
								);

								const nextBlockIndex =
									nextPosition[nextPosition.length - 1];

								moveBlockToPosition(
									blockToMove.clientId,
									prevTargetParent.clientId,
									nextTargetParent.clientId,
									nextBlockIndex
								);
							}
						}
					}
				}
			});
		}
	}
};

export default detectNewBlocks;
