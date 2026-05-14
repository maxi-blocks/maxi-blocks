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
});
