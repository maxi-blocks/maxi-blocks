/**
 * WordPress dependencies
 */
import { cloneBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import cleanInnerBlocks from '../cleanInnerBlocks';

jest.mock('@wordpress/blocks', () => ({
	cloneBlock: jest.fn((block, attrs, innerBlocks) => ({
		...block,
		attributes: attrs || block.attributes,
		innerBlocks: innerBlocks || block.innerBlocks,
	})),
}));

describe('cleanInnerBlocks', () => {
	beforeEach(() => {
		cloneBlock.mockClear();
	});

	it('Cleans blocks with no inner blocks', () => {
		const blocks = [
			{
				name: 'test/block',
				attributes: { content: 'test' },
				innerBlocks: [],
			},
		];

		const result = cleanInnerBlocks(blocks);

		expect(cloneBlock).toHaveBeenCalledWith(blocks[0], null, []);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			name: 'test/block',
			attributes: { content: 'test' },
			innerBlocks: [],
		});
	});

	it('Cleans blocks with nested inner blocks', () => {
		const blocks = [
			{
				name: 'test/parent',
				attributes: { content: 'parent' },
				innerBlocks: [
					{
						name: 'test/child',
						attributes: { content: 'child' },
						innerBlocks: [],
					},
				],
			},
		];

		const result = cleanInnerBlocks(blocks);

		expect(cloneBlock).toHaveBeenCalledTimes(2);
		expect(result).toHaveLength(1);
		expect(result[0].innerBlocks).toHaveLength(1);
		expect(result[0]).toEqual({
			name: 'test/parent',
			attributes: { content: 'parent' },
			innerBlocks: [
				{
					name: 'test/child',
					attributes: { content: 'child' },
					innerBlocks: [],
				},
			],
		});
	});

	it('Handles multiple blocks at the same level', () => {
		const blocks = [
			{
				name: 'test/block1',
				attributes: { content: 'block1' },
				innerBlocks: [],
			},
			{
				name: 'test/block2',
				attributes: { content: 'block2' },
				innerBlocks: [],
			},
		];

		const result = cleanInnerBlocks(blocks);

		expect(cloneBlock).toHaveBeenCalledTimes(2);
		expect(result).toHaveLength(2);
		expect(result).toEqual([
			{
				name: 'test/block1',
				attributes: { content: 'block1' },
				innerBlocks: [],
			},
			{
				name: 'test/block2',
				attributes: { content: 'block2' },
				innerBlocks: [],
			},
		]);
	});

	it('Handles deeply nested blocks', () => {
		const blocks = [
			{
				name: 'test/level1',
				attributes: { content: 'level1' },
				innerBlocks: [
					{
						name: 'test/level2',
						attributes: { content: 'level2' },
						innerBlocks: [
							{
								name: 'test/level3',
								attributes: { content: 'level3' },
								innerBlocks: [],
							},
						],
					},
				],
			},
		];

		const result = cleanInnerBlocks(blocks);

		expect(cloneBlock).toHaveBeenCalledTimes(3);
		expect(result[0].innerBlocks[0].innerBlocks[0]).toEqual({
			name: 'test/level3',
			attributes: { content: 'level3' },
			innerBlocks: [],
		});
	});

	it('Handles empty blocks array', () => {
		const blocks = [];

		const result = cleanInnerBlocks(blocks);

		expect(cloneBlock).not.toHaveBeenCalled();
		expect(result).toEqual([]);
	});
});
