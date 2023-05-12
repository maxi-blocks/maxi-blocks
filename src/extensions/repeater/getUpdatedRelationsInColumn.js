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
 * Updates relation trigger(uniqueID) to the same block,
 * but in the new column, if trigger is in the old column.
 *
 * @param {Array<Object>}                 relations
 * @param {string}                        oldClientId
 * @param {string}                        newClientId
 * @param {Object<string, Array<string>>} innerBlocksPositions
 * @returns {Array<Object>}
 */
const getUpdatedRelationsInColumn = (
	relations,
	oldClientId,
	newClientId,
	innerBlocksPositions
) => {
	const { getBlock, getBlockParentsByBlockName } =
		select('core/block-editor');

	const [oldClientIdColumn, newClientIdColumn] = [
		oldClientId,
		newClientId,
	].map(
		clientId =>
			getBlockParentsByBlockName(clientId, 'maxi-blocks/column-maxi')?.[0]
	);

	return relations.map(relation => {
		const { uniqueID } = relation;

		const relationClientId = getClientIdFromUniqueId(uniqueID);
		const relationClientIdColumn = getBlockParentsByBlockName(
			relationClientId,
			'maxi-blocks/column-maxi'
		)?.[0];

		if (relationClientIdColumn !== oldClientIdColumn) {
			return relation;
		}

		const blockPosition = getBlockPosition(
			relationClientId,
			innerBlocksPositions
		);

		const newRelationClientId = innerBlocksPositions[blockPosition].find(
			clientId => {
				const clientIdColumn = getBlockParentsByBlockName(
					clientId,
					'maxi-blocks/column-maxi'
				)?.[0];

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

export default getUpdatedRelationsInColumn;
