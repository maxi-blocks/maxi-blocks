/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getUpdatedBGLayersWithNewUniqueID } from '@extensions/attributes';
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

/**
 * External dependencies
 */
import { cloneDeep, isArray, isEmpty, isEqual, isPlainObject } from 'lodash';

const propagateNewUniqueID = (
	oldUniqueID,
	newUniqueID,
	clientId,
	repeaterStatus,
	repeaterRowClientId,
	bgLayers
) => {
	const blockAttributesUpdate = {};
	const lastChangedBlocks =
		select('maxiBlocks/blocks').getLastInsertedBlocks();

	const updateBlockAttributesUpdate = (clientId, key, value) => {
		// Optimization 1: Value Change Detection
		// Check if the value has actually changed to avoid unnecessary updates
		const currentBlock = select('core/block-editor').getBlock(clientId);
		if (
			currentBlock &&
			currentBlock.attributes &&
			currentBlock.attributes[key]
		) {
			const currentValue = currentBlock.attributes[key];
			// Deep comparison for complex objects like relations and background-layers
			if (isEqual(currentValue, value)) {
				return blockAttributesUpdate; // Skip unchanged values
			}
		}

		if (!blockAttributesUpdate[clientId])
			blockAttributesUpdate[clientId] = {};

		blockAttributesUpdate[clientId][key] = value;

		return blockAttributesUpdate;
	};

	const updateRelations = () => {
		// ENHANCED: Don't skip relation updates if lastChangedBlocks is empty during view mode switches
		// This can happen when components remount after switching between visual/code views

		// If lastChangedBlocks is empty but we have a valid clientId, it might be a view mode switch
		// In this case, we should still process relations to prevent them from being lost
		if (isEmpty(lastChangedBlocks)) {
			// Check if the current block exists and has relations that need updating
			const currentBlock = select('core/block-editor').getBlock(clientId);
			if (
				currentBlock &&
				currentBlock.attributes &&
				currentBlock.attributes.relations
			) {
				// Normalize relations to array: if it's already an array use it,
				// otherwise if it's an object use Object.values(), or [] if falsy
				const { relations } = currentBlock.attributes;
				const relationsArray = Array.isArray(relations)
					? relations
					: relations && typeof relations === 'object'
					? Object.values(relations)
					: [];

				const hasRelationsWithOldID = relationsArray.some(
					relation => relation && relation.uniqueID === oldUniqueID
				);

				if (hasRelationsWithOldID) {
					// Don't return early - continue with relation updates
				} else {
					return; // No relations to update
				}
			} else {
				return; // No block or relations found
			}
		}

		let firstColumnToModifyClientId = null;

		const blockEditorStore = select('core/block-editor');
		const maxiBlocksStore = select('maxiBlocks/blocks');
		const blockEditorDispatch = dispatch('maxiBlocks/blocks');
		const { getBlock } = blockEditorStore;

		const attributesHasRelations = attributes =>
			'relations' in attributes &&
			!isEmpty(attributes.relations) &&
			(isArray(attributes.relations) ||
				(isPlainObject(attributes.relations) &&
					isArray(Object.values(attributes.relations))));

		const getColumnClientId = (clientId, repeaterColumnClientIds) => {
			const { getBlockName } = blockEditorStore;
			const blockName = getBlockName(clientId);

			if (blockName === 'maxi-blocks/column-maxi') return clientId;

			if (!repeaterColumnClientIds) return null;

			const { getBlockParentsByBlockName } = blockEditorStore;
			return getBlockParentsByBlockName(
				clientId,
				'maxi-blocks/column-maxi'
			).find(parentClientId =>
				repeaterColumnClientIds.includes(parentClientId)
			);
		};

		const shouldUpdateRelation = (
			relation,
			clientId,
			repeaterColumnClientIds
		) => {
			if (relation.uniqueID !== oldUniqueID) return false;

			if (repeaterStatus) {
				const columnClientId = getColumnClientId(
					clientId,
					repeaterColumnClientIds
				);

				return (
					!columnClientId ||
					!firstColumnToModifyClientId ||
					firstColumnToModifyClientId === columnClientId
				);
			}

			return true;
		};

		const updateRelationsWithNewUniqueID = (
			relations,
			clientId,
			repeaterColumnClientIds
		) =>
			cloneDeep(relations).map(relation => {
				if (
					shouldUpdateRelation(
						relation,
						clientId,
						repeaterColumnClientIds
					)
				) {
					firstColumnToModifyClientId = getColumnClientId(
						clientId,
						repeaterColumnClientIds
					);
					relation.uniqueID = newUniqueID;
				}
				return relation;
			});

		const updateBlockRelations = (block, repeaterColumnClientIds) => {
			if (!block) return;

			const { attributes = {}, clientId } = block;

			if (!attributesHasRelations(attributes)) return;

			// CRITICAL FIX: Re-fetch the block from store to get latest attributes
			// Previous updates from other blocks might have already modified the relations
			const freshBlock = blockEditorStore.getBlock(clientId);
			const freshAttributes = freshBlock?.attributes || attributes;

			// Check blockAttributesUpdate first (current function's pending updates),
			// then fresh attributes from store (previous functions' applied updates),
			// finally fall back to original attributes
			const currentRelations =
				blockAttributesUpdate[clientId]?.relations ||
				freshAttributes.relations ||
				attributes.relations;

			// Guard against undefined and detect original data type
			// Determine if original relations was an Array or Object to preserve the shape
			const originalRelations =
				freshAttributes.relations || attributes.relations;
			const isOriginalArray = isArray(originalRelations);

			// Provide appropriate fallback based on original type
			const safeCurrentRelations =
				currentRelations || (isOriginalArray ? [] : {});

			// Normalize to array for processing while preserving original type info
			const relations = isArray(safeCurrentRelations)
				? safeCurrentRelations
				: Object.values(safeCurrentRelations);

			const newRelations = updateRelationsWithNewUniqueID(
				relations,
				clientId,
				repeaterColumnClientIds
			);

			if (!isEqual(relations, newRelations)) {
				// Convert back to original shape: if original was object, convert array back to object
				// If original was array, keep as array
				let relationsToSave = newRelations;
				if (!isOriginalArray && isArray(newRelations)) {
					// Convert array back to object structure
					// Preserve original object keys if possible, otherwise use indices
					relationsToSave = {};
					if (isPlainObject(safeCurrentRelations)) {
						// Try to preserve original keys
						const originalKeys = Object.keys(safeCurrentRelations);
						newRelations.forEach((relation, index) => {
							const key = originalKeys[index] || index.toString();
							relationsToSave[key] = relation;
						});
					} else {
						// Use indices as keys
						newRelations.forEach((relation, index) => {
							relationsToSave[index.toString()] = relation;
						});
					}
				}

				updateBlockAttributesUpdate(
					clientId,
					'relations',
					relationsToSave
				);

				if (!maxiBlocksStore.getBlockByClientId(clientId)) {
					blockEditorDispatch.addBlockWithUpdatedAttributes(clientId);
				}
			}
		};

		const getRepeaterColumnClientIds = () => {
			const { getBlock } = blockEditorStore;
			return (
				repeaterStatus &&
				repeaterRowClientId &&
				getBlock(repeaterRowClientId).innerBlocks.map(
					block => block.clientId
				)
			);
		};

		const getRepeaterColumnClientId = repeaterColumnClientIds => {
			if (!repeaterStatus) return null;

			const parentColumnsClientIds =
				blockEditorStore.getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				);
			return parentColumnsClientIds.find(columnClientId =>
				repeaterColumnClientIds.includes(columnClientId)
			);
		};

		const repeaterColumnClientIds = getRepeaterColumnClientIds();
		const repeaterColumnClientId = getRepeaterColumnClientId(
			repeaterColumnClientIds
		);

		const clientIdsToProcess = new Set([
			...lastChangedBlocks,
			repeaterColumnClientId,
		]);
		for (const clientId of clientIdsToProcess) {
			const block = getBlock(clientId);
			updateBlockRelations(block, repeaterColumnClientIds);
		}
	};

	const updateBGLayers = () => {
		const updatedBGLayers = getUpdatedBGLayersWithNewUniqueID(
			bgLayers,
			newUniqueID
		);

		if (updatedBGLayers) {
			dispatch('maxiBlocks/blocks').addBlockWithUpdatedAttributes(
				clientId
			);
			updateBlockAttributesUpdate(
				clientId,
				'background-layers',
				updatedBGLayers
			);
		}
	};

	const updateGlobalRelations = () => {
		// Update relations in ALL blocks that point to the old uniqueID
		// This ensures IB relations are preserved when duplicating and removing original blocks
		const attributesHasRelations = attributes =>
			'relations' in attributes &&
			!isEmpty(attributes.relations) &&
			(isArray(attributes.relations) ||
				(isPlainObject(attributes.relations) &&
					isArray(Object.values(attributes.relations))));

		const blockEditorStore = select('core/block-editor');

		// Check if the old uniqueID still exists elsewhere (copy-paste) or not (pattern import)
		let originalBlockStillExists = false;
		goThroughMaxiBlocks(block => {
			if (
				block.attributes.uniqueID === oldUniqueID &&
				block.clientId !== clientId
			) {
				originalBlockStillExists = true;
				return true; // Stop searching
			}
			return false;
		});

		// ENHANCED: Additional safety check for view mode switches
		// If we're in a view mode switch scenario, be more aggressive about updating relations
		const isLikelyViewModeSwitch =
			isEmpty(lastChangedBlocks) && !originalBlockStillExists;

		goThroughMaxiBlocks(block => {
			const { attributes, clientId: blockClientId } = block;

			// Skip blocks that are part of the duplication (already handled by updateRelations)
			// BUT only skip them if this is copy-paste (original still exists)
			// For pattern imports (original doesn't exist), we MUST update them here
			// ENHANCED: Don't skip during likely view mode switches to ensure relations are preserved
			if (
				Array.isArray(lastChangedBlocks) &&
				lastChangedBlocks.includes(blockClientId) &&
				originalBlockStillExists &&
				!isLikelyViewModeSwitch
			) {
				return false;
			}

			if (!attributesHasRelations(attributes)) return false;

			// CRITICAL FIX: Re-fetch the block from store to get latest attributes
			// Previous updates from other blocks might have already modified the relations
			const freshBlock = blockEditorStore.getBlock(blockClientId);
			const freshAttributes = freshBlock?.attributes || attributes;

			// Check blockAttributesUpdate first (current function's pending updates),
			// then fresh attributes from store (previous functions' applied updates),
			// finally fall back to original attributes
			const currentRelations =
				blockAttributesUpdate[blockClientId]?.relations ||
				freshAttributes.relations ||
				attributes.relations;

			// Guard against undefined and detect original data type
			// Determine if original relations was an Array or Object to preserve the shape
			const originalRelations =
				freshAttributes.relations || attributes.relations;
			const isOriginalArray = isArray(originalRelations);

			// Provide appropriate fallback based on original type
			const safeCurrentRelations =
				currentRelations || (isOriginalArray ? [] : {});

			// Normalize to array for processing while preserving original type info
			const relations = isArray(safeCurrentRelations)
				? safeCurrentRelations
				: Object.values(safeCurrentRelations);

			// Check if any relation points to the old uniqueID
			const hasOldUniqueID = relations.some(
				relation => relation.uniqueID === oldUniqueID
			);

			if (hasOldUniqueID) {
				const newRelations = cloneDeep(relations).map(relation => {
					if (relation.uniqueID === oldUniqueID) {
						return {
							...relation,
							uniqueID: newUniqueID,
						};
					}
					return relation;
				});

				if (!isEqual(relations, newRelations)) {
					// Convert back to original shape: if original was object, convert array back to object
					// If original was array, keep as array
					let relationsToSave = newRelations;
					if (!isOriginalArray && isArray(newRelations)) {
						// Convert array back to object structure
						// Preserve original object keys if possible, otherwise use indices
						relationsToSave = {};
						if (isPlainObject(safeCurrentRelations)) {
							// Try to preserve original keys
							const originalKeys =
								Object.keys(safeCurrentRelations);
							newRelations.forEach((relation, index) => {
								const key =
									originalKeys[index] || index.toString();
								relationsToSave[key] = relation;
							});
						} else {
							// Use indices as keys
							newRelations.forEach((relation, index) => {
								relationsToSave[index.toString()] = relation;
							});
						}
					}

					updateBlockAttributesUpdate(
						blockClientId,
						'relations',
						relationsToSave
					);

					const maxiBlocksStore = select('maxiBlocks/blocks');
					const blockEditorDispatch = dispatch('maxiBlocks/blocks');
					if (!maxiBlocksStore.getBlockByClientId(blockClientId)) {
						blockEditorDispatch.addBlockWithUpdatedAttributes(
							blockClientId
						);
					}
				}
			}

			return false;
		});
	};

	updateRelations();
	updateBGLayers();
	updateGlobalRelations();

	if (!isEmpty(blockAttributesUpdate)) {
		// Optimization 2: Block Existence Check & Update Batching
		// Filter out non-existent blocks and empty attribute objects
		const optimizedUpdates = {};
		Object.entries(blockAttributesUpdate).forEach(
			([blockClientId, attributes]) => {
				if (attributes && Object.keys(attributes).length > 0) {
					// Check if block still exists before updating
					const blockExists =
						select('core/block-editor').getBlock(blockClientId);
					if (blockExists) {
						optimizedUpdates[blockClientId] = attributes;
					}
				}
			}
		);

		const updateCount = Object.keys(optimizedUpdates).length;
		if (updateCount === 0) return;

		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
			updateBlockAttributes,
		} = dispatch('core/block-editor');

		// Optimization 3: Critical vs Non-Critical Update Separation
		// Separate critical updates (current block + copied blocks) from non-critical ones
		const criticalUpdates = {};
		const deferredUpdates = {};

		Object.entries(optimizedUpdates).forEach(
			([blockClientId, attributes]) => {
				if (
					blockClientId === clientId ||
					(Array.isArray(lastChangedBlocks) &&
						lastChangedBlocks.includes(blockClientId))
				) {
					// Current block or copied blocks - update immediately
					// Copied blocks must be immediate because subsequent propagateNewUniqueID calls
					// will need the updated relations before their setTimeout delays expire
					criticalUpdates[blockClientId] = attributes;
				} else {
					// Other unrelated blocks - can be deferred
					deferredUpdates[blockClientId] = attributes;
				}
			}
		);

		// Process critical updates immediately
		for (const [blockClientId, attributes] of Object.entries(
			criticalUpdates
		)) {
			// Optimization 4: Final Value Verification
			// Double-check value before expensive updateBlockAttributes call
			const block = select('core/block-editor').getBlock(blockClientId);
			if (block && Object.keys(attributes).length === 1) {
				// For single attribute updates, verify the value isn't already identical
				const [attrKey, attrValue] = Object.entries(attributes)[0];
				if (block.attributes[attrKey] !== attrValue) {
					markNextChangeAsNotPersistent();
					updateBlockAttributes(blockClientId, attributes);
				}
			} else {
				// Multiple attributes or block not found - use standard update
				markNextChangeAsNotPersistent();
				updateBlockAttributes(blockClientId, attributes);
			}
		}

		// Optimization 5: Deferred Processing for Non-Critical Updates
		// Process non-critical updates with a small delay to avoid blocking the UI
		const deferredCount = Object.keys(deferredUpdates).length;
		if (deferredCount > 0) {
			setTimeout(() => {
				for (const [blockClientId, attributes] of Object.entries(
					deferredUpdates
				)) {
					// Apply same optimization logic for deferred updates
					const block =
						select('core/block-editor').getBlock(blockClientId);
					if (block && Object.keys(attributes).length === 1) {
						const [attrKey, attrValue] =
							Object.entries(attributes)[0];
						if (block.attributes[attrKey] !== attrValue) {
							markNextChangeAsNotPersistent();
							updateBlockAttributes(blockClientId, attributes);
						}
					} else {
						markNextChangeAsNotPersistent();
						updateBlockAttributes(blockClientId, attributes);
					}
				}
			}, 50); // 50ms delay to let the main thread breathe
		}
	}

	// Minimal performance monitoring - only available in debug mode
	// To enable: window.maxiBlocksDebug = true in browser console
};

export default propagateNewUniqueID;
