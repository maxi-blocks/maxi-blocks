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
	getInnerBlocksPositions,
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

		const attributesHasRelations = attributes =>
			'relations' in attributes &&
			!isEmpty(attributes.relations) &&
			(isArray(attributes.relations) ||
				(isPlainObject(attributes.relations) &&
					isArray(Object.values(attributes.relations))));

		const shouldUpdateRelation = (relation, columnClientId) =>
			relation.uniqueID === oldUniqueID &&
			(!repeaterStatus ||
				!columnClientId ||
				(repeaterStatus &&
					(!firstColumnToModifyClientId ||
						firstColumnToModifyClientId === columnClientId)));

		const getColumnClientId = clientId => {
			const { getBlock, getBlockParentsByBlockName, getBlockName } =
				select('core/block-editor');
			const repeaterColumnClientIds =
				repeaterStatus &&
				repeaterRowClientId &&
				getBlock(repeaterRowClientId).innerBlocks.map(
					block => block.clientId
				);

			return (
				getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				).find(
					parentClientId =>
						repeaterColumnClientIds &&
						repeaterColumnClientIds.includes(parentClientId)
				) ||
				(getBlockName(clientId) === 'maxi-blocks/column-maxi' &&
					clientId)
			);
		};

		const updateRelationsWithNewUniqueID = (relations, clientId) =>
			cloneDeep(relations).map(relation => {
				const columnClientId = getColumnClientId(clientId);
				if (shouldUpdateRelation(relation, columnClientId)) {
					firstColumnToModifyClientId = columnClientId;
					relation.uniqueID = newUniqueID;
				}
				return relation;
			});

		const updateBlockRelations = block => {
			if (!block) return;

			const { attributes = {}, clientId } = block;

			if (!attributesHasRelations(attributes)) return;

			const relations = isArray(attributes.relations)
				? attributes.relations
				: Object.values(attributes.relations);

			const newRelations = updateRelationsWithNewUniqueID(
				relations,
				clientId
			);

			if (!isEqual(relations, newRelations) && clientId) {
				updateBlockAttributesUpdate(
					clientId,
					'relations',
					newRelations
				);

				const storedBlock =
					select('maxiBlocks/blocks').getBlockByClientId(clientId);

				if (!storedBlock) {
					dispatch('maxiBlocks/blocks').addBlockWithUpdatedAttributes(
						clientId
					);
				}
			}
		};

		/**
		 * In case if some of blocks was inserted into repeater (for example on validation),
		 * then we need to check the column as well.
		 */
		const getRepeaterColumnClientId = () => {
			if (!lastChangedBlocks.includes(clientId) || !repeaterStatus) {
				return null;
			}

			const columnInnerBlocksPositions =
				getInnerBlocksPositions()?.[[-1]];

			if (!columnInnerBlocksPositions) {
				return null;
			}

			const parentColumnsClientIds = select(
				'core/block-editor'
			).getBlockParentsByBlockName(clientId, 'maxi-blocks/column-maxi');

			return parentColumnsClientIds.find(columnClientId =>
				columnInnerBlocksPositions.includes(columnClientId)
			);
		};

		[...lastChangedBlocks, getRepeaterColumnClientId()].forEach(
			clientId => {
				const block = select('core/block-editor').getBlock(clientId);
				updateBlockRelations(block);
			}
		);
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
