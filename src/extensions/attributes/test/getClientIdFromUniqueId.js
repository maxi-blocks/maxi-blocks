import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import { getIsTemplatePart, getSiteEditorIframeBody } from '@extensions/fse';

// Mock dependencies
jest.mock('@extensions/maxi-block', () => ({
	goThroughMaxiBlocks: jest.fn(),
}));

jest.mock('@extensions/fse', () => ({
	getIsTemplatePart: jest.fn(),
	getSiteEditorIframeBody: jest.fn(),
}));

// Mock @wordpress/data
const mockGetBlock = jest.fn();
jest.mock('@wordpress/data', () => ({
	select: jest.fn(storeName => {
		if (storeName === 'maxiBlocks/blocks') {
			return {
				getBlock: mockGetBlock,
			};
		}
		return {};
	}),
}));

describe('getClientIdFromUniqueId', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return false for empty uniqueID', () => {
		const result = getClientIdFromUniqueId('');
		expect(result).toBe(false);
	});

	it('Should return false for undefined uniqueID', () => {
		const result = getClientIdFromUniqueId();
		expect(result).toBe(false);
	});

	it('Should find clientId from Redux store (fast path)', () => {
		// Fast path: Redux store has the block
		mockGetBlock.mockReturnValue({ clientId: 'client-123' });

		const result = getClientIdFromUniqueId('text-maxi-123');
		expect(result).toBe('client-123');
		expect(mockGetBlock).toHaveBeenCalledWith('text-maxi-123');
		expect(goThroughMaxiBlocks).not.toHaveBeenCalled();
	});

	it('Should find clientId from block attributes (fallback)', () => {
		// Fallback: Redux store returns null, use tree traversal
		mockGetBlock.mockReturnValue(null);
		goThroughMaxiBlocks.mockImplementation(callback => {
			const blocks = [
				{
					clientId: 'client-123',
					attributes: { uniqueID: 'text-maxi-123' },
				},
				{
					clientId: 'client-456',
					attributes: { uniqueID: 'button-maxi-456' },
				},
			];
			blocks.forEach(block => callback(block));
		});

		const result = getClientIdFromUniqueId('text-maxi-123');
		expect(result).toBe('client-123');
		expect(goThroughMaxiBlocks).toHaveBeenCalled();
	});

	it('Should return null if no matching block found', () => {
		mockGetBlock.mockReturnValue(null);
		goThroughMaxiBlocks.mockImplementation(callback => {
			const blocks = [
				{
					clientId: 'client-123',
					attributes: { uniqueID: 'text-maxi-123' },
				},
			];
			blocks.forEach(block => callback(block));
		});

		const result = getClientIdFromUniqueId('nonexistent-id');
		expect(result).toBeNull();
		expect(goThroughMaxiBlocks).toHaveBeenCalled();
	});

	it('Should handle template part blocks', () => {
		getIsTemplatePart.mockReturnValue(false);
		const mockElement = {
			getAttribute: jest.fn().mockReturnValue('template-client-123'),
		};
		const mockQuerySelector = jest.fn().mockReturnValue(mockElement);
		const mockBody = {
			querySelector: mockQuerySelector,
		};
		getSiteEditorIframeBody.mockReturnValue(mockBody);

		const result = getClientIdFromUniqueId('template-part-123');

		expect(result).toBe('template-client-123');
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getSiteEditorIframeBody).toHaveBeenCalled();
		expect(mockQuerySelector).toHaveBeenCalledWith('.template-part-123');
		expect(mockElement.getAttribute).toHaveBeenCalledWith('data-block');
	});

	it('Should handle template part blocks when element not found', () => {
		getIsTemplatePart.mockReturnValue(false);
		const mockQuerySelector = jest.fn().mockReturnValue(null);
		const mockBody = {
			querySelector: mockQuerySelector,
		};
		getSiteEditorIframeBody.mockReturnValue(mockBody);
		mockGetBlock.mockReturnValue(null);
		goThroughMaxiBlocks.mockImplementation(() => {});

		const result = getClientIdFromUniqueId('template-part-123');

		expect(result).toBeNull();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getSiteEditorIframeBody).toHaveBeenCalled();
		expect(mockQuerySelector).toHaveBeenCalledWith('.template-part-123');
	});

	it('Should skip DOM search for non-template parts', () => {
		getIsTemplatePart.mockReturnValue(true);
		getSiteEditorIframeBody.mockReturnValue({});
		mockGetBlock.mockReturnValue({ clientId: 'client-123' });

		const result = getClientIdFromUniqueId('text-maxi-123');

		expect(result).toBe('client-123');
		expect(getSiteEditorIframeBody).not.toHaveBeenCalled();
	});
});
