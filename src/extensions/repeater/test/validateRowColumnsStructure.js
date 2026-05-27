/**
 * Internal dependencies
 */
import validateRowColumnsStructure from '@extensions/repeater/validateRowColumnsStructure';
import { getDisallowedRepeaterBlocksFromClientId } from '../disallowedBlocks';

const col1 = {
	clientId: 'col-1',
	name: 'maxi-blocks/column-maxi',
	attributes: {},
	innerBlocks: [],
};
const col2 = {
	clientId: 'col-2',
	name: 'maxi-blocks/column-maxi',
	attributes: {},
	innerBlocks: [],
};
const rowBlock = {
	clientId: 'row',
	name: 'maxi-blocks/row-maxi',
	attributes: {},
	innerBlocks: [col1, col2],
};

jest.mock('../disallowedBlocks', () => ({
	__esModule: true,
	default: [
		'maxi-blocks/accordion-maxi',
		'maxi-blocks/slider-maxi',
		'maxi-blocks/map-maxi',
		'maxi-blocks/search-maxi',
	],
	getDisallowedRepeaterBlocksFromClientId: jest.fn(),
}));

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(),
	select: jest.fn(),
}));

jest.mock('@extensions/copy-paste', () => ({
	cleanInnerBlocks: jest.fn(blocks => blocks),
	excludeAttributes: jest.fn(attrs => attrs),
}));

jest.mock('@extensions/maxi-block', () => ({
	goThroughMaxiBlocks: jest.fn(),
}));

jest.mock('@extensions/attributes', () => ({
	getBlockData: jest.fn(() => ({})),
}));

jest.mock('@extensions/styles', () => ({
	getLastBreakpointAttribute: jest.fn(() => 100),
}));

jest.mock('@extensions/column-templates/loadColumnsTemplate', () => jest.fn());

jest.mock('@extensions/column-templates', () => ({
	getTemplates: jest.fn(() => [{ name: '2-cols' }]),
}));

jest.mock('../updateNCLimits', () => jest.fn());
jest.mock('../updateSVG', () => jest.fn());
jest.mock('../updateRelationsInColumn', () => jest.fn());

const { select: mockSelect, dispatch: mockDispatch } =
	jest.requireMock('@wordpress/data');
const { goThroughMaxiBlocks } = jest.requireMock('@extensions/maxi-block');

const createBlock = (clientId, name, innerBlocks = []) => ({
	clientId,
	name,
	attributes: {},
	innerBlocks,
});

const traverseBlocks = (callback, blocks = []) => {
	blocks.forEach(block => {
		callback(block);
		traverseBlocks(callback, block.innerBlocks);
	});
};

describe('validateRowColumnsStructure', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		mockSelect.mockReturnValue({
			getBlock: jest.fn(id => (id === 'row' ? rowBlock : null)),
			getBlocks: jest.fn(id => (id === 'row' ? [col1, col2] : [])),
			getBlockOrder: jest.fn(() => []),
			getBlockName: jest.fn(() => 'maxi-blocks/column-maxi'),
			getBlockAttributes: jest.fn(() => ({})),
			getBlockParents: jest.fn(() => []),
			getBlockParentsByBlockName: jest.fn(() => []),
		});

		mockDispatch.mockReturnValue({
			__unstableMarkNextChangeAsNotPersistent: jest.fn(),
			replaceInnerBlocks: jest.fn(),
			updateBlockAttributes: jest.fn(),
		});

		getDisallowedRepeaterBlocksFromClientId.mockReturnValue([]);
		goThroughMaxiBlocks.mockImplementation((callback, _deep, blocks) =>
			traverseBlocks(callback, blocks)
		);
	});

	describe('rejectDisallowedBlocks flag', () => {
		it('returns false immediately when flag is true and disallowed blocks are present', async () => {
			getDisallowedRepeaterBlocksFromClientId.mockReturnValue([
				'maxi-blocks/map-maxi',
			]);

			const result = await validateRowColumnsStructure(
				'row',
				null,
				null,
				undefined,
				false,
				true
			);

			expect(result).toBe(false);
		});

		it('proceeds past the disallowed-block check when flag is false (default)', async () => {
			getDisallowedRepeaterBlocksFromClientId.mockReturnValue([
				'maxi-blocks/map-maxi',
			]);

			const result = await validateRowColumnsStructure(
				'row',
				null,
				null,
				undefined,
				false,
				false
			);

			expect(result).toBe(true);
		});

		it('proceeds normally when flag is true but no disallowed blocks exist', async () => {
			// getDisallowedRepeaterBlocksFromClientId returns [] (set in beforeEach)

			const result = await validateRowColumnsStructure(
				'row',
				null,
				null,
				undefined,
				false,
				true
			);

			expect(result).toBe(true);
		});

		it('defaults flag to false so copy-paste and column-pattern callers are unaffected', async () => {
			getDisallowedRepeaterBlocksFromClientId.mockReturnValue([
				'maxi-blocks/accordion-maxi',
				'maxi-blocks/search-maxi',
			]);

			// Called without the 6th argument, as copy-paste and column-pattern do
			const result = await validateRowColumnsStructure('row', null, null);

			expect(result).toBe(true);
		});
	});

	describe('structure confirmation', () => {
		it('asks for confirmation once when multiple columns differ from the reference column', async () => {
			const referenceText = createBlock(
				'text-1',
				'maxi-blocks/text-maxi'
			);
			const extraText = createBlock('text-2', 'maxi-blocks/text-maxi');
			const extraButton = createBlock(
				'button-1',
				'maxi-blocks/button-maxi'
			);
			const referenceColumn = createBlock(
				'col-1',
				'maxi-blocks/column-maxi',
				[referenceText]
			);
			const mismatchColumnOne = createBlock(
				'col-2',
				'maxi-blocks/column-maxi',
				[referenceText, extraText]
			);
			const mismatchColumnTwo = createBlock(
				'col-3',
				'maxi-blocks/column-maxi',
				[referenceText, extraText, extraButton]
			);
			const rowWithMismatchedColumns = {
				...rowBlock,
				innerBlocks: [
					referenceColumn,
					mismatchColumnOne,
					mismatchColumnTwo,
				],
			};
			const blocksByClientId = {
				row: rowWithMismatchedColumns,
				'col-1': referenceColumn,
				'col-2': mismatchColumnOne,
				'col-3': mismatchColumnTwo,
			};
			const confirmDifferentStructure = jest.fn(async () => true);

			mockSelect.mockReturnValue({
				getBlock: jest.fn(id => blocksByClientId[id] || null),
				getBlocks: jest.fn(id =>
					id === 'row' ? rowWithMismatchedColumns.innerBlocks : []
				),
				getBlockOrder: jest.fn(() => []),
				getBlockName: jest.fn(() => 'maxi-blocks/column-maxi'),
				getBlockAttributes: jest.fn(() => ({})),
				getBlockParents: jest.fn(() => []),
				getBlockParentsByBlockName: jest.fn(() => []),
			});

			const result = await validateRowColumnsStructure(
				'row',
				null,
				confirmDifferentStructure
			);

			expect(result).toBe(true);
			expect(confirmDifferentStructure).toHaveBeenCalledTimes(1);
		});
	});
});
