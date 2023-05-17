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
import { getBlockData } from '../attributes';
import updateRelationsInColumn from './updateRelationsInColumn';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const validateAttributes = (block, column, innerBlocksPositions) => {
	const copyPasteMapping = getBlockData(block.name)?.copyPasteMapping;

	const blockPosition = findBlockPosition(block.clientId, column);
	const refClientId = innerBlocksPositions?.[`${blockPosition}`].at(0);

	if (!refClientId) {
		return false;
	}

	const { getBlockAttributes } = select('core/block-editor');

	const nonExcludedRefAttributes = excludeAttributes(
		getBlockAttributes(refClientId),
		['background-layers', 'background-layers-hover'].reduce((acc, key) => {
			acc[key] = block.attributes[key];
			return acc;
		}, {}),
		copyPasteMapping
	);
	updateRelationsInColumn(
		nonExcludedRefAttributes,
		refClientId,
		block.clientId,
		innerBlocksPositions
	);

	const nonExcludedBlockAttributes = excludeAttributes(
		block.attributes,
		null,
		copyPasteMapping
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
	columnToValidateByClientId
) => {
	let childColumns = getChildColumns(rowClientId, true);

	const columnToValidateBy = columnToValidateByClientId
		? childColumns.find(
				column => column.clientId === columnToValidateByClientId
		  )
		: childColumns[0];

	// Make sure that column to validate by is first in childColumns array
	if (columnToValidateBy.clientId !== childColumns[0].clientId) {
		childColumns = childColumns.filter(
			column => column.clientId !== columnToValidateBy.clientId
		);
		childColumns.unshift(columnToValidateBy);
	}

	const columnToValidateByInnerBlocks = columnToValidateBy.innerBlocks;
	const columnToValidateByStructure = [];

	const handleReplaceColumn = columnClientId => {
		const {
			replaceInnerBlocks,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');
		const { getBlock } = select('core/block-editor');

		const column = getBlock(columnClientId);

		validateAttributes(column, column, innerBlocksPositions);

		markNextChangeAsNotPersistent();
		replaceInnerBlocks(
			columnClientId,
			cleanInnerBlocks(columnToValidateByInnerBlocks),
			false
		);
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
				columnToValidateByStructure.push(block.name);
				return false;
			}

			columnStructure.push(block.name);

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
