const mockSetIsInserterOpened = jest.fn();
const mockSubscribe = jest.fn();
const mockAddFilter = jest.fn();

let mockSelectedBlock;

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(storeName => {
		if (
			['core/editor', 'core/edit-post', 'core/edit-site'].includes(
				storeName
			)
		) {
			return {
				setIsInserterOpened: mockSetIsInserterOpened,
			};
		}

		return {};
	}),
	select: jest.fn(storeName => {
		if (storeName === 'core/block-editor') {
			return {
				getSelectedBlockClientId: jest.fn(
					() => mockSelectedBlock?.clientId
				),
				getBlockName: jest.fn(() => mockSelectedBlock?.name),
				getBlockOrder: jest.fn(() => ['inner-block-client-id']),
			};
		}

		if (
			['core/editor', 'core/edit-post', 'core/edit-site'].includes(
				storeName
			)
		) {
			return {
				isInserterOpened: jest.fn(() => true),
			};
		}

		return {};
	}),
	subscribe: mockSubscribe,
}));

jest.mock('@wordpress/hooks', () => ({
	addFilter: mockAddFilter,
}));

describe('syncSelectedBlockInserterRoot', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
		mockSelectedBlock = null;
	});

	it('retargets the same Maxi inserter root after a non-Maxi selection clears the cache', () => {
		require('@extensions/inserter');

		const [syncSelectedBlockInserterRoot] = mockSubscribe.mock.calls[0];

		mockSelectedBlock = {
			clientId: 'row-client-id',
			name: 'maxi-blocks/row-maxi',
		};
		syncSelectedBlockInserterRoot();

		expect(mockSetIsInserterOpened).toHaveBeenCalledWith({
			rootClientId: 'row-client-id',
			insertionIndex: 1,
		});

		mockSetIsInserterOpened.mockClear();

		mockSelectedBlock = {
			clientId: 'text-client-id',
			name: 'maxi-blocks/text-maxi',
		};
		syncSelectedBlockInserterRoot();

		expect(mockSetIsInserterOpened).not.toHaveBeenCalled();

		mockSelectedBlock = {
			clientId: 'row-client-id',
			name: 'maxi-blocks/row-maxi',
		};
		syncSelectedBlockInserterRoot();

		expect(mockSetIsInserterOpened).toHaveBeenCalledWith({
			rootClientId: 'row-client-id',
			insertionIndex: 1,
		});
	});
});
