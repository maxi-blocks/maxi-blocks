/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const removeBlockFromColumns = (
	blockPosition,
	parentColumnClientId,
	clientId,
	innerBlocksPositions,
	updateInnerBlocksPositions
) => {
	const { getBlock } = select('core/block-editor');

	const parentColumn = getBlock(parentColumnClientId);

	if (!parentColumn?.innerBlocks) {
		return;
	}

	const clientIdsToRemove = [];

	const newInnerBlocksPositions = updateInnerBlocksPositions?.();

	if (
		!newInnerBlocksPositions?.[blockPosition].includes(clientId) &&
		innerBlocksPositions?.[blockPosition]?.includes(clientId)
	) {
		newInnerBlocksPositions?.[blockPosition]?.forEach(currentClientId => {
			if (
				innerBlocksPositions[blockPosition]?.includes(currentClientId)
			) {
				clientIdsToRemove.push(currentClientId);
			}
		});
	}

	if (!isEmpty(clientIdsToRemove)) {
		const {
			replaceInnerBlocks,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');
		const { getBlockRootClientId } = select('core/block-editor');

		// Use replaceInnerBlocks instead of removeBlocks,
		// because markNextChangeAsNotPersistent is not working with removeBlocks
		clientIdsToRemove.forEach(clientId => {
			const rootClientId = getBlockRootClientId(clientId);
			const rootBlock = getBlock(rootClientId);

			markNextChangeAsNotPersistent();
			replaceInnerBlocks(
				rootClientId,
				rootBlock.innerBlocks.filter(
					innerBlock => innerBlock.clientId !== clientId
				)
			);

			updateInnerBlocksPositions?.();
		});
	}
};

export default removeBlockFromColumns;
