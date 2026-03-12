jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

import { select } from '@wordpress/data';
import retrieveInnerBlocksPositions from '@extensions/repeater/retrieveInnerBlocksPositions';
import {
	getBlockColumnClientId,
	getBlockPosition,
} from '@extensions/repeater/utils';

describe('retrieveInnerBlocksPositions', () => {
	const blocksById = {
		'col-1': {
			clientId: 'col-1',
			innerBlocks: [
				{
					clientId: 'text-1',
					innerBlocks: [],
				},
				{
					clientId: 'group-1',
					innerBlocks: [
						{
							clientId: 'button-1',
							innerBlocks: [],
						},
					],
				},
			],
		},
		'col-2': {
			clientId: 'col-2',
			innerBlocks: [
				{
					clientId: 'text-2',
					innerBlocks: [],
				},
				{
					clientId: 'group-2',
					innerBlocks: [
						{
							clientId: 'button-2',
							innerBlocks: [],
						},
					],
				},
			],
		},
	};

	beforeEach(() => {
		select.mockImplementation(storeName => {
			if (storeName === 'core/block-editor') {
				return {
					getBlock: jest.fn(clientId => blocksById[clientId]),
				};
			}

			return {};
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('builds position groups and fast lookup maps in one pass', () => {
		const innerBlocksPositions = retrieveInnerBlocksPositions([
			'col-1',
			'col-2',
		]);

		expect(innerBlocksPositions[[-1]]).toEqual(['col-1', 'col-2']);
		expect(innerBlocksPositions['0']).toEqual(['text-1', 'text-2']);
		expect(innerBlocksPositions['1']).toEqual(['group-1', 'group-2']);
		expect(innerBlocksPositions['1,0']).toEqual(['button-1', 'button-2']);

		expect(getBlockPosition('button-2', innerBlocksPositions)).toEqual([
			1, 0,
		]);
		expect(getBlockPosition('col-1', innerBlocksPositions)).toEqual([-1]);

		expect(getBlockColumnClientId('button-2', innerBlocksPositions)).toBe(
			'col-2'
		);
		expect(getBlockColumnClientId('col-1', innerBlocksPositions)).toBe(
			'col-1'
		);
	});

	it('keeps fallback lookups working for the legacy plain-object shape', () => {
		const legacyInnerBlocksPositions = {
			'-1': ['col-1', 'col-2'],
			0: ['text-1', 'text-2'],
			'1,0': ['button-1', 'button-2'],
		};

		expect(
			getBlockPosition('button-1', legacyInnerBlocksPositions)
		).toEqual([1, 0]);
		expect(
			getBlockColumnClientId('button-2', legacyInnerBlocksPositions)
		).toBe('col-2');
	});
});
