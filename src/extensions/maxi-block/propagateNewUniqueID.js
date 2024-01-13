/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getUpdatedBGLayersWithNewUniqueID } from '../attributes';

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

			const relations = isArray(attributes.relations)
				? attributes.relations
				: Object.values(attributes.relations);
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

	updateRelations();
	updateBGLayers();

	if (!isEmpty(blockAttributesUpdate)) {
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
			updateBlockAttributes,
		} = dispatch('core/block-editor');

		for (const [clientId, attributes] of Object.entries(
			blockAttributesUpdate
		)) {
			if (attributes) {
				markNextChangeAsNotPersistent();
				updateBlockAttributes(clientId, attributes);
			}
		}
	}
};

export default propagateNewUniqueID;
