import { cloneDeep, isEmpty, isEqual, merge } from 'lodash';

export const RELATION_GROUP_ID_PREFIX = 'relation-group-';
const LEGACY_RELATION_GROUP_ID_PREFIX = 'relation-legacy-';
const SINGLE_RELATION_ID_PREFIX = 'relation-single-';

export const getRelationId = relations =>
	relations.length ? Math.max(...relations.map(r => r.id || 0)) + 1 : 1;

export const getFallbackRelationGroupId = relation =>
	`${RELATION_GROUP_ID_PREFIX}${relation?.id || 1}`;

export const getRelationControlId = relationGroup => {
	if (!relationGroup) return getFallbackRelationGroupId();
	if (relationGroup.groupId) return relationGroup.groupId;

	return getFallbackRelationGroupId(relationGroup.item);
};

const uniqueValues = values => Array.from(new Set(values.filter(Boolean)));
const getRelationIdSet = relationGroup =>
	new Set(relationGroup.relationIds || []);
const getRelationGroupId = relationGroup =>
	relationGroup.groupId || getFallbackRelationGroupId(relationGroup.item);

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
	const relationIds = getRelationIdSet(relationGroup);
	const groupId = getRelationGroupId(relationGroup);

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

export const mergeRelationStartAttributeUpdates = (...updates) =>
	updates.reduce((acc, update) => merge(acc, cloneDeep(update || {})), {});

export const getChangedRelationTargetUpdates = ({
	uniqueIDs = [],
	cleanValues = {},
	getClientIdFromUniqueId,
	getBlockDataForClientId,
	isEqual: isEqualValue = isEqual,
}) =>
	uniqueIDs
		.map(uid => {
			const clientId = getClientIdFromUniqueId(uid);
			const targetBlockData = getBlockDataForClientId(clientId);
			const attributes = targetBlockData?.attributes;

			if (!clientId || !attributes) return null;

			const hasChanged = Object.keys(cleanValues).some(
				key => !isEqualValue(cleanValues[key], attributes[key])
			);

			return hasChanged
				? {
						clientId,
						cleanValues: cloneDeep(cleanValues),
				  }
				: null;
		})
		.filter(Boolean);

export const removeRelationGroup = (relations, relationGroup) => {
	const relationIds = getRelationIdSet(relationGroup);
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

export const getSyncedRelationPreviewIds = ({
	relationGroup,
	relations = [],
	selectedRelationIds = [],
}) => {
	const selectedRelationIdSet = new Set(
		(selectedRelationIds || []).map(id => String(id))
	);
	const relationIds = getRelationIdSet(relationGroup);

	if (
		!relationGroup?.relationIds?.some(id =>
			selectedRelationIdSet.has(String(id))
		)
	) {
		return selectedRelationIds;
	}

	const groupId = getRelationGroupId(relationGroup);

	return relations
		.filter(
			relation =>
				relation.groupId === groupId ||
				(!relation.groupId && relationIds.has(relation.id))
		)
		.map(relation => relation.id);
};

const RELATION_CONTAINER_BLOCK_NAME = 'maxi-blocks/container-maxi';
const RELATION_COLUMN_BLOCK_NAME = 'maxi-blocks/column-maxi';
const RELATION_REVEAL_CLASS_NAME = 'maxi-block--revealed';
const RELATION_REVEAL_DURATION = 1200;
const relationRevealTimeouts = new WeakMap();
const RELATION_BLOCK_TYPES = {
	'maxi-blocks/button-maxi': { type: 'button', label: 'Button' },
	'maxi-blocks/column-maxi': { type: 'column', label: 'Column' },
	'maxi-blocks/container-maxi': { type: 'container', label: 'Container' },
	'maxi-blocks/group-maxi': { type: 'group', label: 'Group' },
	'maxi-blocks/image-maxi': { type: 'image', label: 'Image' },
	'maxi-blocks/list-item-maxi': { type: 'text', label: 'Text' },
	'maxi-blocks/row-maxi': { type: 'row', label: 'Row' },
	'maxi-blocks/svg-icon-maxi': { type: 'icon', label: 'Icon' },
	'maxi-blocks/text-maxi': { type: 'text', label: 'Text' },
};

const getLastItem = items => items?.[items.length - 1];

const getRelationBlockType = blockName =>
	RELATION_BLOCK_TYPES[blockName] || { type: 'block', label: 'Block' };

const isNonCanvasBlockElement = element =>
	element.closest(
		[
			'.block-editor-list-view-leaf',
			'.block-editor-list-view__block',
			'.maxi-block-select-control',
			'.components-popover',
		].join(',')
	);

const isCanvasBlockElement = element =>
	element.closest(
		[
			'.editor-styles-wrapper',
			'.block-editor-block-list__layout',
			'.edit-post-visual-editor',
			'.editor-visual-editor',
		].join(',')
	);

const getChildElementsByClassName = (element, className) =>
	Array.from(element?.children || []).filter(child =>
		child.classList?.contains(className)
	);

const getHighlightTargetElements = blockElement => {
	const textBlockElements = [
		...(blockElement.classList?.contains('maxi-text-block')
			? [blockElement]
			: []),
		...getChildElementsByClassName(blockElement, 'maxi-text-block'),
	];
	const textContentElements = [
		...getChildElementsByClassName(
			blockElement,
			'maxi-text-block__content'
		),
		...textBlockElements.flatMap(textBlockElement =>
			getChildElementsByClassName(
				textBlockElement,
				'maxi-text-block__content'
			)
		),
	].filter(
		(element, index, allElements) => allElements.indexOf(element) === index
	);

	return textContentElements.length ? textContentElements : [blockElement];
};

export const getHighlightableBlockElements = ({
	clientId,
	searchContexts = [],
}) => {
	if (!clientId) return [];

	const elements = searchContexts
		.filter(Boolean)
		.flatMap(context =>
			Array.from(context.querySelectorAll(`[data-block="${clientId}"]`))
		)
		.filter((element, index, allElements) => {
			if (isNonCanvasBlockElement(element)) return false;
			return allElements.indexOf(element) === index;
		});

	const canvasElements = elements.filter(isCanvasBlockElement);
	const highlightElements = (
		canvasElements.length ? canvasElements : elements
	).flatMap(getHighlightTargetElements);

	return highlightElements.filter(
		(element, index, allElements) => allElements.indexOf(element) === index
	);
};

export const revealRelationBlockElement = (
	blockElement,
	{
		className = RELATION_REVEAL_CLASS_NAME,
		duration = RELATION_REVEAL_DURATION,
		scrollOptions = {
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		},
	} = {}
) => {
	if (!blockElement) return;

	const previousTimeout = relationRevealTimeouts.get(blockElement);
	if (previousTimeout) {
		clearTimeout(previousTimeout);
		relationRevealTimeouts.delete(blockElement);
	}

	blockElement.scrollIntoView?.(scrollOptions);
	blockElement.classList.remove(className);
	blockElement.getBoundingClientRect?.();
	blockElement.classList.add(className);

	const timeoutId = setTimeout(() => {
		blockElement.classList.remove(className);
		relationRevealTimeouts.delete(blockElement);
	}, duration);

	relationRevealTimeouts.set(blockElement, timeoutId);
};

export const getRelationBlockOption = ({
	block,
	currentUniqueID,
	fallbackGroupLabel = 'Canvas',
	getBlockParentsByBlockName,
	getBlock,
}) => {
	const attrs = block?.attributes || {};

	if (!attrs.customLabel || !attrs.uniqueID) return null;

	const containerBlock =
		block.name === RELATION_CONTAINER_BLOCK_NAME
			? block
			: getBlock?.(
					getLastItem(
						getBlockParentsByBlockName?.(
							block.clientId,
							RELATION_CONTAINER_BLOCK_NAME
						) || []
					)
			  );
	const containerLabel =
		containerBlock?.attributes?.customLabel || fallbackGroupLabel;
	const containerValue = containerBlock?.attributes?.uniqueID || '';
	const columnBlock =
		block.name === RELATION_COLUMN_BLOCK_NAME
			? block
			: getBlock?.(
					getLastItem(
						getBlockParentsByBlockName?.(
							block.clientId,
							RELATION_COLUMN_BLOCK_NAME
						) || []
					)
			  );
	const columnLabel = columnBlock?.attributes?.customLabel || '';
	const columnValue = columnBlock?.attributes?.uniqueID || '';
	const blockType = getRelationBlockType(block.name);
	const isCurrentBlock = attrs.uniqueID === currentUniqueID;

	return {
		label: attrs.customLabel,
		value: attrs.uniqueID,
		blockType: blockType.type,
		blockTypeLabel: blockType.label,
		hoverValue: block.clientId,
		groupLabel: containerLabel,
		groupValue: containerValue,
		groupHoverValue: containerBlock?.clientId || '',
		columnLabel,
		columnValue,
		columnHoverValue: columnBlock?.clientId || '',
		isCurrentBlock,
		isCurrentGroup: isCurrentBlock,
		isCurrentColumn: !!columnLabel && isCurrentBlock,
	};
};

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
