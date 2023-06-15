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

const retrieveInnerBlocksPositions = columnsClientIds => {
	const innerBlocksPositions = {};

	if (isEmpty(columnsClientIds)) {
		return innerBlocksPositions;
	}

	const goThroughInnerBlocks = (innerBlocks, column) => {
		innerBlocks?.forEach(block => {
			const { clientId, innerBlocks } = block;

			const blockPosition = findBlockPosition(clientId, column);
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

	columnsClientIds.forEach(columnClientId => {
		const column = select('core/block-editor').getBlock(columnClientId);

		innerBlocksPositions[[-1]] = [
			...(innerBlocksPositions[[-1]] || []),
			columnClientId,
		];

		goThroughInnerBlocks(column?.innerBlocks, column);
	});

	return innerBlocksPositions;
};

export default retrieveInnerBlocksPositions;
