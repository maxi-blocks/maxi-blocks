import { cloneDeep, isEmpty } from 'lodash';

export const RELATION_GROUP_ID_PREFIX = 'relation-group-';
const LEGACY_RELATION_GROUP_ID_PREFIX = 'relation-legacy-';
const SINGLE_RELATION_ID_PREFIX = 'relation-single-';

export const getRelationId = relations =>
	relations.length ? Math.max(...relations.map(r => r.id || 0)) + 1 : 1;

export const getFallbackRelationGroupId = relation =>
	`${RELATION_GROUP_ID_PREFIX}${relation?.id || 1}`;

const uniqueValues = values => Array.from(new Set(values.filter(Boolean)));

const getStableValue = value => {
	if (Array.isArray(value)) return value.map(getStableValue);

	if (value && typeof value === 'object') {
		return Object.keys(value)
			.sort()
			.reduce((acc, key) => {
				acc[key] = getStableValue(value[key]);
				return acc;
			}, {});
	}

	return value;
};

const hashString = value => {
	let hash = 0;

	for (let i = 0; i < value.length; i += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}

	return Math.abs(hash).toString(36);
};

const getLegacyRelationGroupKey = relation => {
	if (
		relation.groupId ||
		!relation.uniqueID ||
		!relation.action ||
		!relation.sid
	) {
		return null;
	}

	const signature = JSON.stringify(
		getStableValue({
			target: relation.target || '',
			action: relation.action || '',
			sid: relation.sid || '',
			isButton: !!relation.isButton,
		})
	);

	return `${LEGACY_RELATION_GROUP_ID_PREFIX}${hashString(signature)}`;
};

export const groupRelations = (relations = []) => {
	const groups = [];
	const groupIndexes = new Map();
	const legacyGroupCounts = relations.reduce((acc, relation) => {
		const legacyGroupKey = getLegacyRelationGroupKey(relation);
		if (legacyGroupKey) {
			acc.set(legacyGroupKey, (acc.get(legacyGroupKey) || 0) + 1);
		}
		return acc;
	}, new Map());

	relations.forEach(relation => {
		const groupId = relation.groupId || null;
		const legacyGroupKey = getLegacyRelationGroupKey(relation);
		const id =
			groupId ||
			(legacyGroupKey && legacyGroupCounts.get(legacyGroupKey) > 1
				? legacyGroupKey
				: `${SINGLE_RELATION_ID_PREFIX}${relation.id}`);

		if (!groupIndexes.has(id)) {
			groupIndexes.set(id, groups.length);
			groups.push({
				id,
				groupId,
				relations: [],
				relationIds: [],
				uniqueIDs: [],
				item: relation,
			});
		}

		const group = groups[groupIndexes.get(id)];
		group.relations.push(relation);
		group.relationIds.push(relation.id);
		if (relation.uniqueID) group.uniqueIDs.push(relation.uniqueID);
	});

	let legacyGroupTitleIndex = 0;

	return groups.map(group => {
		const isLegacyGroup =
			group.id.startsWith(LEGACY_RELATION_GROUP_ID_PREFIX) &&
			group.relations.length > 1;

		if (isLegacyGroup) legacyGroupTitleIndex += 1;

		return {
			...group,
			title: isLegacyGroup
				? `Group ${legacyGroupTitleIndex}`
				: group.title,
			uniqueIDs: uniqueValues(group.uniqueIDs),
		};
	});
};

export const createEmptyRelation = ({ id, groupId, isButton }) => ({
	id,
	groupId,
	title: '',
	uniqueID: '',
	target: '',
	action: '',
	sid: '',
	attributes: {},
	css: {},
	effects: {},
	isButton,
});

export const updateRelationsInGroup = (relations, relationGroup, updates) => {
	const relationIds = new Set(relationGroup.relationIds);
	const groupId =
		relationGroup.groupId || getFallbackRelationGroupId(relationGroup.item);

	return cloneDeep(relations).map(relation => {
		if (!relationIds.has(relation.id)) return relation;

		const nextUpdates =
			typeof updates === 'function' ? updates(relation) : updates;

		return {
			...relation,
			groupId,
			...nextUpdates,
		};
	});
};

export const removeRelationGroup = (relations, relationGroup) => {
	const relationIds = new Set(relationGroup.relationIds);
	return relations.filter(relation => !relationIds.has(relation.id));
};

export const getRelationStaticStateUpdate = ({
	relationGroup,
	state,
	isPreviewActive = false,
}) => ({
	...(isPreviewActive ? { 'relations-preview': false } : {}),
	'relations-preview-state': state,
	'relations-preview-relation-ids': relationGroup.relationIds,
});

export const syncRelationGroupTargets = ({
	relations,
	relationGroup,
	uniqueIDs,
	isButton,
	normalizeRelation = relation => relation,
}) => {
	const relationIds = new Set(relationGroup.relationIds);
	const selectedUniqueIDs = uniqueValues(uniqueIDs);
	const groupId =
		relationGroup.groupId || getFallbackRelationGroupId(relationGroup.item);
	const groupRelationsByUniqueID = new Map(
		relationGroup.relations
			.filter(relation => relation.uniqueID)
			.map(relation => [relation.uniqueID, relation])
	);
	const blankRelation = relationGroup.relations.find(relation =>
		isEmpty(relation.uniqueID)
	);
	const baseRelation =
		relationGroup.item ||
		createEmptyRelation({
			id: getRelationId(relations),
			groupId,
			isButton,
		});
	let nextId = getRelationId(relations);
	let blankRelationUsed = false;

	const createRelationForUniqueID = uniqueID => {
		const existingRelation = groupRelationsByUniqueID.get(uniqueID);

		if (existingRelation) {
			return normalizeRelation({
				...cloneDeep(existingRelation),
				groupId,
			});
		}

		const relationToReuse =
			blankRelation && !blankRelationUsed ? blankRelation : null;
		if (relationToReuse) blankRelationUsed = true;

		const relation = {
			...cloneDeep(relationToReuse || baseRelation),
			id: relationToReuse ? relationToReuse.id : nextId++,
			groupId,
			uniqueID,
		};

		return normalizeRelation(relation);
	};

	const nextGroupRelations = selectedUniqueIDs.length
		? selectedUniqueIDs.map(createRelationForUniqueID)
		: [
				normalizeRelation({
					...cloneDeep(blankRelation || baseRelation),
					groupId,
					uniqueID: '',
					target: '',
					sid: '',
					attributes: {},
					css: {},
				}),
		  ];

	const nextRelations = [];
	let insertedGroup = false;

	relations.forEach(relation => {
		if (!relationIds.has(relation.id)) {
			nextRelations.push(relation);
			return;
		}

		if (!insertedGroup) {
			nextRelations.push(...nextGroupRelations);
			insertedGroup = true;
		}
	});

	if (!insertedGroup) nextRelations.push(...nextGroupRelations);

	return nextRelations;
};

const flattenIBSettings = options =>
	Object.entries(options || {}).reduce((acc, [groupLabel, groupOptions]) => {
		(groupOptions || []).forEach(option => {
			if (option?.sid) {
				acc.set(option.sid, {
					...option,
					groupLabel,
				});
			}
		});

		return acc;
	}, new Map());

export const getCommonIBSettings = optionsList => {
	const validOptionsList = (optionsList || []).filter(
		options => options && Object.keys(options).length
	);

	if (validOptionsList.length === 0) return {};
	if (validOptionsList.length === 1) return validOptionsList[0];

	const optionMaps = validOptionsList.map(flattenIBSettings);
	const commonSids = new Set(optionMaps[0].keys());

	optionMaps.slice(1).forEach(optionMap => {
		Array.from(commonSids).forEach(sid => {
			if (!optionMap.has(sid)) commonSids.delete(sid);
		});
	});

	return Object.entries(validOptionsList[0]).reduce(
		(acc, [groupLabel, groupOptions]) => {
			const commonOptions = (groupOptions || []).filter(option =>
				commonSids.has(option.sid)
			);

			if (commonOptions.length) acc[groupLabel] = commonOptions;

			return acc;
		},
		{}
	);
};
