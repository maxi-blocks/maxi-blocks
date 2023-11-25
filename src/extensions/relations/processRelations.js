import Relation from './Relation';

export default function processRelations(relations, isEditor = false) {
	if (!relations) return null;

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
