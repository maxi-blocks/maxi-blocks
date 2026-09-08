import { isEqual } from 'lodash';

const RELATION_STATE_KEY = '__maxiRelationPreviewStateKey';

const SHALLOW_COMPARE_KEYS = [
	'id',
	'uniqueID',
	'action',
	'trigger',
	'target',
	'blockTarget',
	'stylesString',
	'inTransitionString',
	'outTransitionString',
];

const DEEP_COMPARE_KEYS = [
	'sids',
	'effects',
	'attributes',
	'transitionTriggers',
	'transitionTargetsArray',
];

export const getRelationStateKey = (isPreview, staticState) =>
	isPreview ? 'preview' : `static-${staticState}`;

const isRelationInitialized = relation =>
	!!(relation.triggerEl && relation.targetEl);

export const areRelationInstancesEquivalent = (previous, next) => {
	if (!previous || !next) return false;

	// Never reuse an instance whose constructor early-returned before
	// resolving DOM elements — it has no styles, events, or transitions.
	if (!isRelationInitialized(previous)) return false;

	const hasSameShallowValues = SHALLOW_COMPARE_KEYS.every(
		key => previous[key] === next[key]
	);

	if (!hasSameShallowValues) return false;

	return DEEP_COMPARE_KEYS.every(key => isEqual(previous[key], next[key]));
};

const applyRelationState = (relation, isPreview, staticState) => {
	relation.setIsPreview?.(isPreview, { staticState });
	relation[RELATION_STATE_KEY] = getRelationStateKey(isPreview, staticState);
};

const resetPreviousRelations = previousRelationInstances => {
	previousRelationInstances?.forEach(previousRelation => {
		previousRelation.enableStaticStartState?.();
		previousRelation[RELATION_STATE_KEY] = getRelationStateKey(
			false,
			'start'
		);
	});
};

const syncRelationInstances = ({
	previousRelationInstances,
	nextRelationInstances,
	shouldRenderRelations,
	isPreview,
	staticState,
}) => {
	if (!shouldRenderRelations) {
		resetPreviousRelations(previousRelationInstances);

		return {
			relationInstances: null,
			reusedCount: 0,
			appliedCount: 0,
			removedCount: previousRelationInstances?.length || 0,
		};
	}

	const previousRelationsById = new Map(
		(previousRelationInstances || []).map(relation => [
			String(relation.id),
			relation,
		])
	);
	const reusedPreviousRelations = new Set();
	const handledPreviousRelations = new Set();
	const desiredStateKey = getRelationStateKey(isPreview, staticState);
	let reusedCount = 0;
	let appliedCount = 0;
	let removedCount = 0;

	const relationInstances = (nextRelationInstances || []).map(
		nextRelation => {
			const previousRelation = previousRelationsById.get(
				String(nextRelation.id)
			);

			if (
				areRelationInstancesEquivalent(previousRelation, nextRelation)
			) {
				reusedPreviousRelations.add(previousRelation);
				handledPreviousRelations.add(previousRelation);
				reusedCount += 1;

				if (previousRelation[RELATION_STATE_KEY] !== desiredStateKey) {
					applyRelationState(previousRelation, isPreview, staticState);
					appliedCount += 1;
				}

				return previousRelation;
			}

			if (previousRelation) {
				previousRelation.removePreviousStylesAndTransitions?.();
				handledPreviousRelations.add(previousRelation);
				removedCount += 1;
			}
			applyRelationState(nextRelation, isPreview, staticState);
			appliedCount += 1;

			return nextRelation;
		}
	);

	previousRelationInstances?.forEach(previousRelation => {
		if (handledPreviousRelations.has(previousRelation)) return;

		if (!reusedPreviousRelations.has(previousRelation)) {
			const stillPresent = relationInstances.some(
				relation => relation === previousRelation
			);

			if (!stillPresent) {
				previousRelation.removePreviousStylesAndTransitions?.();
				removedCount += 1;
			}
		}
	});

	return {
		relationInstances,
		reusedCount,
		appliedCount,
		removedCount,
	};
};

export default syncRelationInstances;
