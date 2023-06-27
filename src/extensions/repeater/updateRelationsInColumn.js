/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '../attributes';
import { getBlockPosition } from './utils';

/**
 * Updates attributes.relations. In each item it
 * updates relation trigger(uniqueID) to the same block,
 * but in the new column, if trigger is in the old column.
 *
 * @param {Object<string, any>}      attributes
 * @param {string}                   oldClientId
 * @param {string}                   newClientId
 * @param {Object<string, string[]>} innerBlocksPositions
 */
const updateRelationsInColumn = (
	attributes,
	oldClientId,
	newClientId,
	innerBlocksPositions
) => {
	if (!attributes.relations) {
		return;
	}

	const { getBlock, getBlockParentsByBlockName } =
		select('core/block-editor');

	const [oldClientIdColumn, newClientIdColumn] = [
		oldClientId,
		newClientId,
	].map(
		clientId =>
			getBlockParentsByBlockName(
				clientId,
				'maxi-blocks/column-maxi'
			)[0] ||
			(getBlock(clientId)?.name === 'maxi-blocks/column-maxi' && clientId)
	);

	attributes.relations = attributes.relations.map(relation => {
		const { uniqueID } = relation;

		if (!uniqueID) {
			return relation;
		}

		const relationClientId = getClientIdFromUniqueId(uniqueID);
		const relationClientIdColumn =
			getBlockParentsByBlockName(
				relationClientId,
				'maxi-blocks/column-maxi'
			)[0] ||
			(uniqueID.includes('column-maxi') && relationClientId);

		if (
			!relationClientIdColumn ||
			relationClientIdColumn !== oldClientIdColumn
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
			clientId => {
				const clientIdColumn = getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				)[0];

				return clientIdColumn === newClientIdColumn;
			}
		);

		const newBlock = getBlock(newRelationClientId);

		return {
			...relation,
			uniqueID: newBlock.attributes.uniqueID,
		};
	});
};

export default updateRelationsInColumn;
