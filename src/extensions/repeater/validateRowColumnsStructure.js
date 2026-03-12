/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { cleanInnerBlocks, excludeAttributes } from '@extensions/copy-paste';
import { getBlockPosition, getChildColumns } from './utils';
import retrieveInnerBlocksPositions from './retrieveInnerBlocksPositions';
import updateNCLimits from './updateNCLimits';
import updateSVG from './updateSVG';
import updateRelationsInColumn from './updateRelationsInColumn';
import {
	addRepeaterPerfCount,
	createRepeaterPerfSession,
	measureRepeaterPerf,
	setRepeaterPerfDetail,
	startRepeaterPerfBucket,
} from './perf';
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

const createValidationContext = (
	modifiedMarkNextChangeAsNotPersistent,
	perfSession = null
) => {
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
			addRepeaterPerfCount(perfSession, 'queuedAttributeUpdates', 1);
			addRepeaterPerfCount(
				perfSession,
				'queuedAttributeUpdateKeys',
				Object.keys(attributes).length
			);
			pendingAttributeUpdates.set(clientId, attributes);
		},
		flushQueuedAttributeUpdates() {
			return measureRepeaterPerf(
				perfSession,
				'diffUpdateFlush.total',
				() => {
					if (!pendingAttributeUpdates.size) {
						return;
					}

					const clientIds = [];
					const attributesByClientId = {};
					const stopPrepare = startRepeaterPerfBucket(
						perfSession,
						'diffUpdateFlush.prepare'
					);

					for (const [
						clientId,
						attributes,
					] of pendingAttributeUpdates) {
						clientIds.push(clientId);
						attributesByClientId[clientId] = attributes;
					}

					stopPrepare();
					addRepeaterPerfCount(
						perfSession,
						'flushedAttributeUpdates',
						clientIds.length
					);
					modifiedMarkNextChangeAsNotPersistent();

					const stopDispatch = startRepeaterPerfBucket(
						perfSession,
						'diffUpdateFlush.dispatch'
					);
					blockEditorDispatch.updateBlockAttributes(
						clientIds,
						attributesByClientId,
						true
					);
					stopDispatch();
					pendingAttributeUpdates.clear();
				}
			);
		},
		relationInfoCache,
		perfSession,
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
	const perfSession = validationContext?.perfSession;
	addRepeaterPerfCount(perfSession, 'validateAttributes.calls', 1);

	return measureRepeaterPerf(perfSession, 'validateAttributes.total', () => {
		const copyPasteMapping =
			validationContext?.getCopyPasteMapping(block.name) ||
			getBlockData(block.name)?.copyPasteMapping;

		const blockPosition = getBlockPosition(
			block.clientId,
			innerBlocksPositions
		);
		const refClientId =
			innerBlocksPositions?.[blockPosition]?.at(indexToValidateBy);
		const refColumnClientId =
			innerBlocksPositions?.[[-1]]?.at(indexToValidateBy);

		if (!refClientId) {
			addRepeaterPerfCount(
				perfSession,
				'validateAttributes.missingRef',
				1
			);
			return false;
		}

		const stopExcludeAttributes = startRepeaterPerfBucket(
			perfSession,
			'validateAttributes.excludeAttributes'
		);
		const nonExcludedRefAttributes = excludeAttributes(
			validationContext?.getBlockAttributes(refClientId) ||
				select('core/block-editor').getBlockAttributes(refClientId),
			block.attributes,
			copyPasteMapping,
			true,
			block.name
		);
		stopExcludeAttributes();

		if (!disableRelationsUpdate) {
			updateRelationsInColumn(
				nonExcludedRefAttributes,
				refColumnClientId,
				column.clientId,
				innerBlocksPositions,
				validationContext
			);
		}

		const stopNormalizeAttributes = startRepeaterPerfBucket(
			perfSession,
			'validateAttributes.normalize'
		);
		updateNCLimits(nonExcludedRefAttributes, block.attributes);
		updateSVG(nonExcludedRefAttributes, block.attributes);

		// Disable repeater for nested rows
		if (block.name === 'maxi-blocks/row-maxi') {
			nonExcludedRefAttributes['repeater-status'] = false;
		}
		stopNormalizeAttributes();

		const stopDiff = startRepeaterPerfBucket(
			perfSession,
			'validateAttributes.diff'
		);
		const changedAttributes = getChangedAttributes(
			nonExcludedRefAttributes,
			block.attributes
		);
		stopDiff();

		if (changedAttributes) {
			addRepeaterPerfCount(
				perfSession,
				'validateAttributes.changedBlocks',
				1
			);
			addRepeaterPerfCount(
				perfSession,
				'validateAttributes.changedKeys',
				Object.keys(changedAttributes).length
			);

			if (validationContext?.queueAttributeUpdate) {
				validationContext.queueAttributeUpdate(
					block.clientId,
					changedAttributes
				);
			} else {
				const { updateBlockAttributes } = dispatch('core/block-editor');

				modifiedMarkNextChangeAsNotPersistent();
				const stopImmediateDispatch = startRepeaterPerfBucket(
					perfSession,
					'validateAttributes.immediateDispatch'
				);
				updateBlockAttributes(block.clientId, changedAttributes);
				stopImmediateDispatch();
			}
		}

		return null;
	});
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
	modifiedMarkNextChangeAsNotPersistent,
	perfSession = null
) => {
	return measureRepeaterPerf(
		perfSession,
		'replacePhase.replaceColumn',
		() => {
			const { replaceInnerBlocks } = dispatch('core/block-editor');
			const { getBlock } = select('core/block-editor');

			const stopClone = startRepeaterPerfBucket(
				perfSession,
				'replacePhase.cleanInnerBlocks'
			);
			const newInnerBlocks = cleanInnerBlocks(
				getBlock(columnToValidateByClientId).innerBlocks
			);
			const column = getBlock(columnClientId);
			stopClone();

			const stopSyncClientIds = startRepeaterPerfBucket(
				perfSession,
				'replacePhase.syncClientIds'
			);
			syncClientIdsByStructure(newInnerBlocks, column.innerBlocks);
			stopSyncClientIds();

			modifiedMarkNextChangeAsNotPersistent();
			const stopDispatch = startRepeaterPerfBucket(
				perfSession,
				'replacePhase.dispatch'
			);
			replaceInnerBlocks(columnClientId, newInnerBlocks, false);
			stopDispatch();
		}
	);
};

const getLiveColumnAnalysis = (
	columnClientId,
	removeBlock,
	markNotPersistent
) => {
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
	const perfSession = createRepeaterPerfSession(
		'validateRowColumnsStructure',
		{
			rowClientId,
			innerBlocksPositionsSource:
				typeof innerBlocksPositions === 'function'
					? 'resolver'
					: 'snapshot',
		}
	);
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
	let resolvedInnerBlocksPositions =
		typeof innerBlocksPositions === 'function'
			? null
			: innerBlocksPositions;
	const perfSummary = {
		result: true,
		childColumns: 0,
		validatedColumns: 0,
		hasColumnReplacements: false,
	};
	const resolveInnerBlocksPositions = (forceRefresh = false) => {
		if (!forceRefresh && resolvedInnerBlocksPositions) {
			addRepeaterPerfCount(
				perfSession,
				'innerBlocksPositions.cacheHits',
				1
			);
			return resolvedInnerBlocksPositions;
		}

		const stopResolveInnerBlocksPositions = startRepeaterPerfBucket(
			perfSession,
			forceRefresh
				? 'innerBlocksPositions.refresh'
				: 'innerBlocksPositions.initialBuild'
		);
		if (forceRefresh || !resolvedInnerBlocksPositions) {
			resolvedInnerBlocksPositions =
				typeof innerBlocksPositions === 'function'
					? innerBlocksPositions()
					: retrieveInnerBlocksPositions(
							select('core/block-editor').getBlockOrder(
								rowClientId
							)
					  );
		}
		stopResolveInnerBlocksPositions();

		return resolvedInnerBlocksPositions;
	};

	try {
		let childColumns = getChildColumns(rowClientId, true);
		perfSummary.childColumns = childColumns?.length || 0;
		setRepeaterPerfDetail(
			perfSession,
			'childColumns',
			perfSummary.childColumns
		);

		if (isEmpty(childColumns)) {
			return true;
		}

		const validationContext = createValidationContext(
			modifiedMarkNextChangeAsNotPersistent,
			perfSession
		);
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
		setRepeaterPerfDetail(
			perfSession,
			'columnToValidateByClientId',
			columnToValidateByClientId
		);
		setRepeaterPerfDetail(
			perfSession,
			'columnToValidateByIndex',
			columnToValidateByIndex
		);

		// Make sure that column to validate by is first in childColumns array
		if (columnToValidateBy.clientId !== childColumns[0].clientId) {
			childColumns = childColumns.filter(
				column => column.clientId !== columnToValidateBy.clientId
			);
			childColumns.unshift(columnToValidateBy);
		}

		let proceedTransformingColumns = null;
		const columnAnalysis = new Map();

		await measureRepeaterPerf(
			perfSession,
			'structureScan.total',
			async () => {
				/* eslint-disable no-await-in-loop */
				for (const column of childColumns) {
					const analysis = collectColumnAnalysis(
						column,
						removeBlock,
						modifiedMarkNextChangeAsNotPersistent
					);
					addRepeaterPerfCount(
						perfSession,
						'structureScan.columns',
						1
					);
					addRepeaterPerfCount(
						perfSession,
						'structureScan.maxiBlocks',
						analysis.maxiBlocks.length
					);
					columnAnalysis.set(column.clientId, analysis);

					if (
						column.clientId !== columnToValidateByClientId &&
						proceedTransformingColumns === null &&
						analysis.structure.length > 0 &&
						!isEqual(
							columnAnalysis.get(columnToValidateByClientId)
								?.structure,
							analysis.structure
						)
					) {
						addRepeaterPerfCount(
							perfSession,
							'structureScan.mismatchedColumns',
							1
						);
						// Sequential by design so the confirmation callback can gate the remaining work.
						proceedTransformingColumns =
							!differentColumnsStructureCallback ||
							(await measureRepeaterPerf(
								perfSession,
								'structureScan.confirmation',
								() => differentColumnsStructureCallback()
							));

						if (proceedTransformingColumns === false) {
							perfSummary.result = false;
							return;
						}
					}
				}
				/* eslint-enable no-await-in-loop */
			}
		);

		if (proceedTransformingColumns === false) {
			return false;
		}

		const validatedColumns = new Map();

		measureRepeaterPerf(perfSession, 'replacePhase.total', () => {
			for (const column of childColumns) {
				if (column.clientId !== columnToValidateByClientId) {
					let currentColumn = column;
					let currentAnalysis = columnAnalysis.get(column.clientId);

					if (
						currentAnalysis?.structure &&
						!isEqual(
							columnAnalysis.get(columnToValidateByClientId)
								?.structure,
							currentAnalysis.structure
						)
					) {
						addRepeaterPerfCount(
							perfSession,
							'replacePhase.columns',
							1
						);
						replaceColumnInnerBlocks(
							column.clientId,
							columnToValidateByClientId,
							modifiedMarkNextChangeAsNotPersistent,
							perfSession
						);
						perfSummary.hasColumnReplacements = true;

						const liveAnalysis = measureRepeaterPerf(
							perfSession,
							'replacePhase.liveAnalysis',
							() =>
								getLiveColumnAnalysis(
									column.clientId,
									removeBlock,
									modifiedMarkNextChangeAsNotPersistent
								)
						);
						currentColumn = liveAnalysis.column;
						currentAnalysis = liveAnalysis;
					}

					validatedColumns.set(column.clientId, {
						column: currentColumn,
						analysis: currentAnalysis,
					});
				}
			}
		});

		const currentInnerBlocksPositions = resolveInnerBlocksPositions(
			perfSummary.hasColumnReplacements
		);

		measureRepeaterPerf(perfSession, 'validatePhase.total', () => {
			for (const { column, analysis } of validatedColumns.values()) {
				addRepeaterPerfCount(perfSession, 'validatePhase.columns', 1);
				perfSummary.validatedColumns += 1;

				validateAttributes(
					column,
					column,
					currentInnerBlocksPositions,
					columnToValidateByIndex,
					false,
					modifiedMarkNextChangeAsNotPersistent,
					validationContext
				);

				for (const block of analysis?.maxiBlocks || []) {
					addRepeaterPerfCount(
						perfSession,
						'validatePhase.maxiBlocks',
						1
					);
					validateAttributes(
						block,
						column,
						currentInnerBlocksPositions,
						columnToValidateByIndex,
						false,
						modifiedMarkNextChangeAsNotPersistent,
						validationContext
					);
				}
			}
		});

		validationContext.flushQueuedAttributeUpdates();

		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

		let isEqualTemplate = true;
		let firstColumnWidth;

		measureRepeaterPerf(perfSession, 'templateSync.total', () => {
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
				addRepeaterPerfCount(perfSession, 'templateSync.loads', 1);
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
		});

		return true;
	} finally {
		perfSession?.flush({
			result: perfSummary.result,
			hasColumnReplacements: perfSummary.hasColumnReplacements,
			validatedColumns: perfSummary.validatedColumns,
			childColumns: perfSummary.childColumns,
		});
	}
};

export { validateAttributes };
export default validateRowColumnsStructure;
