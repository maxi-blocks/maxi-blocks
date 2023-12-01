import Relation from './Relation';

export default function processRelations(
	relations,
	relationAction = null,
	relationIndex = null
) {
	if (!relations) return null;

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

	console.log('Relations:');
	console.log(modifiedRelations);

	if (relationAction !== null) {
		if (relationIndex !== null) {
			console.log(
				`Processing removal of relation ${relationIndex} with action ${relationAction}`
			);
			const removingRelation = modifiedRelations.find(
				relation => relation.id === relationIndex
			);
			const relation = new Relation(
				removingRelation,
				relationAction,
				relationIndex
			);

			if (relationAction === 'remove') {
				console.log('Removing relation');
				relation.removePreviousStylesAndTransitions();
			}
			return null;
		}
	}

	return modifiedRelations.map(relation => new Relation(relation));
}
