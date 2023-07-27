/**
 * Internal dependencies
 */
import { getUniqueIDByLegacyUniqueID } from './utils';

/**
 * External dependencies
 */
import { isObject, isArray } from 'lodash';

const name = 'uniqueIDs for IB';

const isEligible = () => true;

const isRelationEligible = relation =>
	isObject(relation) &&
	'uniqueID' in relation &&
	!relation.uniqueID.endsWith('-u');

const migrate = newAttributes => {
	const { isFirstOnHierarchy } = newAttributes;
	console.log('isFirstOnHierarchy', isFirstOnHierarchy);
	if (isFirstOnHierarchy) {
		// Function to collect all uniqueID and legacyUniqueID pairs from blocks within the hierarchy
		const collectIDs = (attributes, idPairs = {}) => {
			const { uniqueID, legacyUniqueID, innerBlocks } = attributes;

			if (uniqueID && legacyUniqueID) {
				idPairs[uniqueID] = legacyUniqueID;
			}

			if (isArray(innerBlocks)) {
				innerBlocks.forEach(innerBlockAttributes =>
					collectIDs(innerBlockAttributes, idPairs)
				);
			}

			return idPairs;
		};

		// Collect all uniqueID and legacyUniqueID pairs
		const idPairs = collectIDs(newAttributes);
		console.log('idPairs', idPairs);

		// Function to replace relation.uniqueID with legacyUniqueID in each block's relations
		const replaceRelationIDs = attributes => {
			const { relations, innerBlocks } = attributes;

			if (isArray(relations)) {
				relations.forEach(relation => {
					if (
						isRelationEligible(relation) &&
						idPairs[relation.uniqueID]
					) {
						relation.uniqueID = idPairs[relation.uniqueID];
					}
				});
			}

			if (isArray(innerBlocks)) {
				innerBlocks.forEach(innerBlockAttributes =>
					replaceRelationIDs(innerBlockAttributes)
				);
			}
		};

		// Replace relation.uniqueID with legacyUniqueID in all blocks
		replaceRelationIDs(newAttributes);

		return newAttributes;
	}
};

export default { name, isEligible, migrate };
