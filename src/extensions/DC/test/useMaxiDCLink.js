/**
 * External dependencies
 */
import { jest } from '@jest/globals';

/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import useMaxiDCLink from '@extensions/DC/useMaxiDCLink';
import { getGroupAttributes } from '@extensions/styles';
import getDCNewLinkSettings from '@extensions/DC/getDCNewLinkSettings';
import getDCValues from '@extensions/DC/getDCValues';

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(),
}));

// Mock useEffect to execute callback immediately
jest.mock('@wordpress/element', () => ({
	useEffect: jest.fn(cb => cb()),
}));

jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(),
}));

jest.mock('@extensions/DC/getDCNewLinkSettings', () => jest.fn());
jest.mock('@extensions/DC/getDCValues', () => jest.fn());

describe('useMaxiDCLink', () => {
	const mockSetAttributes = jest.fn();
	const mockClientId = 'test-client-id';

	beforeEach(() => {
		jest.clearAllMocks();

		const mockDispatchObject = {
			__unstableMarkNextChangeAsNotPersistent: jest.fn(),
		};
		dispatch.mockReturnValue(mockDispatchObject);

		getGroupAttributes.mockReturnValue({
			'dc-type': 'posts',
			'dc-id': 1,
		});

		getDCValues.mockReturnValue({
			type: 'posts',
			id: 1,
			field: 'title',
		});

		getDCNewLinkSettings.mockResolvedValue({
			url: 'https://example.com/post/1',
			opensInNewTab: false,
		});
	});

	it('should update link settings when all conditions are met', async () => {
		const attributes = {
			'dc-link-status': true,
			linkSettings: {},
		};

		const contextLoopContext = {
			contextLoop: {
				type: 'posts',
				id: 1,
			},
		};

		useMaxiDCLink(
			'maxi-blocks/column-maxi',
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(getGroupAttributes).toHaveBeenCalledWith(
			attributes,
			'dynamicContent'
		);
		expect(getDCValues).toHaveBeenCalledWith(
			{ 'dc-type': 'posts', 'dc-id': 1 },
			contextLoopContext.contextLoop
		);
		expect(getDCNewLinkSettings).toHaveBeenCalledWith(
			attributes,
			{ type: 'posts', id: 1, field: 'title' },
			mockClientId
		);
		expect(dispatch).toHaveBeenCalledWith('core/block-editor');
		expect(mockSetAttributes).toHaveBeenCalledWith({
			linkSettings: {
				url: 'https://example.com/post/1',
				opensInNewTab: false,
			},
		});
	});

	it('should not update link settings when block is not in DC_LINK_BLOCKS', async () => {
		const attributes = {
			'dc-link-status': true,
			linkSettings: {},
		};

		const contextLoopContext = {
			contextLoop: {
				type: 'posts',
				id: 1,
			},
		};

		useMaxiDCLink(
			'paragraph', // Not in DC_LINK_BLOCKS
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(getGroupAttributes).not.toHaveBeenCalled();
		expect(getDCValues).not.toHaveBeenCalled();
		expect(getDCNewLinkSettings).not.toHaveBeenCalled();
		expect(dispatch).not.toHaveBeenCalled();
		expect(mockSetAttributes).not.toHaveBeenCalled();
	});

	it('should not update link settings when dc-link-status is false', async () => {
		const attributes = {
			'dc-link-status': false,
			linkSettings: {},
		};

		const contextLoopContext = {
			contextLoop: {
				type: 'posts',
				id: 1,
			},
		};

		useMaxiDCLink(
			'maxi-blocks/column-maxi',
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(getGroupAttributes).not.toHaveBeenCalled();
		expect(getDCValues).not.toHaveBeenCalled();
		expect(getDCNewLinkSettings).not.toHaveBeenCalled();
		expect(dispatch).not.toHaveBeenCalled();
		expect(mockSetAttributes).not.toHaveBeenCalled();
	});

	it('should not update link settings when contextLoop is not provided', async () => {
		const attributes = {
			'dc-link-status': true,
			linkSettings: {},
		};

		const contextLoopContext = {};

		useMaxiDCLink(
			'maxi-blocks/column-maxi',
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(getGroupAttributes).not.toHaveBeenCalled();
		expect(getDCValues).not.toHaveBeenCalled();
		expect(getDCNewLinkSettings).not.toHaveBeenCalled();
		expect(dispatch).not.toHaveBeenCalled();
		expect(mockSetAttributes).not.toHaveBeenCalled();
	});

	it('should not update attributes when getDCNewLinkSettings returns falsy value', async () => {
		const attributes = {
			'dc-link-status': true,
			linkSettings: {},
		};

		const contextLoopContext = {
			contextLoop: {
				type: 'posts',
				id: 1,
			},
		};

		getDCNewLinkSettings.mockResolvedValue(null);

		useMaxiDCLink(
			'maxi-blocks/column-maxi',
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(getGroupAttributes).toHaveBeenCalled();
		expect(getDCValues).toHaveBeenCalled();
		expect(getDCNewLinkSettings).toHaveBeenCalled();
		expect(dispatch).not.toHaveBeenCalled();
		expect(mockSetAttributes).not.toHaveBeenCalled();
	});

	it('should handle errors from getDCNewLinkSettings', async () => {
		const attributes = {
			'dc-link-status': true,
			linkSettings: {},
		};

		const contextLoopContext = {
			contextLoop: {
				type: 'posts',
				id: 1,
			},
		};

		const originalConsoleError = console.error;
		console.error = jest.fn();

		const mockError = new Error('Test error');
		getDCNewLinkSettings.mockRejectedValue(mockError);

		useMaxiDCLink(
			'maxi-blocks/column-maxi',
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(getGroupAttributes).toHaveBeenCalled();
		expect(getDCValues).toHaveBeenCalled();
		expect(getDCNewLinkSettings).toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(mockError);
		expect(dispatch).not.toHaveBeenCalled();
		expect(mockSetAttributes).not.toHaveBeenCalled();

		console.error = originalConsoleError;
	});

	it('should update link settings with the response from getDCNewLinkSettings', async () => {
		const attributes = {
			'dc-link-status': true,
			linkSettings: {},
		};

		const contextLoopContext = {
			contextLoop: {
				type: 'posts',
				id: 1,
			},
		};

		const customLinkSettings = {
			url: 'https://example.com/custom-link',
			opensInNewTab: true,
			title: 'Custom Link',
		};

		getDCNewLinkSettings.mockResolvedValue(customLinkSettings);

		useMaxiDCLink(
			'maxi-blocks/column-maxi',
			attributes,
			mockClientId,
			contextLoopContext,
			mockSetAttributes
		);

		await Promise.resolve();

		expect(mockSetAttributes).toHaveBeenCalledWith({
			linkSettings: customLinkSettings,
		});
	});
});
