import { getSelectedBlockInserterRootClientId } from '@extensions/inserter/selectedBlockInserterRoot';

describe('getSelectedBlockInserterRootClientId', () => {
	it('targets the selected column so its inner blocks are shown in the sidebar inserter', () => {
		const result = getSelectedBlockInserterRootClientId({
			selectedBlockName: 'maxi-blocks/column-maxi',
			selectedClientId: 'column-client-id',
		});

		expect(result).toBe('column-client-id');
	});

	it('targets the selected row so columns remain available from row context', () => {
		const result = getSelectedBlockInserterRootClientId({
			selectedBlockName: 'maxi-blocks/row-maxi',
			selectedClientId: 'row-client-id',
		});

		expect(result).toBe('row-client-id');
	});

	it('does not override the inserter root for other selected blocks', () => {
		const result = getSelectedBlockInserterRootClientId({
			selectedBlockName: 'maxi-blocks/text-maxi',
			selectedClientId: 'text-client-id',
		});

		expect(result).toBeNull();
	});

	it('does not override the inserter root without a selected client id', () => {
		const result = getSelectedBlockInserterRootClientId({
			selectedBlockName: 'maxi-blocks/column-maxi',
			selectedClientId: null,
		});

		expect(result).toBeNull();
	});
});
