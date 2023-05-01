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

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

const validateRowColumnsStructure = (rowClientId, innerBlocksPositions) => {
	const childColumns = getChildColumns(rowClientId);

	const firstColumn = childColumns[0];
	const firstColumnInnerBlocks = firstColumn.innerBlocks;
	const firstColumnStructure = [];

	const handleReplaceColumn = columnClientId => {
		const { replaceInnerBlocks } = dispatch('core/block-editor');

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

		goThroughMaxiBlocks(block => {
			const isFirstColumn = column.clientId === firstColumn.clientId;

			if (isFirstColumn) {
				return false;
			}

			const copyPasteMapping = getBlockData(block.name)?.copyPasteMapping;

			if (!copyPasteMapping) {
				return false;
			}

			const blockPosition = findBlockPosition(block, column);
			const refClientId = innerBlocksPositions
				.get(`${blockPosition}`)
				.at(0);

			const { getBlockAttributes } = select('core/block-editor');

			const nonExcludedRefAttributes = excludeAttributes(
				getBlockAttributes(refClientId),
				copyPasteMapping
			);
			const nonExcludedBlockAttributes = excludeAttributes(
				block.attributes,
				copyPasteMapping
			);

			if (
				!isEqual(nonExcludedRefAttributes, nonExcludedBlockAttributes)
			) {
				const {
					updateBlockAttributes,
					__unstableMarkNextChangeAsNotPersistent:
						markNextChangeAsNotPersistent,
				} = dispatch('core/block-editor');

				markNextChangeAsNotPersistent();
				updateBlockAttributes(block.clientId, nonExcludedRefAttributes);
			}

			return null;
		}, columnInnerBlocks);

		return null;
	});
};

export default validateRowColumnsStructure;
