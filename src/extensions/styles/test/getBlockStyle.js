import getBlockStyle from '@extensions/styles/getBlockStyle';
import { select } from '@wordpress/data';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('getBlockStyle', () => {
	const mockBlockEditorStore = {
		getBlockHierarchyRootClientId: jest.fn(),
		getBlockAttributes: jest.fn(),
		getSelectedBlockClientId: jest.fn(),
		getFirstMultiSelectedBlockClientId: jest.fn(),
		getBlockParents: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		select.mockReturnValue(mockBlockEditorStore);
		// Set default return value for getBlockParents
		mockBlockEditorStore.getBlockParents.mockReturnValue([]);
	});

	it('Returns blockStyle from current block if available', () => {
		// First check current block
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({
			blockStyle: 'light',
		});

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
		// Should check current block first
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenCalledWith(
			'test-id'
		);
		// Should not need to check root if current block has style
		expect(
			mockBlockEditorStore.getBlockHierarchyRootClientId
		).not.toHaveBeenCalled();
	});

	it('Returns blockStyle from root attributes if current block has no style', () => {
		// First returns undefined for current block attributes
		mockBlockEditorStore.getBlockAttributes.mockReturnValueOnce({});
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		// Then returns dark style for root attributes
		mockBlockEditorStore.getBlockAttributes.mockReturnValueOnce({
			blockStyle: 'dark',
		});

		const result = getBlockStyle('test-id');

		expect(result).toBe('dark');
		// Check that it was called with test-id first for current block
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenNthCalledWith(
			1,
			'test-id'
		);
		expect(
			mockBlockEditorStore.getBlockHierarchyRootClientId
		).toHaveBeenCalledWith('test-id');
		// Then check root block
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenNthCalledWith(
			2,
			'root-id'
		);
	});

	it('Returns "light" as default if no blockStyle is found', () => {
		// First check current block, no style
		mockBlockEditorStore.getBlockAttributes.mockReturnValueOnce({});
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		// Then check root block, no style
		mockBlockEditorStore.getBlockAttributes.mockReturnValueOnce({});

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
	});

	it('Skips root check if root is same as current block', () => {
		// Current block has no style
		mockBlockEditorStore.getBlockAttributes.mockReturnValueOnce({});
		// Root is same as current block
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'test-id'
		);

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
		// Should check attributes only once
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenCalledTimes(
			1
		);
	});

	it('Uses selected block id if no clientId is provided', () => {
		mockBlockEditorStore.getSelectedBlockClientId.mockReturnValue(
			'selected-id'
		);
		// Selected block has style
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({
			blockStyle: 'dark',
		});

		const result = getBlockStyle();

		expect(
			mockBlockEditorStore.getSelectedBlockClientId
		).toHaveBeenCalled();
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenCalledWith(
			'selected-id'
		);
		expect(result).toBe('dark');
	});

	it('Uses first multi-selected block id if no selected block', () => {
		mockBlockEditorStore.getSelectedBlockClientId.mockReturnValue(null);
		mockBlockEditorStore.getFirstMultiSelectedBlockClientId.mockReturnValue(
			'multi-selected-id'
		);
		// Multi-selected block has style
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({
			blockStyle: 'dark',
		});

		const result = getBlockStyle();

		expect(
			mockBlockEditorStore.getFirstMultiSelectedBlockClientId
		).toHaveBeenCalled();
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenCalledWith(
			'multi-selected-id'
		);
		expect(result).toBe('dark');
	});

	it('Handles undefined block attributes', () => {
		mockBlockEditorStore.getBlockAttributes.mockReturnValue(undefined);
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
	});

	it('Handles null block attributes', () => {
		mockBlockEditorStore.getBlockAttributes.mockReturnValue(null);
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
	});
});
