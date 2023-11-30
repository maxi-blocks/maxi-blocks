import Relation from './Relation';

export default function processRelations(
	relations,
	isEditor = false,
	relationAction = null,
	relationIndex = null
) {
	if (!relations) return null;

	if (isEditor && relationAction !== null) {
		if (relationIndex !== null) {
			const relation = new Relation(
				relations[relationIndex],
				isEditor,
				relationAction,
				relationIndex
			);

			if (relationAction === 'remove') {
				relation.removePreviousStylesAndTransitions();
			}
			return null;
		}
	}

	if (isEditor) {
		const modifiedRelations = relations.map(relation => {
			const modifiedRelation = {};
			Object.keys(relation).forEach(key => {
				// Exclude specific keys from being converted to arrays
				if (['action', 'uniqueID', 'trigger', 'target'].includes(key)) {
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

		return modifiedRelations.map(
			relation => new Relation(relation, isEditor)
		);
	}

	const uniqueRelations = relations.reduce(
		(uniqueArray, { action, trigger, uniqueID, target }) => {
			const getIsUnique = relation =>
				relation.action === action &&
				relation.trigger === trigger &&
				relation.uniqueID === uniqueID &&
				relation.target === target;

			const isUnique = !uniqueArray.find(uniqueRelation =>
				getIsUnique(uniqueRelation)
			);
			if (isUnique) {
				const sameRelations = relations.filter(sameRelation =>
					getIsUnique(sameRelation)
				);
				const mergedSameRelations = sameRelations.reduce(
					(obj, relation) => {
						Object.keys(relation).forEach(key => {
							if (
								key !== 'action' &&
								key !== 'trigger' &&
								key !== 'uniqueID' &&
								key !== 'target'
							) {
								if (!obj[key]) obj[key] = [];
								obj[key].push(relation[key]);
							} else {
								obj[key] = relation[key];
							}
						});
						return obj;
					},
					{}
				);
				uniqueArray.push(mergedSameRelations);
			}

			return uniqueArray;
		},
		[]
	);

	return uniqueRelations.map(relation => new Relation(relation, isEditor));
}
