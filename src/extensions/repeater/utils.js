/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

export const findBlockIndex = (clientId, block) =>
	block?.innerBlocks.findIndex(
		innerBlock => innerBlock.clientId === clientId
	);

export const findBlockPosition = (blockClientId, rootColumn) => {
	const blockPosition = [];

	if (!blockClientId || !rootColumn) return blockPosition;

	if (blockClientId === rootColumn.clientId) return [-1];

	const { getBlockParents } = select('core/block-editor');

	const rawBlockParents = getBlockParents(blockClientId).filter(
		parentId => parentId !== blockClientId
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

	blockPosition.push(findBlockIndex(blockClientId, currentParent));

	return blockPosition;
};

export const findTargetParent = (blockPosition, column) => {
	if (!blockPosition || !column) return null;

	let currentBlock = column;

	for (let i = 0; i < blockPosition.length - 1; i += 1) {
		currentBlock = currentBlock?.innerBlocks[blockPosition[i]];
	}

	return currentBlock;
};

export const findTarget = (blockPosition, column) => {
	if (!blockPosition || !column) return null;

	const targetParent = findTargetParent(blockPosition, column);

	return targetParent?.innerBlocks[blockPosition.at(-1)];
};

export const getBlockPosition = (blockClientId, innerBlocksPositions) => {
	if (innerBlocksPositions) {
		for (const [position, clientIds] of Object.entries(
			innerBlocksPositions
		)) {
			if (clientIds.includes(blockClientId)) {
				return position.split(',').map(Number);
			}
		}
	}

	return null;
};

/**
 *
 * @param {string}  clientId      The client id of repeater column or row if isRowClientId is true
 * @param {boolean} isRowClientId
 * @returns {Object<string, any>[]} Array of child columns
 */
export const getChildColumns = (clientId, isRowClientId = false) => {
	const { getBlock, getBlocks, getBlockParentsByBlockName } =
		select('core/block-editor');

	const parentRow = isRowClientId
		? getBlock(clientId)
		: getBlock(
				getBlockParentsByBlockName(clientId, 'maxi-blocks/row-maxi').at(
					-1
				)
		  );

	// Check if the selected block is a child of your custom row block
	if (parentRow) {
		// Get all child columns of your custom row block
		const childColumns = getBlocks(parentRow.clientId);

		return childColumns;
	}

	return null;
};

export const goThroughColumns = (columns, blockClientId, callback) =>
	columns?.forEach(column => {
		// Skip the column where the block was originally added
		if (column.clientId !== blockClientId) {
			callback(column);
		}
	});

export const getInitialColumn = (clientId, repeaterColumnsClientIds) => {
	const { getBlock, getBlockName, getBlockParentsByBlockName } =
		select('core/block-editor');

	return getBlock(
		(getBlockName(clientId) === 'maxi-blocks/column-maxi'
			? [clientId]
			: getBlockParentsByBlockName(clientId, 'maxi-blocks/column-maxi')
		).find(clientId => repeaterColumnsClientIds.includes(clientId))
	);
};
