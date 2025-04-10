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

	it('Should find clientId from block attributes', () => {
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

		const result = getClientIdFromUniqueId('template-part-123');

		expect(result).toBeNull();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getSiteEditorIframeBody).toHaveBeenCalled();
		expect(mockQuerySelector).toHaveBeenCalledWith('.template-part-123');
	});

	it('Should skip DOM search for non-template parts', () => {
		getIsTemplatePart.mockReturnValue(true);
		getSiteEditorIframeBody.mockReturnValue({});

		goThroughMaxiBlocks.mockImplementation(callback => {
			const blocks = [
				{
					clientId: 'client-123',
					attributes: { uniqueID: 'text-maxi-123' },
				},
			];
			blocks.forEach(block => callback(block));
		});

		const result = getClientIdFromUniqueId('text-maxi-123');

		expect(result).toBe('client-123');
		expect(getSiteEditorIframeBody).not.toHaveBeenCalled();
	});
});
