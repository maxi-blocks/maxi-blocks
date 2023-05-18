/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { cleanInnerBlocks, excludeAttributes } from '../copy-paste';
import { getChildColumns, goThroughColumns, findBlockPosition } from './utils';
import { goThroughMaxiBlocks } from '../maxi-block';
import { getBlockData, getUpdatedSVGDataAndElement } from '../attributes';
import updateRelationsInColumn from './updateRelationsInColumn';
import DISALLOWED_BLOCKS from './disallowedBlocks';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const validateAttributes = (block, column, innerBlocksPositions) => {
	const copyPasteMapping = getBlockData(block.name)?.copyPasteMapping;

	const blockPosition = findBlockPosition(block.clientId, column);
	const refClientId = innerBlocksPositions?.[blockPosition]?.at(0);

	if (!refClientId) {
		return false;
	}

	const { getBlockAttributes } = select('core/block-editor');

	const nonExcludedRefAttributes = excludeAttributes(
		getBlockAttributes(refClientId),
		block.attributes,
		copyPasteMapping,
		false,
		true
	);
	updateRelationsInColumn(
		nonExcludedRefAttributes,
		refClientId,
		block.clientId,
		innerBlocksPositions
	);
	if (
		'SVGData' in nonExcludedRefAttributes &&
		'SVGElement' in nonExcludedRefAttributes
	) {
		const { SVGData, SVGElement } = getUpdatedSVGDataAndElement(
			nonExcludedRefAttributes,
			block.attributes.uniqueID,
			'',
			block.attributes.mediaURL
		);

		nonExcludedRefAttributes.SVGData = SVGData;
		nonExcludedRefAttributes.SVGElement = SVGElement;
	}

	const nonExcludedBlockAttributes = excludeAttributes(
		block.attributes,
		block.attributes,
		copyPasteMapping,
		false,
		true
	);

	if (!isEqual(nonExcludedRefAttributes, nonExcludedBlockAttributes)) {
		const {
			updateBlockAttributes,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		updateBlockAttributes(block.clientId, nonExcludedRefAttributes);
	}

	return null;
};

const validateRowColumnsStructure = (
	rowClientId,
	innerBlocksPositions,
	rawColumnToValidateByClientId
) => {
	const {
		replaceInnerBlocks,
		removeBlock,
		__unstableMarkNextChangeAsNotPersistent: markNextChangeAsNotPersistent,
	} = dispatch('core/block-editor');

	let childColumns = getChildColumns(rowClientId, true);

	const columnToValidateBy = rawColumnToValidateByClientId
		? childColumns.find(
				column => column.clientId === rawColumnToValidateByClientId
		  )
		: childColumns[0];
	const columnToValidateByClientId = columnToValidateBy.clientId;

	// Make sure that column to validate by is first in childColumns array
	if (columnToValidateBy.clientId !== childColumns[0].clientId) {
		childColumns = childColumns.filter(
			column => column.clientId !== columnToValidateBy.clientId
		);
		childColumns.unshift(columnToValidateBy);
	}

	const columnToValidateByStructure = [];

	const handleReplaceColumn = columnClientId => {
		const { getBlock } = select('core/block-editor');

		const column = getBlock(columnClientId);

		validateAttributes(column, column, innerBlocksPositions);

		markNextChangeAsNotPersistent();
		replaceInnerBlocks(
			columnClientId,
			cleanInnerBlocks(getBlock(columnToValidateByClientId).innerBlocks),
			false
		);
	};

	const pushToStructure = (block, structureArray) => {
		if (DISALLOWED_BLOCKS.includes(block.name)) {
			markNextChangeAsNotPersistent();
			removeBlock(block.clientId, false);
		} else {
			structureArray.push(block.name);
		}
	};

	goThroughColumns(childColumns, null, column => {
		// we can't just compare inner blocks, because if they different attributes - it's ok
		// so we need to compare only block names
		const columnInnerBlocks = column.innerBlocks;

		const isColumnToValidateBy =
			column.clientId === columnToValidateBy.clientId;

		if (!isColumnToValidateBy && columnInnerBlocks.length === 0) {
			return handleReplaceColumn(column.clientId);
		}

		const columnStructure = [];

		goThroughMaxiBlocks(block => {
			if (isColumnToValidateBy) {
				pushToStructure(block, columnToValidateByStructure);

				return false;
			}

			pushToStructure(block, columnStructure);

			return null;
		}, columnInnerBlocks);

		if (isColumnToValidateBy) {
			return null;
		}

		if (!isEqual(columnToValidateByStructure, columnStructure)) {
			return handleReplaceColumn(column.clientId);
		}

		validateAttributes(column, column, innerBlocksPositions);

		goThroughMaxiBlocks(
			block => validateAttributes(block, column, innerBlocksPositions),
			columnInnerBlocks
		);

		return null;
	});
};

export default validateRowColumnsStructure;
