/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { findTargetParent, getChildColumns, goThroughColumns } from './utils';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const handleBlockMove = (
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
			!blockToMove ||
			!innerBlockPositions[`${prevPosition}`]?.includes(
				blockToMove.clientId
			)
		)
			return;

		const nextBlockIndex = nextPosition[nextPosition.length - 1];

		const {
			moveBlockToPosition,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		console.log('Moving block', blockToMove.name, blockToMove.clientId);
		moveBlockToPosition(
			blockToMove.clientId,
			prevTargetParent.clientId,
			nextTargetParent.clientId,
			nextBlockIndex
		);
	});
};

export default handleBlockMove;
