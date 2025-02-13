import getBlockStyle from '../getBlockStyle';
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
	};

	beforeEach(() => {
		jest.clearAllMocks();
		select.mockReturnValue(mockBlockEditorStore);
	});

	it('Returns blockStyle from root attributes if available', () => {
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({
			blockStyle: 'dark',
		});

		const result = getBlockStyle('test-id');

		expect(result).toBe('dark');
		expect(
			mockBlockEditorStore.getBlockHierarchyRootClientId
		).toHaveBeenCalledWith('test-id');
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenCalledWith(
			'root-id'
		);
	});

	it('Returns blockStyle from current block if available', () => {
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes
			.mockReturnValueOnce({}) // root attributes
			.mockReturnValueOnce({ blockStyle: 'dark' }); // current block attributes

		const result = getBlockStyle('test-id');

		expect(result).toBe('dark');
		expect(mockBlockEditorStore.getBlockAttributes).toHaveBeenCalledWith(
			'test-id'
		);
	});

	it('Returns "light" as default if no blockStyle is found', () => {
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({});

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
	});

	it('Uses selected block id if no clientId is provided', () => {
		mockBlockEditorStore.getSelectedBlockClientId.mockReturnValue(
			'selected-id'
		);
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({
			blockStyle: 'dark',
		});

		const result = getBlockStyle();

		expect(
			mockBlockEditorStore.getSelectedBlockClientId
		).toHaveBeenCalled();
		expect(
			mockBlockEditorStore.getBlockHierarchyRootClientId
		).toHaveBeenCalledWith('selected-id');
		expect(result).toBe('dark');
	});

	it('Uses first multi-selected block id if no selected block', () => {
		mockBlockEditorStore.getSelectedBlockClientId.mockReturnValue(null);
		mockBlockEditorStore.getFirstMultiSelectedBlockClientId.mockReturnValue(
			'multi-selected-id'
		);
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes.mockReturnValue({
			blockStyle: 'dark',
		});

		const result = getBlockStyle();

		expect(
			mockBlockEditorStore.getFirstMultiSelectedBlockClientId
		).toHaveBeenCalled();
		expect(
			mockBlockEditorStore.getBlockHierarchyRootClientId
		).toHaveBeenCalledWith('multi-selected-id');
		expect(result).toBe('dark');
	});

	it('Handles undefined block attributes', () => {
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes.mockReturnValue(undefined);

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
	});

	it('Handles null block attributes', () => {
		mockBlockEditorStore.getBlockHierarchyRootClientId.mockReturnValue(
			'root-id'
		);
		mockBlockEditorStore.getBlockAttributes.mockReturnValue(null);

		const result = getBlockStyle('test-id');

		expect(result).toBe('light');
	});
});
