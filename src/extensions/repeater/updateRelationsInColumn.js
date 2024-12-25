/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '@extensions/attributes';
import { getBlockPosition } from './utils';

/**
 * Updates attributes.relations. In each item it
 * updates relation trigger(uniqueID) to the same block,
 * but in the new column, if trigger is in the old column.
 *
 * @param {Object<string, any>}      attributes
 * @param {string}                   oldColumnClientId
 * @param {string}                   newColumnClientId
 * @param {Object<string, string[]>} innerBlocksPositions
 */
const updateRelationsInColumn = (
	attributes,
	oldColumnClientId,
	newColumnClientId,
	innerBlocksPositions
) => {
	if (!attributes.relations) {
		return;
	}

	const { getBlock, getBlockParentsByBlockName } =
		select('core/block-editor');

	attributes.relations = attributes.relations.map(relation => {
		const { uniqueID } = relation;

		if (!uniqueID) {
			return relation;
		}

		const relationClientId = getClientIdFromUniqueId(uniqueID);

		if (
			relationClientId !== oldColumnClientId &&
			!getBlockParentsByBlockName(
				relationClientId,
				'maxi-blocks/column-maxi'
			).includes(oldColumnClientId)
		) {
			return relation;
		}

		const blockPosition = getBlockPosition(
			relationClientId,
			innerBlocksPositions
		);

		if (!blockPosition || !innerBlocksPositions?.[blockPosition]) {
			return relation;
		}

		const newRelationClientId = innerBlocksPositions[blockPosition].find(
			clientId =>
				getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				).includes(newColumnClientId)
		);

		const newBlock = getBlock(newRelationClientId);

		return {
			...relation,
			uniqueID: newBlock?.attributes?.uniqueID,
		};
	});
};

export default updateRelationsInColumn;
