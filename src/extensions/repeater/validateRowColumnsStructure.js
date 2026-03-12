/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { cleanInnerBlocks, excludeAttributes } from '@extensions/copy-paste';
import {
	getBlockPosition,
	getChildColumns,
} from './utils';
import retrieveInnerBlocksPositions from './retrieveInnerBlocksPositions';
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

const createValidationContext = modifiedMarkNextChangeAsNotPersistent => {
	const copyPasteMappingCache = new Map();
	const blockAttributesCache = new Map();
	const pendingAttributeUpdates = new Map();
	const relationInfoCache = new Map();
	const blockEditorSelect = select('core/block-editor');
	const blockEditorDispatch = dispatch('core/block-editor');

	return {
		getCopyPasteMapping(blockName) {
			if (!copyPasteMappingCache.has(blockName)) {
				copyPasteMappingCache.set(
					blockName,
					getBlockData(blockName)?.copyPasteMapping
				);
			}

			return copyPasteMappingCache.get(blockName);
		},
		getBlockAttributes(clientId) {
			if (!blockAttributesCache.has(clientId)) {
				blockAttributesCache.set(
					clientId,
					blockEditorSelect.getBlockAttributes(clientId)
				);
			}

			return blockAttributesCache.get(clientId);
		},
		queueAttributeUpdate(clientId, attributes) {
			pendingAttributeUpdates.set(clientId, attributes);
		},
		flushQueuedAttributeUpdates() {
			if (!pendingAttributeUpdates.size) {
				return;
			}

			const clientIds = [];
			const attributesByClientId = {};

			for (const [clientId, attributes] of pendingAttributeUpdates) {
				clientIds.push(clientId);
				attributesByClientId[clientId] = attributes;
			}

			modifiedMarkNextChangeAsNotPersistent();
			blockEditorDispatch.updateBlockAttributes(
				clientIds,
				attributesByClientId,
				true
			);
			pendingAttributeUpdates.clear();
		},
		relationInfoCache,
	};
};

const getChangedAttributes = (nextAttributes, currentAttributes) => {
	if (!nextAttributes) {
		return null;
	}

	const changedAttributes = {};

	Object.entries(nextAttributes).forEach(([key, value]) => {
		if (!isEqual(currentAttributes?.[key], value)) {
			changedAttributes[key] = value;
		}
	});

	return isEmpty(changedAttributes) ? null : changedAttributes;
};

const collectColumnAnalysis = (
	column,
	removeBlock,
	modifiedMarkNextChangeAsNotPersistent
) => {
	const structure = [];
	const maxiBlocks = [];

	goThroughMaxiBlocks(
		block => {
			if (DISALLOWED_BLOCKS.includes(block.name)) {
				modifiedMarkNextChangeAsNotPersistent();
				removeBlock(block.clientId, false);
				return null;
			}

			structure.push(block.name);
			maxiBlocks.push(block);

			return null;
		},
		false,
		column.innerBlocks
	);

	return {
		structure,
		maxiBlocks,
	};
};

const validateAttributes = (
	block,
	column,
	innerBlocksPositions,
	indexToValidateBy = 0,
	disableRelationsUpdate = false,
	modifiedMarkNextChangeAsNotPersistent = dispatch('core/block-editor')
		.__unstableMarkNextChangeAsNotPersistent,
	validationContext = null
) => {
	const copyPasteMapping =
		validationContext?.getCopyPasteMapping(block.name) ||
		getBlockData(block.name)?.copyPasteMapping;

	const blockPosition = getBlockPosition(block.clientId, innerBlocksPositions);
	const refClientId =
		innerBlocksPositions?.[blockPosition]?.at(indexToValidateBy);
	const refColumnClientId =
		innerBlocksPositions?.[[-1]]?.at(indexToValidateBy);

	if (!refClientId) {
		return false;
	}

	const nonExcludedRefAttributes = excludeAttributes(
		validationContext?.getBlockAttributes(refClientId) ||
			select('core/block-editor').getBlockAttributes(refClientId),
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
			innerBlocksPositions,
			validationContext
		);
	}

	updateNCLimits(nonExcludedRefAttributes, block.attributes);
	updateSVG(nonExcludedRefAttributes, block.attributes);

	// Disable repeater for nested rows
	if (block.name === 'maxi-blocks/row-maxi') {
		nonExcludedRefAttributes['repeater-status'] = false;
	}

	const changedAttributes = getChangedAttributes(
		nonExcludedRefAttributes,
		block.attributes
	);

	if (changedAttributes) {
		if (validationContext?.queueAttributeUpdate) {
			validationContext.queueAttributeUpdate(
				block.clientId,
				changedAttributes
			);
		} else {
			const { updateBlockAttributes } = dispatch('core/block-editor');

			modifiedMarkNextChangeAsNotPersistent();
			updateBlockAttributes(block.clientId, changedAttributes);
		}
	}

	return null;
};

const syncClientIdsByStructure = (newBlocks, oldBlocks) => {
	newBlocks.forEach((block, index) => {
		const oldBlock = oldBlocks?.[index];

		if (!oldBlock) {
			return;
		}

		if (oldBlock.name === block.name) {
			block.clientId = oldBlock.clientId;
		}

		if (block.innerBlocks?.length) {
			syncClientIdsByStructure(block.innerBlocks, oldBlock.innerBlocks);
		}
	});
};

const replaceColumnInnerBlocks = (
	columnClientId,
	columnToValidateByClientId,
	modifiedMarkNextChangeAsNotPersistent
) => {
	const { replaceInnerBlocks } = dispatch('core/block-editor');
	const { getBlock } = select('core/block-editor');

	const newInnerBlocks = cleanInnerBlocks(
		getBlock(columnToValidateByClientId).innerBlocks
	);
	const column = getBlock(columnClientId);

	syncClientIdsByStructure(newInnerBlocks, column.innerBlocks);

	modifiedMarkNextChangeAsNotPersistent();
	replaceInnerBlocks(columnClientId, newInnerBlocks, false);
};

const getLiveColumnAnalysis = (columnClientId, removeBlock, markNotPersistent) => {
	const column = select('core/block-editor').getBlock(columnClientId);

	return {
		column,
		...collectColumnAnalysis(column, removeBlock, markNotPersistent),
	};
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
	const validationContext = createValidationContext(
		modifiedMarkNextChangeAsNotPersistent
	);
	let resolvedInnerBlocksPositions =
		typeof innerBlocksPositions === 'function'
			? null
			: innerBlocksPositions;
	const resolveInnerBlocksPositions = (forceRefresh = false) => {
		if (forceRefresh || !resolvedInnerBlocksPositions) {
			resolvedInnerBlocksPositions =
				typeof innerBlocksPositions === 'function'
					? innerBlocksPositions()
					: retrieveInnerBlocksPositions(
							select('core/block-editor').getBlockOrder(rowClientId)
					  );
		}

		return resolvedInnerBlocksPositions;
	};

	let childColumns = getChildColumns(rowClientId, true);

	if (isEmpty(childColumns)) {
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

	let proceedTransformingColumns = null;
	const columnAnalysis = new Map();

	for (const column of childColumns) {
		const analysis = collectColumnAnalysis(
			column,
			removeBlock,
			modifiedMarkNextChangeAsNotPersistent
		);
		columnAnalysis.set(column.clientId, analysis);

		if (column.clientId === columnToValidateByClientId) {
			continue;
		}

		if (
			proceedTransformingColumns === null &&
			analysis.structure.length > 0 &&
			!isEqual(
				columnAnalysis.get(columnToValidateByClientId)?.structure,
				analysis.structure
			)
		) {
			proceedTransformingColumns =
				!differentColumnsStructureCallback ||
				(await differentColumnsStructureCallback());

			if (proceedTransformingColumns === false) {
				return false;
			}
		}
	}

	let hasColumnReplacements = false;
	const validatedColumns = new Map();

	for (const column of childColumns) {
		if (column.clientId === columnToValidateByClientId) {
			continue;
		}

		let currentColumn = column;
		let currentAnalysis = columnAnalysis.get(column.clientId);

		if (
			currentAnalysis?.structure &&
			!isEqual(
				columnAnalysis.get(columnToValidateByClientId)?.structure,
				currentAnalysis.structure
			)
		) {
			replaceColumnInnerBlocks(
				column.clientId,
				columnToValidateByClientId,
				modifiedMarkNextChangeAsNotPersistent
			);
			hasColumnReplacements = true;

			const liveAnalysis = getLiveColumnAnalysis(
				column.clientId,
				removeBlock,
				modifiedMarkNextChangeAsNotPersistent
			);
			currentColumn = liveAnalysis.column;
			currentAnalysis = liveAnalysis;
		}

		validatedColumns.set(column.clientId, {
			column: currentColumn,
			analysis: currentAnalysis,
		});
	}

	const currentInnerBlocksPositions = resolveInnerBlocksPositions(
		hasColumnReplacements
	);

	for (const { column, analysis } of validatedColumns.values()) {
		validateAttributes(
			column,
			column,
			currentInnerBlocksPositions,
			columnToValidateByIndex,
			false,
			modifiedMarkNextChangeAsNotPersistent,
			validationContext
		);

		analysis?.maxiBlocks.forEach(block =>
			validateAttributes(
				block,
				column,
				currentInnerBlocksPositions,
				columnToValidateByIndex,
				false,
				modifiedMarkNextChangeAsNotPersistent,
				validationContext
			)
		);
	}

	validationContext.flushQueuedAttributeUpdates();

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
