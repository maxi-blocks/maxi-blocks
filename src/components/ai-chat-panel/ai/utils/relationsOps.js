import createTransitionObj from '@extensions/styles/transitions/createTransitionObj';

const normalizeRelationsArray = raw => {
	if (Array.isArray(raw)) return raw;
	if (raw && typeof raw === 'object') return Object.values(raw);
	return [];
};

const mergeRelationLike = (base, patch) => {
	if (!patch || typeof patch !== 'object') return base;
	const next = { ...base, ...patch };
	if (patch.attributes && typeof patch.attributes === 'object') {
		next.attributes = { ...(base.attributes || {}), ...patch.attributes };
	}
	if (patch.css && typeof patch.css === 'object') {
		next.css = { ...(base.css || {}), ...patch.css };
	}
	if (patch.effects && typeof patch.effects === 'object') {
		next.effects = { ...(base.effects || {}), ...patch.effects };
	}
	return next;
};

const getNextRelationId = relations =>
	relations.length ? Math.max(...relations.map(rel => Number(rel?.id) || 0)) + 1 : 1;

export const ensureRelationDefaults = (relation, { isButtonDefault } = {}) => {
	const safeRelation = relation && typeof relation === 'object' ? relation : {};
	return {
		id: safeRelation.id,
		title: safeRelation.title ?? '',
		uniqueID: safeRelation.uniqueID ?? '',
		target: safeRelation.target ?? '',
		action: safeRelation.action ?? '',
		sid: safeRelation.sid ?? '',
		attributes:
			safeRelation.attributes && typeof safeRelation.attributes === 'object'
				? safeRelation.attributes
				: {},
		css: safeRelation.css && typeof safeRelation.css === 'object' ? safeRelation.css : {},
		effects:
			safeRelation.effects && typeof safeRelation.effects === 'object'
				? safeRelation.effects
				: createTransitionObj(),
		isButton:
			typeof safeRelation.isButton === 'boolean'
				? safeRelation.isButton
				: Boolean(isButtonDefault),
	};
};

export const applyRelationsOps = (currentRelations, ops, { isButtonDefault } = {}) => {
	const normalizedOps = Array.isArray(ops) ? ops : [];
	const touchedIds = new Set();
	let relations = normalizeRelationsArray(currentRelations).map(rel =>
		ensureRelationDefaults(rel, { isButtonDefault })
	);
	let nextId = getNextRelationId(relations);

	normalizedOps.forEach(rawOp => {
		const op = rawOp?.op;
		if (op === 'clear') {
			relations = [];
			touchedIds.clear();
			nextId = 1;
			return;
		}

		if (op === 'remove') {
			const id = Number(rawOp?.id);
			if (!Number.isFinite(id)) return;
			relations = relations.filter(relation => Number(relation.id) !== id);
			touchedIds.add(id);
			return;
		}

		if (op === 'add') {
			const base = ensureRelationDefaults(
				{
					id: nextId,
					isButton: isButtonDefault,
					attributes: {},
					css: {},
					effects: createTransitionObj(),
				},
				{ isButtonDefault }
			);
			nextId += 1;
			const merged = mergeRelationLike(base, rawOp?.relation);
			relations = [...relations, merged];
			touchedIds.add(merged.id);
			return;
		}

		if (op === 'update') {
			const id = Number(rawOp?.id);
			if (!Number.isFinite(id)) return;
			const index = relations.findIndex(relation => Number(relation.id) === id);
			if (index === -1) return;
			relations[index] = mergeRelationLike(relations[index], rawOp?.patch);
			touchedIds.add(id);
		}
	});

	return { relations, touchedIds };
};

export default {
	applyRelationsOps,
	ensureRelationDefaults,
};
