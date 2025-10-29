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
		if (isEmpty(lastChangedBlocks)) return;

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
			const currentRelations = blockAttributesUpdate[clientId]?.relations || freshAttributes.relations;

			const relations = isArray(currentRelations)
				? currentRelations
				: Object.values(currentRelations);
			const newRelations = updateRelationsWithNewUniqueID(
				relations,
				clientId,
				repeaterColumnClientIds
			);

			if (!isEqual(relations, newRelations)) {
				updateBlockAttributesUpdate(
					clientId,
					'relations',
					newRelations
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

		goThroughMaxiBlocks(block => {
			const { attributes, clientId: blockClientId } = block;

			// Skip blocks that are part of the duplication (already handled by updateRelations)
			// BUT only skip them if this is copy-paste (original still exists)
			// For pattern imports (original doesn't exist), we MUST update them here
			if (
				lastChangedBlocks.includes(blockClientId) &&
				originalBlockStillExists
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
			const currentRelations = blockAttributesUpdate[blockClientId]?.relations || freshAttributes.relations;

			const relations = isArray(currentRelations)
				? currentRelations
				: Object.values(currentRelations);

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
					updateBlockAttributesUpdate(
						blockClientId,
						'relations',
						newRelations
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
				if (blockClientId === clientId || lastChangedBlocks.includes(blockClientId)) {
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
