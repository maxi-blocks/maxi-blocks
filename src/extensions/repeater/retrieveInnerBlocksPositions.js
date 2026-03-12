/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const attachFastLookups = (
	innerBlocksPositions,
	clientIdToPosition,
	clientIdToColumnId
) => {
	Object.defineProperties(innerBlocksPositions, {
		__clientIdToPosition: {
			value: clientIdToPosition,
			enumerable: false,
			configurable: false,
			writable: false,
		},
		__clientIdToColumnId: {
			value: clientIdToColumnId,
			enumerable: false,
			configurable: false,
			writable: false,
		},
	});

	return innerBlocksPositions;
};

const retrieveInnerBlocksPositions = columnsClientIds => {
	const innerBlocksPositions = {};
	const clientIdToPosition = new Map();
	const clientIdToColumnId = new Map();

	if (isEmpty(columnsClientIds)) {
		return attachFastLookups(
			innerBlocksPositions,
			clientIdToPosition,
			clientIdToColumnId
		);
	}

	const goThroughInnerBlocks = (
		innerBlocks,
		columnClientId,
		parentPosition = []
	) => {
		innerBlocks?.forEach((block, index) => {
			const { clientId, innerBlocks: nestedInnerBlocks } = block;
			const blockPosition = [...parentPosition, index];
			const key = `${blockPosition}`;

			innerBlocksPositions[key] = [
				...(innerBlocksPositions[key] || []),
				clientId,
			];
			clientIdToPosition.set(clientId, blockPosition);
			clientIdToColumnId.set(clientId, columnClientId);

			if (nestedInnerBlocks?.length) {
				goThroughInnerBlocks(
					nestedInnerBlocks,
					columnClientId,
					blockPosition
				);
			}
		});
	};

	columnsClientIds.forEach(columnClientId => {
		const column = select('core/block-editor').getBlock(columnClientId);

		innerBlocksPositions[[-1]] = [
			...(innerBlocksPositions[[-1]] || []),
			columnClientId,
		];
		clientIdToPosition.set(columnClientId, [-1]);
		clientIdToColumnId.set(columnClientId, columnClientId);

		goThroughInnerBlocks(column?.innerBlocks, columnClientId);
	});

	return attachFastLookups(
		innerBlocksPositions,
		clientIdToPosition,
		clientIdToColumnId
	);
};

export default retrieveInnerBlocksPositions;
