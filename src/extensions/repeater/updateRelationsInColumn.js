/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '@extensions/attributes';
import { getBlockColumnClientId, getBlockPosition } from './utils';

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
	innerBlocksPositions,
	validationContext = null
) => {
	if (!attributes.relations) {
		return;
	}

	const { getBlock } = select('core/block-editor');
	const relationInfoCache = validationContext?.relationInfoCache;

	const getRelationInfo = uniqueID => {
		if (!relationInfoCache) {
			return null;
		}

		if (!relationInfoCache.has(uniqueID)) {
			const relationClientId = getClientIdFromUniqueId(uniqueID);
			const relationColumnClientId = getBlockColumnClientId(
				relationClientId,
				innerBlocksPositions
			);
			const blockPosition = getBlockPosition(
				relationClientId,
				innerBlocksPositions
			);

			relationInfoCache.set(uniqueID, {
				relationColumnClientId,
				clientIdsAtPosition:
					blockPosition && innerBlocksPositions?.[blockPosition]
						? innerBlocksPositions[blockPosition]
						: null,
				uniqueIdByColumn: new Map(),
			});
		}

		return relationInfoCache.get(uniqueID);
	};

	attributes.relations = attributes.relations.map(relation => {
		const { uniqueID } = relation;

		if (!uniqueID) {
			return relation;
		}

		const cachedRelationInfo = getRelationInfo(uniqueID);
		const relationColumnClientId =
			cachedRelationInfo?.relationColumnClientId ??
			getBlockColumnClientId(
				getClientIdFromUniqueId(uniqueID),
				innerBlocksPositions
			);

		if (relationColumnClientId !== oldColumnClientId) {
			return relation;
		}

		if (cachedRelationInfo?.uniqueIdByColumn?.has(newColumnClientId)) {
			const mappedUniqueID =
				cachedRelationInfo.uniqueIdByColumn.get(newColumnClientId);

			return mappedUniqueID
				? {
						...relation,
						uniqueID: mappedUniqueID,
				  }
				: relation;
		}

		const clientIdsAtPosition =
			cachedRelationInfo?.clientIdsAtPosition ??
			(() => {
				const relationClientId = getClientIdFromUniqueId(uniqueID);
				const blockPosition = getBlockPosition(
					relationClientId,
					innerBlocksPositions
				);

				return blockPosition && innerBlocksPositions?.[blockPosition]
					? innerBlocksPositions[blockPosition]
					: null;
			})();

		if (!clientIdsAtPosition) {
			return relation;
		}

		const newRelationClientId = clientIdsAtPosition.find(
			clientId =>
				getBlockColumnClientId(clientId, innerBlocksPositions) ===
				newColumnClientId
		);

		const newBlock = getBlock(newRelationClientId);
		const mappedUniqueID = newBlock?.attributes?.uniqueID;

		cachedRelationInfo?.uniqueIdByColumn?.set(
			newColumnClientId,
			mappedUniqueID || null
		);

		return mappedUniqueID
			? {
					...relation,
					uniqueID: mappedUniqueID,
			  }
			: relation;
	});
};

export default updateRelationsInColumn;
