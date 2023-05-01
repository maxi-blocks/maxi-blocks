/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { findBlockPosition } from './utils';

const getInnerBlocksPositions = columnsClientIds => {
	const innerBlocksPositions = new Map();

	const goThroughInnerBlocks = (innerBlocks, column) => {
		innerBlocks?.forEach(block => {
			const { clientId, innerBlocks } = block;

			const blockPosition = findBlockPosition(block, column);
			const key = `${blockPosition}`;

			innerBlocksPositions.set(key, [
				...(innerBlocksPositions.get(key) || []),
				clientId,
			]);

			if (innerBlocks?.length) {
				goThroughInnerBlocks(innerBlocks, column);
			}
		});
	};

	columnsClientIds.forEach((columnClientId, index) => {
		const column = select('core/block-editor').getBlock(columnClientId);

		goThroughInnerBlocks(column?.innerBlocks, column, index === 0);
	});

	return innerBlocksPositions;
};

export default getInnerBlocksPositions;
