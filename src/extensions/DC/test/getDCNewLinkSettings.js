import getDCNewLinkSettings from '@extensions/DC/getDCNewLinkSettings';
import getDCLink from '@extensions/DC/getDCLink';

jest.mock('@extensions/DC/getDCLink');

describe('getDCNewLinkSettings', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should update disabled status when postTaxonomyLinksStatus changes', async () => {
		const attributes = {
			linkSettings: {
				disabled: false,
				url: 'https://example.com',
				title: 'Example',
			},
		};

		const dynamicContentProps = {
			postTaxonomyLinksStatus: true,
			linkStatus: true,
		};

		getDCLink.mockResolvedValue('https://example.com');

		const result = await getDCNewLinkSettings(
			attributes,
			dynamicContentProps,
			'client-1'
		);

		expect(result).toEqual({
			disabled: true,
			url: 'https://example.com',
			title: 'Example',
		});
	});

	it('should update URL and title when link changes and linkStatus is true', async () => {
		const attributes = {
			linkSettings: {
				disabled: false,
				url: 'https://old-url.com',
				title: 'Old URL',
			},
		};

		const dynamicContentProps = {
			postTaxonomyLinksStatus: false,
			linkStatus: true,
		};

		getDCLink.mockResolvedValue('https://new-url.com');

		const result = await getDCNewLinkSettings(
			attributes,
			dynamicContentProps,
			'client-1'
		);

		expect(result).toEqual({
			disabled: false,
			url: 'https://new-url.com',
			title: 'https://new-url.com',
		});
	});

	it('should clear URL and title when linkStatus is false and current URL matches dcLink', async () => {
		const attributes = {
			linkSettings: {
				disabled: false,
				url: 'https://example.com',
				title: 'Example',
			},
		};

		const dynamicContentProps = {
			postTaxonomyLinksStatus: false,
			linkStatus: false,
		};

		getDCLink.mockResolvedValue('https://example.com');

		const result = await getDCNewLinkSettings(
			attributes,
			dynamicContentProps,
			'client-1'
		);

		expect(result).toEqual({
			disabled: false,
			url: null,
			title: null,
		});
	});

	it('should return null when no changes are needed', async () => {
		const attributes = {
			linkSettings: {
				disabled: false,
				url: 'https://example.com',
				title: 'Example',
			},
		};

		const dynamicContentProps = {
			postTaxonomyLinksStatus: false,
			linkStatus: true,
		};

		getDCLink.mockResolvedValue('https://example.com');

		const result = await getDCNewLinkSettings(
			attributes,
			dynamicContentProps,
			'client-1'
		);

		expect(result).toBeNull();
	});

	it('should handle null dcLink value', async () => {
		const attributes = {
			linkSettings: {
				disabled: false,
				url: 'https://example.com',
				title: 'Example',
			},
		};

		const dynamicContentProps = {
			postTaxonomyLinksStatus: false,
			linkStatus: true,
		};

		getDCLink.mockResolvedValue(null);

		const result = await getDCNewLinkSettings(
			attributes,
			dynamicContentProps,
			'client-1'
		);

		expect(result).toBeNull();
	});

	it('should update both disabled and URL/title when both conditions are met', async () => {
		const attributes = {
			linkSettings: {
				disabled: false,
				url: 'https://old-url.com',
				title: 'Old URL',
			},
		};

		const dynamicContentProps = {
			postTaxonomyLinksStatus: true,
			linkStatus: true,
		};

		getDCLink.mockResolvedValue('https://new-url.com');

		const result = await getDCNewLinkSettings(
			attributes,
			dynamicContentProps,
			'client-1'
		);

		expect(result).toEqual({
			disabled: true,
			url: 'https://new-url.com',
			title: 'https://new-url.com',
		});
	});
});
