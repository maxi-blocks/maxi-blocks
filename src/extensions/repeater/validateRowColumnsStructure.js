/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { cleanInnerBlocks, excludeAttributes } from '@extensions/copy-paste';
import {
	findBlockPosition,
	findTarget,
	getChildColumns,
	goThroughColumns,
} from './utils';
import updateNCLimits from './updateNCLimits';
import updateSVG from './updateSVG';
import updateRelationsInColumn from './updateRelationsInColumn';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import { getBlockData } from '@extensions/attributes';
import loadColumnsTemplate from '@extensions/column-templates/loadColumnsTemplate';
import { getTemplates } from '@extensions/column-templates';
import { getLastBreakpointAttribute } from '@extensions/styles';
import DISALLOWED_BLOCKS from './disallowedBlocks';

/**
 * External dependencies
 */
import { isEmpty, isEqual, round } from 'lodash';

const validateAttributes = (
	block,
	column,
	innerBlocksPositions,
	indexToValidateBy = 0,
	disableRelationsUpdate = false,
	modifiedMarkNextChangeAsNotPersistent = dispatch('core/block-editor')
		.__unstableMarkNextChangeAsNotPersistent
) => {
	const copyPasteMapping = getBlockData(block.name)?.copyPasteMapping;

	const blockPosition = findBlockPosition(block.clientId, column);
	const refClientId =
		innerBlocksPositions?.[blockPosition]?.at(indexToValidateBy);
	const refColumnClientId =
		innerBlocksPositions?.[[-1]]?.at(indexToValidateBy);

	if (!refClientId) {
		return false;
	}

	const { getBlockAttributes } = select('core/block-editor');

	const nonExcludedRefAttributes = excludeAttributes(
		getBlockAttributes(refClientId),
		block.attributes,
		copyPasteMapping,
		true,
		block.name
	);

	if (!disableRelationsUpdate) {
		updateRelationsInColumn(
			nonExcludedRefAttributes,
			refColumnClientId,
			column.clientId,
			innerBlocksPositions
		);
	}

	updateNCLimits(nonExcludedRefAttributes, block.attributes);
	updateSVG(nonExcludedRefAttributes, block.attributes);

	// Disable repeater for nested rows
	if (block.name === 'maxi-blocks/row-maxi') {
		nonExcludedRefAttributes['repeater-status'] = false;
	}

	const nonExcludedBlockAttributes = excludeAttributes(
		block.attributes,
		block.attributes,
		copyPasteMapping,
		true,
		block.name
	);

	if (!isEqual(nonExcludedRefAttributes, nonExcludedBlockAttributes)) {
		const { updateBlockAttributes } = dispatch('core/block-editor');

		modifiedMarkNextChangeAsNotPersistent();
		updateBlockAttributes(block.clientId, nonExcludedRefAttributes);
	}

	return null;
};

const replaceColumnInnerBlocks = (
	columnClientId,
	columnToValidateByClientId,
	columnToValidateByIndex,
	innerBlocksPositions,
	modifiedMarkNextChangeAsNotPersistent
) => {
	const { replaceInnerBlocks } = dispatch('core/block-editor');
	const { getBlock } = select('core/block-editor');

	const newInnerBlocks = cleanInnerBlocks(
		getBlock(columnToValidateByClientId).innerBlocks
	);
	const column = getBlock(columnClientId);

	const newColumn = {
		...column,
		innerBlocks: newInnerBlocks,
	};

	goThroughMaxiBlocks(
		block => {
			const blockPosition = findBlockPosition(block.clientId, newColumn);
			const oldBlock = findTarget(blockPosition, column);

			if (!oldBlock) {
				return;
			}

			if (oldBlock.name === block.name) {
				block.clientId = oldBlock.clientId;
			}
		},
		false,
		newInnerBlocks
	);

	modifiedMarkNextChangeAsNotPersistent();
	replaceInnerBlocks(columnClientId, newInnerBlocks, false);
};

/**
 * Transforms all columns in row to have same inner blocks structure and attributes
 *
 * @param {string}                rowClientId
 * @param {Object<string, Array>} innerBlocksPositions
 * @param {Function}              differentColumnsStructureCallback runs when columns have different structure, if returns false - columns won't be transformed
 * @param {string}                rawColumnToValidateByClientId     column to validate by, first column by default
 * @param {boolean}               skipFirstMarkNotPersistent        skip first `__unstableMarkNextChangeAsNotPersistent` call
 * @returns {Promise<boolean>}    true if columns were transformed, false if not
 */
const validateRowColumnsStructure = async (
	rowClientId,
	innerBlocksPositions,
	differentColumnsStructureCallback,
	rawColumnToValidateByClientId,
	skipFirstMarkNotPersistent = false
) => {
	const {
		removeBlock,
		__unstableMarkNextChangeAsNotPersistent: markNextChangeAsNotPersistent,
	} = dispatch('core/block-editor');

	let isFirstCall = skipFirstMarkNotPersistent;

	const modifiedMarkNextChangeAsNotPersistent = () => {
		if (!isFirstCall) {
			markNextChangeAsNotPersistent();
		} else {
			isFirstCall = false;
		}
	};

	let childColumns = getChildColumns(rowClientId, true);

	if (isEmpty(childColumns)) {
		return true;
	}

	if (childColumns.length <= 1) {
		return true;
	}

	let columnToValidateByIndex = 0;

	const columnToValidateBy = rawColumnToValidateByClientId
		? childColumns.find((column, index) => {
				if (column.clientId === rawColumnToValidateByClientId) {
					columnToValidateByIndex = index;
					return true;
				}

				return false;
		  })
		: childColumns[0];
	const columnToValidateByClientId = columnToValidateBy.clientId;

	// Make sure that column to validate by is first in childColumns array
	if (columnToValidateBy.clientId !== childColumns[0].clientId) {
		childColumns = childColumns.filter(
			column => column.clientId !== columnToValidateBy.clientId
		);
		childColumns.unshift(columnToValidateBy);
	}

	const columnsStructure = {};

	const pushToStructure = (block, structureArray) => {
		if (DISALLOWED_BLOCKS.includes(block.name)) {
			modifiedMarkNextChangeAsNotPersistent();
			removeBlock(block.clientId, false);
		} else {
			structureArray.push(block.name);
		}
	};

	let proceedTransformingColumns = null;

	await goThroughColumns(childColumns, null, async column => {
		if (proceedTransformingColumns === false) {
			return;
		}

		// we can't just compare inner blocks, because if they different attributes - it's ok
		// so we need to compare only block names
		const columnInnerBlocks = column.innerBlocks;

		const isColumnToValidateBy =
			column.clientId === columnToValidateBy.clientId;

		columnsStructure[column.clientId] = [];
		const columnStructure = columnsStructure[column.clientId];

		goThroughMaxiBlocks(
			block => pushToStructure(block, columnStructure),
			false,
			columnInnerBlocks
		);

		if (isColumnToValidateBy) {
			return;
		}

		if (
			proceedTransformingColumns === null &&
			columnStructure.length > 0 &&
			!isEqual(
				columnsStructure[columnToValidateByClientId],
				columnStructure
			)
		) {
			proceedTransformingColumns =
				!differentColumnsStructureCallback ||
				(await differentColumnsStructureCallback());
		}
	});

	if (proceedTransformingColumns === false) {
		return false;
	}

	await goThroughColumns(childColumns, null, async column => {
		if (column.clientId === columnToValidateByClientId) {
			return;
		}

		if (
			columnsStructure[column.clientId] &&
			!isEqual(
				columnsStructure[columnToValidateByClientId],
				columnsStructure[column.clientId]
			)
		) {
			replaceColumnInnerBlocks(
				column.clientId,
				columnToValidateByClientId,
				columnToValidateByIndex,
				innerBlocksPositions,
				modifiedMarkNextChangeAsNotPersistent
			);
		}

		validateAttributes(
			column,
			column,
			innerBlocksPositions,
			columnToValidateByIndex,
			false,
			modifiedMarkNextChangeAsNotPersistent
		);

		goThroughMaxiBlocks(
			block =>
				validateAttributes(
					block,
					column,
					innerBlocksPositions,
					columnToValidateByIndex,
					false,
					modifiedMarkNextChangeAsNotPersistent
				),
			false,
			column.innerBlocks
		);
	});

	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	let isEqualTemplate = true;
	let firstColumnWidth;

	breakpoints.forEach(breakpoint =>
		childColumns.forEach((column, index) => {
			if (!isEqualTemplate) {
				return;
			}

			const columnWidth = getLastBreakpointAttribute({
				target: 'column-size',
				breakpoint,
				attributes: column.attributes,
			});

			if (index === 0) {
				firstColumnWidth = columnWidth;
			}

			if (round(columnWidth, 2) !== round(firstColumnWidth, 2)) {
				isEqualTemplate = false;
			}
		})
	);

	if (!isEqualTemplate) {
		const equalTemplateName = getTemplates(
			true,
			'general',
			childColumns.length
		)[0].name;

		loadColumnsTemplate(
			equalTemplateName,
			rowClientId,
			'general',
			childColumns.length,
			true,
			true,
			true
		);
	}

	return true;
};

export { validateAttributes };
export default validateRowColumnsStructure;
