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
	if (isEqual(prevPosition, nextPosition)) return;

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

	if (prevPosition.length < nextPosition.length) {
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
