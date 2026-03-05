import { applyRelationsOps } from '../ai/utils/relationsOps';

describe('relations ops', () => {
	test('adds relations with incremental ids and defaults', () => {
		const { relations, touchedIds } = applyRelationsOps(
			[],
			[
				{
					op: 'add',
					relation: {
						title: 'Hover fade',
						action: 'hover',
						sid: 'o',
						uniqueID: 'test-target',
						attributes: { 'opacity-general': 0.6 },
					},
				},
			],
			{ isButtonDefault: false }
		);

		expect(relations).toHaveLength(1);
		expect(relations[0].id).toBe(1);
		expect(relations[0].title).toBe('Hover fade');
		expect(relations[0].effects).toHaveProperty('transition-duration-general');
		expect(touchedIds.has(1)).toBe(true);
	});

	test('updates relations by id and merges attributes', () => {
		const start = [
			{
				id: 7,
				title: 'Old',
				uniqueID: 'u1',
				action: 'hover',
				sid: 'o',
				attributes: { 'opacity-general': 1 },
				css: {},
				effects: {},
				isButton: false,
			},
		];

		const { relations, touchedIds } = applyRelationsOps(
			start,
			[
				{
					op: 'update',
					id: 7,
					patch: {
						title: 'New',
						attributes: { 'opacity-general': 0.4 },
					},
				},
			],
			{ isButtonDefault: false }
		);

		expect(relations).toHaveLength(1);
		expect(relations[0].id).toBe(7);
		expect(relations[0].title).toBe('New');
		expect(relations[0].attributes).toEqual({ 'opacity-general': 0.4 });
		expect(touchedIds.has(7)).toBe(true);
	});

	test('removes relations by id', () => {
		const start = [
			{ id: 1, title: 'A', attributes: {}, css: {}, effects: {}, isButton: false },
			{ id: 2, title: 'B', attributes: {}, css: {}, effects: {}, isButton: false },
		];

		const { relations, touchedIds } = applyRelationsOps(
			start,
			[{ op: 'remove', id: 1 }],
			{ isButtonDefault: false }
		);

		expect(relations).toHaveLength(1);
		expect(relations[0].id).toBe(2);
		expect(touchedIds.has(1)).toBe(true);
	});

	test('clears relations', () => {
		const start = [
			{ id: 1, title: 'A', attributes: {}, css: {}, effects: {}, isButton: false },
		];

		const { relations } = applyRelationsOps(
			start,
			[{ op: 'clear' }],
			{ isButtonDefault: false }
		);

		expect(relations).toEqual([]);
	});
});

