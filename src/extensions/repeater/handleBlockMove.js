/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	findTargetParent,
	getChildColumns,
	getInitialColumn,
	goThroughColumns,
} from './utils';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const handleBlockMove = (
	clientId,
	prevPosition,
	nextPosition,
	innerBlockPositions
) => {
	if (
		isEqual(prevPosition, nextPosition) ||
		(prevPosition.length === nextPosition.length &&
			prevPosition.at(-1) === nextPosition.at(-1) + 1)
	)
		return;

	const { getBlock } = select('core/block-editor');

	const block = getBlock(clientId);

	if (!block) return;

	const initialColumn = getInitialColumn(
		block.clientId,
		innerBlockPositions?.[[-1]]
	);

	if (!initialColumn?.innerBlocks) {
		return;
	}

	const prevBlockIndex = prevPosition.at(-1);

	const childColumns = getChildColumns(initialColumn.clientId);

	const modifiedNextPosition = [...nextPosition];

	/**
	 * If the block has been moved to an inner block,
	 * which is inside the same parent, and the moved block
	 * is higher than the inner block, we need to increase
	 * the inner block index by 1 to get the correct next parent
	 */
	if (
		prevPosition.length < nextPosition.length &&
		prevPosition.every(
			(value, index) =>
				index === prevPosition.length - 1 ||
				value === nextPosition[index]
		) &&
		prevBlockIndex <= nextPosition[prevPosition.length - 1]
	) {
		modifiedNextPosition[prevPosition.length - 1] += 1;
	}

	goThroughColumns(childColumns, initialColumn.clientId, column => {
		const nextTargetParent = findTargetParent(modifiedNextPosition, column);

		if (!nextTargetParent) return;

		const prevTargetParent = findTargetParent(prevPosition, column);

		if (!prevTargetParent) return;

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

		const nextBlockIndex = modifiedNextPosition.at(-1);

		const {
			moveBlockToPosition,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		moveBlockToPosition(
			blockToMove.clientId,
			prevTargetParent.clientId,
			nextTargetParent.clientId,
			nextBlockIndex
		);
	});
};

export default handleBlockMove;
