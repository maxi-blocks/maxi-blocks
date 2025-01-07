/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { uniqueIDGenerator } from '@extensions/attributes';
import {
	findBlockPosition,
	findTargetParent,
	getChildColumns,
	getInitialColumn,
	goThroughColumns,
} from './utils';

const insertBlockIntoColumns = (clientId, repeaterColumnsClientIds) => {
	const { getBlock } = select('core/block-editor');

	const block = getBlock(clientId);

	if (!block) {
		return;
	}

	const initialColumn = getInitialColumn(
		block.clientId,
		repeaterColumnsClientIds
	);

	if (!initialColumn?.innerBlocks) {
		return;
	}

	const childColumns = getChildColumns(initialColumn.clientId);

	const blockPosition = findBlockPosition(block.clientId, initialColumn);
	const blockIndex = blockPosition.at(-1);

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
