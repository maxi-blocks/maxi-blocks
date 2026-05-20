import {
	getCommonIBSettings,
	getRelationId,
	getRelationStaticStateUpdate,
	groupRelations,
	removeRelationGroup,
	syncRelationGroupTargets,
	updateRelationsInGroup,
} from '../utils';

describe('relation-control utils', () => {
	const baseRelation = {
		id: 1,
		title: 'Fade items',
		uniqueID: 'target-a',
		action: 'hover',
		sid: 'bg',
		attributes: { 'background-status-hover': true },
		css: { general: { styles: { color: 'red' } } },
		effects: { 'transition-status-general': true },
		isButton: false,
	};

	it('groups legacy single relations and grouped relations', () => {
		const relations = [
			baseRelation,
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-10',
			},
			{
				...baseRelation,
				id: 3,
				uniqueID: 'target-c',
				groupId: 'relation-group-10',
			},
		];

		const groups = groupRelations(relations);

		expect(groups).toHaveLength(2);
		expect(groups[0]).toMatchObject({
			id: 'relation-single-1',
			groupId: null,
			uniqueIDs: ['target-a'],
		});
		expect(groups[1]).toMatchObject({
			id: 'relation-group-10',
			groupId: 'relation-group-10',
			uniqueIDs: ['target-b', 'target-c'],
		});
	});

	it('groups matching legacy relations without groupId', () => {
		const relations = [
			baseRelation,
			{
				...baseRelation,
				id: 2,
				title: 'Same behavior on another block',
				uniqueID: 'target-b',
			},
			{
				...baseRelation,
				id: 3,
				uniqueID: 'target-c',
				sid: 'border',
			},
		];

		const groups = groupRelations(relations);

		expect(groups).toHaveLength(2);
		expect(groups[0].id).toMatch(/^relation-legacy-/);
		expect(groups[0]).toMatchObject({
			groupId: null,
			relationIds: [1, 2],
			uniqueIDs: ['target-a', 'target-b'],
		});
		expect(groups[1]).toMatchObject({
			id: 'relation-single-3',
			uniqueIDs: ['target-c'],
		});
	});

	it('groups legacy pattern rows by interaction type and gives generated group titles', () => {
		const relations = [
			{
				...baseRelation,
				id: 1,
				title: 'Linkedin',
				target: 'button',
				sid: 'opacity',
				attributes: { 'opacity-general': 0.6 },
				effects: { 'transition-duration-general': 0.2 },
			},
			{
				...baseRelation,
				id: 2,
				title: 'Facebook',
				uniqueID: 'target-b',
				target: 'button',
				sid: 'opacity',
				attributes: { 'opacity-general': 0.3 },
				effects: { 'transition-duration-general': 0.4 },
			},
			{
				...baseRelation,
				id: 3,
				title: 'Instagram transform',
				uniqueID: 'target-c',
				target: 'button',
				sid: 'transform',
				attributes: { 'transform-scale-general': 1.2 },
			},
		];

		const groups = groupRelations(relations);

		expect(groups).toHaveLength(2);
		expect(groups[0]).toMatchObject({
			title: 'Group 1',
			relationIds: [1, 2],
			uniqueIDs: ['target-a', 'target-b'],
		});
		expect(groups[1]).toMatchObject({
			id: 'relation-single-3',
			uniqueIDs: ['target-c'],
		});
	});

	it('adds multiple targets to a relation group while preserving unrelated relations', () => {
		const unrelated = {
			...baseRelation,
			id: 9,
			uniqueID: 'other',
			sid: 'border',
		};
		const relations = [baseRelation, unrelated];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-a', 'target-b', 'target-c'],
			isButton: false,
		});

		expect(nextRelations).toHaveLength(4);
		expect(nextRelations[0]).toMatchObject({
			id: 1,
			uniqueID: 'target-a',
			groupId: 'relation-group-1',
		});
		expect(nextRelations[1]).toMatchObject({
			id: 10,
			uniqueID: 'target-b',
			groupId: 'relation-group-1',
		});
		expect(nextRelations[2]).toMatchObject({
			id: 11,
			uniqueID: 'target-c',
			groupId: 'relation-group-1',
		});
		expect(nextRelations[3]).toEqual(unrelated);
	});

	it('removes deselected targets from a group', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
			{
				...baseRelation,
				id: 3,
				uniqueID: 'target-c',
				groupId: 'relation-group-1',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-a', 'target-c'],
			isButton: false,
		});

		expect(nextRelations.map(relation => relation.uniqueID)).toEqual([
			'target-a',
			'target-c',
		]);
		expect(nextRelations.map(relation => relation.id)).toEqual([1, 3]);
	});

	it('propagates updates across all relations in a group', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = updateRelationsInGroup(relations, group, {
			action: 'click',
			effects: { 'transition-duration-general': 0.5 },
		});

		expect(nextRelations).toEqual([
			expect.objectContaining({
				id: 1,
				action: 'click',
				effects: { 'transition-duration-general': 0.5 },
			}),
			expect.objectContaining({
				id: 2,
				action: 'click',
				effects: { 'transition-duration-general': 0.5 },
			}),
		]);
	});

	it('preserves unique relation IDs and a stable groupId when targets change', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-7' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-7',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-b', 'target-c'],
			isButton: false,
		});

		expect(nextRelations).toEqual([
			expect.objectContaining({
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-7',
			}),
			expect.objectContaining({
				id: 3,
				uniqueID: 'target-c',
				groupId: 'relation-group-7',
			}),
		]);
	});

	it('keeps one empty relation when every target is deselected', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: [],
			isButton: false,
		});

		expect(nextRelations).toEqual([
			expect.objectContaining({
				id: 1,
				uniqueID: '',
				groupId: 'relation-group-1',
			}),
		]);
	});

	it('removes every relation in a group', () => {
		const unrelated = { ...baseRelation, id: 4, uniqueID: 'other' };
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
			unrelated,
		];
		const [group] = groupRelations(relations);

		expect(removeRelationGroup(relations, group)).toEqual([unrelated]);
	});

	it('returns the next relation id', () => {
		expect(getRelationId([{ id: 3 }, { id: 7 }])).toBe(8);
		expect(getRelationId([])).toBe(1);
	});

	it('returns only settings shared by every selected target', () => {
		const firstOptions = {
			style: [
				{ sid: 'bg', label: 'Background' },
				{ sid: 'border', label: 'Border' },
			],
			content: [{ sid: 'typography', label: 'Typography' }],
		};
		const secondOptions = {
			style: [
				{ sid: 'bg', label: 'Background' },
				{ sid: 'shadow', label: 'Shadow' },
			],
			content: [{ sid: 'typography', label: 'Typography' }],
		};

		expect(getCommonIBSettings([firstOptions, secondOptions])).toEqual({
			style: [{ sid: 'bg', label: 'Background' }],
			content: [{ sid: 'typography', label: 'Typography' }],
		});
	});

	it('builds a static end-state update for the selected relation group', () => {
		const relationGroup = {
			relationIds: [1, 3],
		};

		expect(
			getRelationStaticStateUpdate({
				relationGroup,
				state: 'end',
				isPreviewActive: true,
			})
		).toEqual({
			'relations-preview': false,
			'relations-preview-state': 'end',
			'relations-preview-relation-ids': [1, 3],
		});
	});

	it('builds a static start-state update without changing preview when it is already off', () => {
		const relationGroup = {
			relationIds: [2],
		};

		expect(
			getRelationStaticStateUpdate({
				relationGroup,
				state: 'start',
				isPreviewActive: false,
			})
		).toEqual({
			'relations-preview-state': 'start',
			'relations-preview-relation-ids': [2],
		});
	});
});
