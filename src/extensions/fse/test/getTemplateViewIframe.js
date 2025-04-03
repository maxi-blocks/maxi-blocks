import getTemplateViewIframe from '@extensions/fse/getTemplateViewIframe';
import getTemplatePartChooseList from '@extensions/fse/getTemplatePartChooseList';

jest.mock('@extensions/fse/getTemplatePartChooseList', () => jest.fn());

describe('getTemplateViewIframe', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns null when templatesList is null', () => {
		getTemplatePartChooseList.mockReturnValue(null);

		const result = getTemplateViewIframe('test-id');

		expect(result).toBeNull();
		expect(getTemplatePartChooseList).toHaveBeenCalled();
	});

	it('Returns null when no matching iframe is found', () => {
		const mockListItems = [
			createMockListItem('item-1', false),
			createMockListItem('item-2', false),
		];

		const mockTemplatesList = {
			querySelectorAll: jest.fn().mockReturnValue(mockListItems),
		};

		getTemplatePartChooseList.mockReturnValue(mockTemplatesList);

		const result = getTemplateViewIframe('test-id');

		expect(result).toBeNull();
		expect(getTemplatePartChooseList).toHaveBeenCalled();
		expect(mockTemplatesList.querySelectorAll).toHaveBeenCalledWith(
			'.block-editor-block-patterns-list__list-item'
		);
	});

	it('Returns the iframe document when a matching iframe is found', () => {
		// Create mock DOM structure with one matching iframe
		const mockIframeDocument = { querySelector: jest.fn() };
		mockIframeDocument.querySelector.mockImplementation(selector => {
			if (selector === '.test-id') return true;
			return null;
		});

		const mockListItems = [
			createMockListItem('item-1', false),
			createMockListItem('item-2', true, mockIframeDocument),
		];

		const mockTemplatesList = {
			querySelectorAll: jest.fn().mockReturnValue(mockListItems),
		};

		getTemplatePartChooseList.mockReturnValue(mockTemplatesList);

		const result = getTemplateViewIframe('test-id');

		expect(result).toBe(mockIframeDocument);
		expect(getTemplatePartChooseList).toHaveBeenCalled();
		expect(mockTemplatesList.querySelectorAll).toHaveBeenCalledWith(
			'.block-editor-block-patterns-list__list-item'
		);
		expect(mockIframeDocument.querySelector).toHaveBeenCalledWith(
			'.test-id'
		);
	});

	it('Handles null iframe contentDocument', () => {
		// Create mock DOM structure with null contentDocument
		const mockListItems = [
			createMockListItem('item-1', false),
			createMockListItem('item-2', null), // null contentDocument
		];

		const mockTemplatesList = {
			querySelectorAll: jest.fn().mockReturnValue(mockListItems),
		};

		getTemplatePartChooseList.mockReturnValue(mockTemplatesList);

		const result = getTemplateViewIframe('test-id');

		expect(result).toBeNull();
		expect(getTemplatePartChooseList).toHaveBeenCalled();
		expect(mockTemplatesList.querySelectorAll).toHaveBeenCalledWith(
			'.block-editor-block-patterns-list__list-item'
		);
	});
});

/**
 * Helper function to create a mock list item with iframe
 * @param {string}       id             - The ID for the list item
 * @param {boolean|null} hasMatch       - Whether the iframe should match the query
 * @param {Object}       iframeDocument - The mock iframe document to return
 * @returns {Object} - A mock list item object
 */
function createMockListItem(id, hasMatch, iframeDocument = null) {
	const mockIframe = {
		contentDocument: iframeDocument,
	};

	return {
		id,
		querySelector: jest.fn().mockImplementation(selector => {
			if (selector === '.block-editor-block-preview__content iframe') {
				return hasMatch === null ? null : mockIframe;
			}
			return null;
		}),
	};
}
