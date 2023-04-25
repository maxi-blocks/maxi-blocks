import { dispatch, select } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';
import { isEqual } from 'lodash';
import { uniqueIDGenerator } from '../attributes';
import { goThroughMaxiBlocks } from '../maxi-block';
import { cleanInnerBlocks } from '../copy-paste';

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

const getChildColumns = (blockClientId, parentColumn) => {
	const { getBlock, getBlocks, getBlockParentsByBlockName } =
		select('core/block-editor');

	const getParentRow = () => {
		const block = getBlock(blockClientId);

		if (block?.name === 'maxi-blocks/row-maxi') {
			return block;
		}

		return getBlock(
			getBlockParentsByBlockName(
				parentColumn ?? blockClientId,
				'maxi-blocks/row-maxi'
			)[0]
		);
	};

	const parentRow = getParentRow();

	// Check if the selected block is a child of your custom row block
	if (parentRow) {
		// Get all child columns of your custom row block
		const childColumns = getBlocks(parentRow.clientId);

		return childColumns;
	}

	return null;
};

const goThroughColumns = (columns, blockClientId, callback) =>
	columns?.forEach(column => {
		// Skip the column where the block was originally added
		if (column.clientId !== blockClientId) {
			callback(column);
		}
	});

// TODO: support nested deletion, avoid doing it when repeater is disabled
const detectNewBlocks = (
	rawBlock,
	isAdding = true,
	blockPositionTest,
	parentColumnTest
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

					if (
						blockToRemoveClientId &&
						targetParent.innerBlocks[blockIndex]
					) {
						// Remove the block from the column at the same index
						dispatch('core/block-editor').removeBlock(
							targetParent.innerBlocks[blockIndex]?.clientId,
							false
						);
					}
				}
			}
		});
	}
};

export const handleBlockMove = (
	rawBlock,
	prevPosition,
	nextPosition,
	innerBlockPositions
) => {
	if (isEqual(prevPosition, nextPosition)) return;

	const { getBlock, getBlockParentsByBlockName } =
		select('core/block-editor');

	const block = getBlock(rawBlock.clientId);

	if (!block) return;

	// Get the index of the selected block within the initial column
	const initialColumn = getBlock(
		getBlockParentsByBlockName(block.clientId, 'maxi-blocks/column-maxi')[0]
	);

	if (!initialColumn?.innerBlocks) {
		return;
	}

	const prevBlockIndex = prevPosition[prevPosition.length - 1];

	const childColumns = getChildColumns(block.clientId);

	goThroughColumns(childColumns, initialColumn.clientId, column => {
		const nextTargetParent = findTargetParent(nextPosition, column);

		if (!nextTargetParent) return;

		const prevTargetParent = findTargetParent(prevPosition, column);

		const blockToMove = getBlock(
			prevTargetParent.innerBlocks[prevBlockIndex]?.clientId
		);

		if (
			!innerBlockPositions
				.get(`${prevPosition}`)
				?.uniqueIDs.includes(blockToMove.attributes.uniqueID)
		)
			return;

		const { moveBlockToPosition } = dispatch('core/block-editor');

		const nextBlockIndex = nextPosition[nextPosition.length - 1];

		moveBlockToPosition(
			blockToMove.clientId,
			prevTargetParent.clientId,
			nextTargetParent.clientId,
			nextBlockIndex
		);
	});
};

export const validateRowColumnsStructure = rowClientId => {
	const childColumns = getChildColumns(rowClientId);

	const firstColumn = childColumns[0];
	const firstColumnInnerBlocks = firstColumn.innerBlocks;
	const firstColumnStructure = [];

	const handleReplaceColumn = columnClientId => {
		const { replaceInnerBlocks } = dispatch('core/block-editor');

		replaceInnerBlocks(
			columnClientId,
			cleanInnerBlocks(
				firstColumnInnerBlocks
				// 	block => {
				// 	// TODO: think about a better way, to avoid using uniqueIDGenerator outside of maxiBlockComponent
				// 	block.attributes.uniqueID = uniqueIDGenerator({
				// 		blockName: block.name,
				// 	});
				// }
			),
			false
		);
	};

	goThroughColumns(childColumns, null, column => {
		// we can't just compare inner blocks, because if they different attributes - it's ok
		// so we need to compare only block names
		const columnInnerBlocks = column.innerBlocks;

		const isFirstColumn = column.clientId === firstColumn.clientId;

		if (!isFirstColumn && columnInnerBlocks.length === 0) {
			return handleReplaceColumn(column.clientId);
		}

		let index = 0;

		goThroughMaxiBlocks(block => {
			if (isFirstColumn) {
				return firstColumnStructure.push(block.name);
			}

			if (firstColumnStructure[index] !== block.name) {
				// Update column with inner blocks from the first column
				index = firstColumnStructure.length - 1;
				return handleReplaceColumn(column.clientId);
			}

			index += 1;

			return null;
		}, columnInnerBlocks);

		if (!isFirstColumn && index !== firstColumnStructure.length - 1) {
			return handleReplaceColumn(column.clientId);
		}

		return null;
	});
};

export default detectNewBlocks;
