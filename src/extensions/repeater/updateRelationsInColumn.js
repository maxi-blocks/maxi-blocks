/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getClientIdFromUniqueId } from '@extensions/attributes';
import {
	addRepeaterPerfCount,
	measureRepeaterPerf,
	startRepeaterPerfBucket,
} from './perf';
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
	const perfSession = validationContext?.perfSession;

	if (!attributes.relations) {
		addRepeaterPerfCount(
			perfSession,
			'updateRelationsInColumn.skippedNoRelations',
			1
		);
		return;
	}

	addRepeaterPerfCount(perfSession, 'updateRelationsInColumn.calls', 1);

	measureRepeaterPerf(perfSession, 'updateRelationsInColumn.total', () => {
		const { getBlock } = select('core/block-editor');
		const relationInfoCache = validationContext?.relationInfoCache;

		const getRelationInfo = uniqueID => {
			if (!relationInfoCache) {
				return null;
			}

			if (!relationInfoCache.has(uniqueID)) {
				addRepeaterPerfCount(
					perfSession,
					'updateRelationsInColumn.cacheMisses',
					1
				);
				const stopCacheMissLookup = startRepeaterPerfBucket(
					perfSession,
					'updateRelationsInColumn.cacheMissLookup'
				);
				const relationClientId = getClientIdFromUniqueId(uniqueID);
				const relationColumnClientId = getBlockColumnClientId(
					relationClientId,
					innerBlocksPositions
				);
				const blockPosition = getBlockPosition(
					relationClientId,
					innerBlocksPositions
				);
				stopCacheMissLookup();

				relationInfoCache.set(uniqueID, {
					relationColumnClientId,
					clientIdsAtPosition:
						blockPosition && innerBlocksPositions?.[blockPosition]
							? innerBlocksPositions[blockPosition]
							: null,
					uniqueIdByColumn: new Map(),
				});
			} else {
				addRepeaterPerfCount(
					perfSession,
					'updateRelationsInColumn.cacheHits',
					1
				);
			}

			return relationInfoCache.get(uniqueID);
		};

		attributes.relations = attributes.relations.map(relation => {
			addRepeaterPerfCount(
				perfSession,
				'updateRelationsInColumn.relations',
				1
			);
			const { uniqueID } = relation;

			if (!uniqueID) {
				return relation;
			}

			const cachedRelationInfo = getRelationInfo(uniqueID);
			const stopLookupRelationColumn = startRepeaterPerfBucket(
				perfSession,
				'updateRelationsInColumn.lookupRelationColumn'
			);
			const relationColumnClientId =
				cachedRelationInfo?.relationColumnClientId ??
				getBlockColumnClientId(
					getClientIdFromUniqueId(uniqueID),
					innerBlocksPositions
				);
			stopLookupRelationColumn();

			if (relationColumnClientId !== oldColumnClientId) {
				return relation;
			}

			if (cachedRelationInfo?.uniqueIdByColumn?.has(newColumnClientId)) {
				addRepeaterPerfCount(
					perfSession,
					'updateRelationsInColumn.columnMapCacheHits',
					1
				);
				const mappedUniqueID =
					cachedRelationInfo.uniqueIdByColumn.get(newColumnClientId);

				if (mappedUniqueID) {
					addRepeaterPerfCount(
						perfSession,
						'updateRelationsInColumn.mappedRelations',
						1
					);
				}

				return mappedUniqueID
					? {
							...relation,
							uniqueID: mappedUniqueID,
					  }
					: relation;
			}

			const stopResolveMappedTarget = startRepeaterPerfBucket(
				perfSession,
				'updateRelationsInColumn.resolveMappedTarget'
			);
			const clientIdsAtPosition =
				cachedRelationInfo?.clientIdsAtPosition ??
				(() => {
					const relationClientId = getClientIdFromUniqueId(uniqueID);
					const blockPosition = getBlockPosition(
						relationClientId,
						innerBlocksPositions
					);

					return blockPosition &&
						innerBlocksPositions?.[blockPosition]
						? innerBlocksPositions[blockPosition]
						: null;
				})();

			if (!clientIdsAtPosition) {
				stopResolveMappedTarget();
				return relation;
			}

			const newRelationClientId = clientIdsAtPosition.find(
				clientId =>
					getBlockColumnClientId(clientId, innerBlocksPositions) ===
					newColumnClientId
			);

			const newBlock = getBlock(newRelationClientId);
			const mappedUniqueID = newBlock?.attributes?.uniqueID;
			stopResolveMappedTarget();

			cachedRelationInfo?.uniqueIdByColumn?.set(
				newColumnClientId,
				mappedUniqueID || null
			);

			if (mappedUniqueID) {
				addRepeaterPerfCount(
					perfSession,
					'updateRelationsInColumn.mappedRelations',
					1
				);
			}

			return mappedUniqueID
				? {
						...relation,
						uniqueID: mappedUniqueID,
				  }
				: relation;
		});
	});
};

export default updateRelationsInColumn;
