import Relation from './Relation';

/**
 * Helper to get uniqueIDs array from a relation
 * Supports both legacy single uniqueID and new uniqueIDs array format
 */
const getUniqueIDsFromRelation = relation => {
	if (
		relation.uniqueIDs &&
		Array.isArray(relation.uniqueIDs) &&
		relation.uniqueIDs.length > 0
	) {
		return relation.uniqueIDs;
	}
	if (relation.uniqueID) {
		return [relation.uniqueID];
	}
	return [];
};

export default function processRelations(
	relations,
	relationAction = null,
	relationIndex = null
) {
	if (!relations) return null;

	// Expand relations with multiple uniqueIDs into separate relation objects
	const expandedRelations = [];
	relations.forEach(relation => {
		const uniqueIDs = getUniqueIDsFromRelation(relation);
		if (uniqueIDs.length === 0) {
			// Keep relation with no blocks for editor display
			expandedRelations.push(relation);
		} else {
			// Create a separate relation for each target block
			uniqueIDs.forEach(uniqueID => {
				expandedRelations.push({
					...relation,
					uniqueID, // Set single uniqueID for Relation class compatibility
				});
			});
		}
	});

	const modifiedRelations = expandedRelations.map(relation => {
		const modifiedRelation = {};
		Object.keys(relation).forEach(key => {
			// Exclude specific keys from being converted to arrays
			if (
				['action', 'uniqueID', 'uniqueIDs', 'trigger', 'target', 'id', 'beforeAttributes', 'beforeCss'].includes(
					key
				)
			) {
				modifiedRelation[key] = relation[key];
			} else {
				// Convert other properties to an array, if they're not already one
				modifiedRelation[key] = Array.isArray(relation[key])
					? relation[key]
					: [relation[key]];
			}
		});
		return modifiedRelation;
	});

	if (relationAction !== null) {
		if (relationIndex !== null) {
			const removingRelation = modifiedRelations.find(
				relation => relation.id === relationIndex
			);
			const relation = new Relation(
				removingRelation,
				relationAction,
				relationIndex
			);

			if (relationAction === 'remove') {
				relation.removePreviousStylesAndTransitions();
			}
			return null;
		}
	}

	return modifiedRelations.map(relation => new Relation(relation));
}

