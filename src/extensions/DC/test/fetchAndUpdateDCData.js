import { dispatch, select } from '@wordpress/data';
import fetchAndUpdateDCData from '@extensions/DC/fetchAndUpdateDCData';
import { getGroupAttributes } from '@extensions/styles';
import getDCContent from '@extensions/DC/getDCContent';
import getDCMedia from '@extensions/DC/getDCMedia';
import getDCNewLinkSettings from '@extensions/DC/getDCNewLinkSettings';
import getDCValues from '@extensions/DC/getDCValues';
import getValidatedDCAttributes from '@extensions/DC/validateDCAttributes';
import { getUpdatedImgSVG } from '@extensions/svg';
import { inlineLinkFields } from '@extensions/DC/constants';

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(),
	select: jest.fn(),
}));
jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(),
}));
jest.mock('@extensions/DC/getDCContent', () => jest.fn());
jest.mock('@extensions/DC/getDCMedia', () => jest.fn());
jest.mock('@extensions/DC/getDCNewLinkSettings', () => jest.fn());
jest.mock('@extensions/DC/getDCValues', () => jest.fn());
jest.mock('@extensions/DC/validateDCAttributes', () => jest.fn());
jest.mock('@extensions/svg', () => ({
	getUpdatedImgSVG: jest.fn(),
}));

describe('fetchAndUpdateDCData', () => {
	const mockAttributes = { uniqueID: 'test-id' };
	const mockClientId = 'test-client-id';
	const mockOnChange = jest.fn();
	const mockContentType = 'text';
	const mockContextLoop = { 'cl-status': false };
	const mockMarkNextChangeAsNotPersistent = jest.fn();
	const mockCustomTaxonomies = ['custom_tax1', 'custom_tax2'];

	beforeEach(() => {
		jest.clearAllMocks();

		dispatch.mockImplementation(() => ({
			__unstableMarkNextChangeAsNotPersistent:
				mockMarkNextChangeAsNotPersistent,
		}));

		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomTaxonomies: () => mockCustomTaxonomies,
				};
			}
			return {};
		});
	});

	it('should return early if dynamic content and context loop are not active', async () => {
		getGroupAttributes.mockReturnValue({ 'dc-status': false });

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			mockContentType,
			mockClientId
		);

		expect(mockOnChange).not.toHaveBeenCalled();
		expect(getDCValues).not.toHaveBeenCalled();
	});

	it('should return early if required dynamic content props are missing', async () => {
		getGroupAttributes.mockReturnValue({ 'dc-status': true });
		getDCValues.mockReturnValue({ content: 'test', type: 'posts' }); // Missing field and id

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			mockContentType,
			mockClientId
		);

		expect(mockOnChange).not.toHaveBeenCalled();
		expect(getValidatedDCAttributes).not.toHaveBeenCalled();
	});

	it('should update text content when content changes', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: 'old content',
			type: 'posts',
			field: 'title',
			id: 123,
			linkTarget: 'entity',
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp' };
		const mockNewContent = 'new content';

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCContent.mockResolvedValue(mockNewContent);
		getDCNewLinkSettings.mockResolvedValue(null);

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			'text',
			mockClientId
		);

		expect(mockMarkNextChangeAsNotPersistent).toHaveBeenCalled();
		expect(mockOnChange).toHaveBeenCalledWith({
			'dc-content': mockNewContent,
			...mockSyncAttrs,
		});
	});

	it('should update link settings when they change', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: 'test content',
			type: 'posts',
			field: 'title',
			id: 123,
			linkTarget: 'entity',
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp' };
		const mockNewLinkSettings = {
			url: 'https://example.com',
			title: 'Example',
			disabled: false,
		};

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCContent.mockResolvedValue(mockDynamicContentProps.content); // Same content
		getDCNewLinkSettings.mockResolvedValue(mockNewLinkSettings);

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			'text',
			mockClientId
		);

		expect(mockMarkNextChangeAsNotPersistent).toHaveBeenCalled();
		expect(mockOnChange).toHaveBeenCalledWith({
			linkSettings: mockNewLinkSettings,
			...mockSyncAttrs,
		});
	});

	it('should handle HTML content', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: 'old content',
			type: 'posts',
			field: 'content',
			id: 123,
			linkTarget: 'content', // Same as field - will trigger HTML content handling
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp' };
		const mockNewContent = '<p>HTML content</p>';

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCContent.mockResolvedValue(mockNewContent);
		getDCNewLinkSettings.mockResolvedValue(null);

		// Set up content field to be in inlineLinkFields
		inlineLinkFields.push('content');

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			'text',
			mockClientId
		);

		expect(mockOnChange).toHaveBeenCalledWith({
			'dc-content': mockNewContent,
			'dc-contains-html': true,
			...mockSyncAttrs,
		});

		inlineLinkFields.pop();
	});

	it('should update image content with media data', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: null,
			type: 'media',
			field: 'image',
			id: 123,
			linkTarget: 'entity',
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp' };
		const mockMediaContent = {
			id: 456,
			url: 'https://example.com/image.jpg',
			caption: 'Test caption',
		};
		const mockSVGData = { key: 'value' };

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCMedia.mockResolvedValue(mockMediaContent);
		getDCNewLinkSettings.mockResolvedValue(null);
		getUpdatedImgSVG.mockReturnValue({ SVGData: mockSVGData });

		await fetchAndUpdateDCData(
			{ ...mockAttributes, SVGData: {}, SVGElement: {} },
			mockOnChange,
			mockContextLoop,
			'image',
			mockClientId
		);

		expect(mockOnChange).toHaveBeenCalledWith(
			expect.objectContaining({
				'dc-media-id': mockMediaContent.id,
				'dc-media-url': mockMediaContent.url,
				'dc-media-caption': 'Test caption',
				SVGData: mockSVGData,
				...mockSyncAttrs,
			})
		);
	});

	it('should handle null media content', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: null,
			type: 'media',
			field: 'image',
			id: 123,
			linkTarget: 'entity',
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp' };

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCMedia.mockResolvedValue(null);
		getDCNewLinkSettings.mockResolvedValue(null);

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			'image',
			mockClientId
		);

		expect(mockOnChange).toHaveBeenCalledWith({
			'dc-media-id': null,
			'dc-media-url': null,
			...mockSyncAttrs,
		});
	});

	it('should update only synchronizedAttributes when no other changes are needed', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: 'test content',
			type: 'posts',
			field: 'title',
			id: 123,
			linkTarget: 'entity',
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp', 'dc-type': 'posts' };

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);

		// Mock getDCContent to return the same content (no content change)
		getDCContent.mockResolvedValue(mockDynamicContentProps.content);

		// Mock getDCNewLinkSettings to return null (no link settings change)
		getDCNewLinkSettings.mockResolvedValue(null);

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			'text',
			mockClientId
		);

		expect(mockMarkNextChangeAsNotPersistent).toHaveBeenCalled();
		expect(mockOnChange).toHaveBeenCalledWith(mockSyncAttrs);
	});

	it('should handle special types like settings and cart', async () => {
		const mockDynamicContent = { 'dc-status': true };
		const mockDynamicContentProps = {
			content: 'old content',
			type: 'settings', // Special type that doesn't require id
			field: 'site_title',
			id: null,
			linkTarget: 'entity',
			containsHTML: false,
		};
		const mockSyncAttrs = { 'dc-source': 'wp' };
		const mockNewContent = 'Site Title';

		getGroupAttributes.mockReturnValue(mockDynamicContent);
		getDCValues
			.mockReturnValueOnce(mockDynamicContentProps)
			.mockReturnValueOnce(mockDynamicContentProps);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCContent.mockResolvedValue(mockNewContent);
		getDCNewLinkSettings.mockResolvedValue(null);

		await fetchAndUpdateDCData(
			mockAttributes,
			mockOnChange,
			mockContextLoop,
			'text',
			mockClientId
		);

		expect(mockOnChange).toHaveBeenCalledWith({
			'dc-content': mockNewContent,
			...mockSyncAttrs,
		});
	});

	it('should handle date formatting with specific DC attributes', async () => {
		const mockDCAttributes = {
			'dc-error': '',
			'dc-hide': true,
			'dc-status': true,
			'dc-id': 1,
			'dc-author': 1,
			'dc-show': 'current',
			'dc-field': 'title',
			'dc-format': 'd.m.Y t',
			'dc-custom-date': false,
			'dc-year': 'numeric',
			'dc-month': 'numeric',
			'dc-day': 'numeric',
			'dc-hour': 'numeric',
			'dc-hour12': false,
			'dc-minute': 'numeric',
			'dc-second': 'numeric',
			'dc-locale': 'en',
			'dc-timezone': 'Europe/London',
			'dc-timezone-name': 'none',
			'dc-weekday': 'none',
			'dc-era': 'none',
			'dc-limit': 100,
			'dc-content': 'Hello world!',
			'dc-media-size': 512,
			'dc-delimiter-content': '',
			'dc-contains-html': false,
			'dc-image-accumulator': 0,
			'dc-keep-only-text-content': false,
			'dc-link-target': 'entity',
			'dc-type': 'posts',
			uniqueID: 'text-maxi-0f303954-u',
		};

		const mockSyncAttrs = { 'dc-source': 'wp' };
		const mockNewContent = 'Updated title';

		getGroupAttributes.mockReturnValue(mockDCAttributes);
		getDCValues.mockImplementation(
			jest.requireActual('@extensions/DC/getDCValues').default
		);
		getValidatedDCAttributes.mockResolvedValue(mockSyncAttrs);
		getDCContent.mockResolvedValue(mockNewContent);
		getDCNewLinkSettings.mockResolvedValue(null);

		await fetchAndUpdateDCData(
			mockDCAttributes,
			mockOnChange,
			mockContextLoop,
			'text',
			mockClientId
		);

		expect(mockMarkNextChangeAsNotPersistent).toHaveBeenCalled();
		expect(mockOnChange).toHaveBeenCalledWith({
			'dc-contains-html': false,
			'dc-content': mockNewContent,
			...mockSyncAttrs,
		});
	});
});
