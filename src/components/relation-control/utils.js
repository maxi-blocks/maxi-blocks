import { isEmpty } from 'lodash';

export const getRelationsForDisplay = rawRelations => rawRelations || [];

const getComparableSetting = relation => ({
	action: relation?.action || '',
	sid: relation?.sid || '',
	target: relation?.target || '',
});

const getIsSameSetting = (relation, otherRelation) => {
	const relationSetting = getComparableSetting(relation);
	const otherRelationSetting = getComparableSetting(otherRelation);

	return (
		relationSetting.action === otherRelationSetting.action &&
		relationSetting.sid === otherRelationSetting.sid &&
		relationSetting.target === otherRelationSetting.target
	);
};

export const getRelationsWithChangedTarget = (relations = [], id, change) => {
	const previousRelation = relations.find(relation => relation.id === id);
	const nextRelation = previousRelation
		? { ...previousRelation, ...change }
		: null;
	const isChangingTarget =
		previousRelation?.uniqueID &&
		change?.uniqueID &&
		previousRelation.uniqueID !== change.uniqueID;

	return relations.map(relation => {
		if (relation.id === id) return { ...relation, ...change };

		const shouldSwapDuplicateTarget =
			isChangingTarget &&
			relation.uniqueID === change.uniqueID &&
			getIsSameSetting(relation, nextRelation);

		if (shouldSwapDuplicateTarget) {
			return {
				...relation,
				uniqueID: previousRelation.uniqueID,
			};
		}

		return relation;
	});
};

export const getUnresolvedTargetRelations = (
	relations = [],
	getClientIdFromUniqueId
) =>
	relations.filter(
		relation =>
			relation?.uniqueID &&
			!isEmpty(relation.uniqueID) &&
			!getClientIdFromUniqueId(relation.uniqueID)
	);
