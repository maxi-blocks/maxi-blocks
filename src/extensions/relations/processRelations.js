import Relation from './Relation';

export default function processRelations(
	relations,
	relationAction = null,
	relationIndex = null
) {
	if (!relations) return null;

	if (relationAction !== null) {
		if (relationIndex !== null) {
			const relation = new Relation(
				relations[relationIndex],
				relationAction,
				relationIndex
			);

			if (relationAction === 'remove') {
				relation.removePreviousStylesAndTransitions();
			}
			return null;
		}
	}

	const modifiedRelations = relations.map(relation => {
		const modifiedRelation = {};
		Object.keys(relation).forEach(key => {
			// Exclude specific keys from being converted to arrays
			if (
				['action', 'uniqueID', 'trigger', 'target', 'id'].includes(key)
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

	return modifiedRelations.map(relation => new Relation(relation));
}
