/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { findBlockPosition } from './utils';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getInnerBlocksPositions = columnsClientIds => {
	const innerBlocksPositions = {};

	if (isEmpty(columnsClientIds)) {
		return innerBlocksPositions;
	}

	const goThroughInnerBlocks = (innerBlocks, column) => {
		innerBlocks?.forEach(block => {
			const { clientId, innerBlocks } = block;

			const blockPosition = findBlockPosition(block, column);
			const key = `${blockPosition}`;

			innerBlocksPositions[key] = [
				...(innerBlocksPositions[key] || []),
				clientId,
			];

			if (innerBlocks?.length) {
				goThroughInnerBlocks(innerBlocks, column);
			}
		});
	};

	columnsClientIds.forEach((columnClientId, index) => {
		const column = select('core/block-editor').getBlock(columnClientId);

		goThroughInnerBlocks(column?.innerBlocks, column, index === 0);
	});
	console.log(innerBlocksPositions);
	return innerBlocksPositions;
};

export default getInnerBlocksPositions;
