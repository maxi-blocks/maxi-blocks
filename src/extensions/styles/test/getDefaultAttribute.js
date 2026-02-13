import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';
import { select } from '@wordpress/data';
import { getBlockAttributes } from '@wordpress/blocks';
import { getBlockData } from '@extensions/attributes';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));
jest.mock('@wordpress/blocks', () => ({
	getBlockAttributes: jest.fn(),
}));
jest.mock('@extensions/attributes', () => ({
	getBlockData: jest.fn(),
}));
jest.mock('@extensions/styles/defaults/index', () => ({
	testDefaults: {
		'test-prop': { default: 'default-value' },
	},
}));

describe('getDefaultAttribute', () => {
	const mockBlockEditorStore = {
		getBlockName: jest.fn(),
		getSelectedBlockClientIds: jest.fn(),
	};

	const mockMaxiBlocksStore = {
		receiveBaseBreakpoint: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		select.mockImplementation(store => {
			if (store === 'core/block-editor') return mockBlockEditorStore;
			if (store === 'maxiBlocks') return mockMaxiBlocksStore;
			return {};
		});
	});

	it('Returns null for non-maxi blocks', () => {
		mockBlockEditorStore.getBlockName.mockReturnValue('core/paragraph');
		const result = getDefaultAttribute('some-prop', 'client-id');
		expect(result).toBeNull();
	});

	it('Handles single clientId as string', () => {
		mockBlockEditorStore.getBlockName.mockReturnValue(
			'maxi-blocks/test-block'
		);
		getBlockAttributes.mockReturnValue({ 'test-prop': 'test-value' });

		const result = getDefaultAttribute('test-prop', 'client-id');

		expect(mockBlockEditorStore.getBlockName).toHaveBeenCalledWith(
			'client-id'
		);
		expect(result).toBe('test-value');
	});

	it('Handles array of clientIds with same block type', () => {
		mockBlockEditorStore.getBlockName
			.mockReturnValueOnce('maxi-blocks/test-block')
			.mockReturnValueOnce('maxi-blocks/test-block');
		getBlockAttributes.mockReturnValue({ 'test-prop': 'test-value' });

		const result = getDefaultAttribute('test-prop', [
			'client-id-1',
			'client-id-2',
		]);

		expect(result).toBe('test-value');
	});

	it('Handles different block types in clientIds array', () => {
		mockBlockEditorStore.getBlockName
			.mockReturnValueOnce('maxi-blocks/test-block')
			.mockReturnValueOnce('maxi-blocks/other-block');
		getBlockAttributes.mockReturnValue({ 'test-prop': 'test-value' });

		const result = getDefaultAttribute('test-prop', [
			'client-id-1',
			'client-id-2',
		]);

		expect(result).toBe(null);
	});

	it('Handles null clientIds by using selected blocks', () => {
		mockBlockEditorStore.getSelectedBlockClientIds.mockReturnValue([
			'selected-id',
		]);
		mockBlockEditorStore.getBlockName.mockReturnValue(
			'maxi-blocks/test-block'
		);
		getBlockAttributes.mockReturnValue({ 'test-prop': 'test-value' });

		const result = getDefaultAttribute('test-prop', null);

		expect(
			mockBlockEditorStore.getSelectedBlockClientIds
		).toHaveBeenCalled();
		expect(result).toBe('test-value');
	});

	it('Uses blockNameProp when provided with null clientIds', () => {
		getBlockAttributes.mockReturnValue({ 'test-prop': 'test-value' });

		const result = getDefaultAttribute(
			'test-prop',
			null,
			false,
			'maxi-blocks/test-block'
		);

		expect(result).toBe('test-value');
	});

	it('Uses maxiAttributes from blockData when available', () => {
		mockBlockEditorStore.getBlockName.mockReturnValue(
			'maxi-blocks/test-block'
		);
		getBlockData.mockReturnValue({
			maxiAttributes: {
				'test-prop': 'maxi-value',
			},
		});

		const result = getDefaultAttribute('test-prop', 'client-id');

		expect(result).toBe('maxi-value');
	});

	it('Handles general breakpoint attributes', () => {
		mockBlockEditorStore.getBlockName.mockReturnValue(
			'maxi-blocks/test-block'
		);
		mockMaxiBlocksStore.receiveBaseBreakpoint.mockReturnValue('xxl');
		getBlockAttributes.mockReturnValue({
			'prop-general': undefined,
			'prop-xxl': 'xxl-value',
		});

		const result = getDefaultAttribute('prop-general', 'client-id');

		expect(result).toBe('xxl-value');
	});

	it('Respects avoidBaseBreakpoint flag for general attributes', () => {
		mockBlockEditorStore.getBlockName.mockReturnValue(
			'maxi-blocks/test-block'
		);
		getBlockAttributes.mockReturnValue({
			'general-prop': 'general-value',
		});

		const result = getDefaultAttribute('general-prop', 'client-id', true);

		expect(result).toBe('general-value');
		expect(
			mockMaxiBlocksStore.receiveBaseBreakpoint
		).not.toHaveBeenCalled();
	});

	it('Falls back to defaults when no other value is found', () => {
		mockBlockEditorStore.getBlockName.mockReturnValue(
			'maxi-blocks/test-block'
		);
		getBlockAttributes.mockReturnValue({});
		getBlockData.mockReturnValue({
			maxiAttributes: {},
		});

		const result = getDefaultAttribute('test-prop', 'client-id');

		expect(result).toBe('default-value');
	});
});
