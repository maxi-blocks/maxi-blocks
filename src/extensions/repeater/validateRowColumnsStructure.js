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

const validateRowColumnsStructure = (rowClientId, innerBlocksPositions) => {
	const childColumns = getChildColumns(rowClientId);

	const firstColumn = childColumns[0];
	const firstColumnInnerBlocks = firstColumn.innerBlocks;
	const firstColumnStructure = [];

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
			cleanInnerBlocks(firstColumnInnerBlocks),
			false
		);
	};

	goThroughColumns(childColumns, null, column => {
		// we can't just compare inner blocks, because if they different attributes - it's ok
		// so we need to compare only block names
		const columnInnerBlocks = column.innerBlocks;

		const isFirstColumn = column.clientId === firstColumn.clientId;

		if (!isFirstColumn && columnInnerBlocks.length === 0) {
			return handleReplaceColumn(column.clientId);
		}

		const columnStructure = [];

		goThroughMaxiBlocks(block => {
			if (isFirstColumn) {
				firstColumnStructure.push(block.name);
				return false;
			}

			columnStructure.push(block.name);

			return null;
		}, columnInnerBlocks);

		if (isFirstColumn) {
			return null;
		}

		if (!isEqual(firstColumnStructure, columnStructure)) {
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
