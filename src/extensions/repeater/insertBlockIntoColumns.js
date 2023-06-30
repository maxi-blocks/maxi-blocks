import { dispatch, select } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';
import { uniqueIDGenerator } from '../attributes';
import {
	findBlockPosition,
	findTargetParent,
	getChildColumns,
	goThroughColumns,
} from './utils';

const insertBlockIntoColumns = clientId => {
	const { getBlock, getBlockParentsByBlockName } =
		select('core/block-editor');

	const block = getBlock(clientId);

	if (!block) {
		return;
	}

	const initialColumn = getBlock(
		getBlockParentsByBlockName(block.clientId, 'maxi-blocks/column-maxi')[0]
	);

	if (!initialColumn?.innerBlocks) {
		return;
	}

	const childColumns = getChildColumns(block.clientId);

	const blockPosition = findBlockPosition(block.clientId, initialColumn);
	const blockIndex = blockPosition[blockPosition.length - 1];

	goThroughColumns(childColumns, initialColumn.clientId, column => {
		const targetParent = findTargetParent(blockPosition, column);

		if (!targetParent) {
			return;
		}

		const newUniqueID = uniqueIDGenerator({
			blockName: block.name,
		});

		const clonedBlock = cloneBlock(block, {
			uniqueID: newUniqueID,
		});

		const {
			insertBlock,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		insertBlock(clonedBlock, blockIndex, targetParent.clientId, false);
	});
};

export default insertBlockIntoColumns;