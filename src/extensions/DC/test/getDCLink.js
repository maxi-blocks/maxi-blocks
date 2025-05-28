import { resolveSelect, select } from '@wordpress/data';
import getDCLink, { cache } from '@extensions/DC/getDCLink';
import getDCEntity from '@extensions/DC/getDCEntity';
import { getCartUrl, getProductData } from '@extensions/DC/getWooCommerceData';
import { inlineLinkFields } from '@extensions/DC/constants';
import { getCurrentTemplateSlug, getPostBySlug } from '@extensions/DC/utils';

jest.mock('@wordpress/data', () => ({
	resolveSelect: jest.fn(),
	select: jest.fn(),
}));

jest.mock('@extensions/DC/getDCEntity');
jest.mock('@extensions/DC/getWooCommerceData');
jest.mock('@extensions/DC/utils');

describe('getDCLink', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Clear cache before each test
		Object.keys(cache).forEach(key => delete cache[key]);
	});

	it('should return cart URL for cart type', async () => {
		const mockCartUrl = 'https://example.com/cart';
		getCartUrl.mockResolvedValue(mockCartUrl);

		const result = await getDCLink({ type: 'cart' }, 'client-1');
		expect(result).toBe(mockCartUrl);
	});

	it('should handle author link target', async () => {
		const mockUserLink = 'https://example.com/author/john';
		resolveSelect.mockImplementation(() => ({
			getUsers: () => Promise.resolve([{ link: mockUserLink }]),
		}));

		const result = await getDCLink(
			{ type: 'posts', linkTarget: 'author', author: 123 },
			'client-1'
		);
		expect(result).toBe(mockUserLink);
	});

	it('should handle current author in FSE template', async () => {
		const mockPost = { author: 456 };
		const mockUserLink = 'https://example.com/author/jane';

		select.mockImplementation(() => ({
			'core/edit-site': {},
		}));
		getCurrentTemplateSlug.mockReturnValue('single-post-test');
		getPostBySlug.mockResolvedValue(mockPost);
		resolveSelect.mockImplementation(() => ({
			getUsers: () => Promise.resolve([{ link: mockUserLink }]),
		}));

		const result = await getDCLink(
			{ type: 'posts', linkTarget: 'author', relation: 'current' },
			'client-1'
		);
		expect(result).toBe(mockUserLink);
	});

	it('should handle author email link target', async () => {
		const mockUser = { email: 'test@example.com' };
		resolveSelect.mockImplementation(() => ({
			getUser: () => Promise.resolve(mockUser),
		}));

		const result = await getDCLink(
			{ type: 'users', linkTarget: 'author_email', author: 123 },
			'client-1'
		);
		expect(result).toBe('test@example.com');
	});

	it('should handle author site link target', async () => {
		const mockUser = { url: 'https://example.com' };
		resolveSelect.mockImplementation(() => ({
			getUser: () => Promise.resolve(mockUser),
		}));

		const result = await getDCLink(
			{ type: 'users', linkTarget: 'author_site', author: 123 },
			'client-1'
		);
		expect(result).toBe('https://example.com');
	});

	it('should handle default user link', async () => {
		getDCEntity.mockResolvedValue({
			link: 'https://example.com/author/john',
			author: { link: 'https://example.com/author/john' },
		});

		const result = await getDCLink(
			{ type: 'users', linkTarget: 'entity', author: 123 },
			'client-1'
		);
		expect(result).toBe('https://example.com/author/john');
	});

	it('should return null for missing author email', async () => {
		const mockUser = { email: null };
		resolveSelect.mockImplementation(() => ({
			getUser: () => Promise.resolve(mockUser),
		}));

		const result = await getDCLink(
			{ type: 'users', linkTarget: 'author_email', author: 123 },
			'client-1'
		);
		expect(result).toBeNull();
	});

	it('should return null for missing author site', async () => {
		const mockUser = { url: null };
		resolveSelect.mockImplementation(() => ({
			getUser: () => Promise.resolve(mockUser),
		}));

		const result = await getDCLink(
			{ type: 'users', linkTarget: 'author_site', author: 123 },
			'client-1'
		);
		expect(result).toBeNull();
	});

	it('should return null for missing default user link', async () => {
		getDCEntity.mockResolvedValue({ link: null });

		const result = await getDCLink(
			{ type: 'users', linkTarget: 'entity', author: 123 },
			'client-1'
		);
		expect(result).toBeNull();
	});

	it('should return "Multiple Links" for inline link fields', async () => {
		const result = await getDCLink(
			{ type: 'posts', linkTarget: inlineLinkFields[0] },
			'client-1'
		);
		expect(result).toBe('Multiple Links');
	});

	it('should return "Multiple Links" for custom taxonomies', async () => {
		select.mockImplementation(() => ({
			getCustomTaxonomies: () => ['custom_tax'],
		}));

		const result = await getDCLink(
			{ type: 'posts', linkTarget: 'custom_tax' },
			'client-1'
		);
		expect(result).toBe('Multiple Links');
	});

	it('should handle product links', async () => {
		const mockProductData = {
			permalink: 'https://example.com/product/test',
		};
		getDCEntity.mockResolvedValue({ id: 789 });
		getProductData.mockResolvedValue(mockProductData);

		const result = await getDCLink(
			{ type: 'products', linkTarget: 'entity' },
			'client-1'
		);
		expect(result).toBe(mockProductData.permalink);
	});

	it('should handle add to cart product links', async () => {
		const mockSiteUrl = 'https://example.com';
		const mockAddToCartUrl = '/add-to-cart/789';
		const mockProductData = {
			add_to_cart: { url: mockAddToCartUrl },
		};

		select.mockImplementation(() => ({
			getSite: () => ({ url: mockSiteUrl }),
			getCustomTaxonomies: () => ['custom_tax'],
		}));
		getDCEntity.mockResolvedValue({ id: 789 });
		getProductData.mockResolvedValue(mockProductData);

		const result = await getDCLink(
			{ type: 'products', linkTarget: 'add_to_cart' },
			'client-1'
		);
		expect(result).toBe(`${mockSiteUrl}${mockAddToCartUrl}`);
	});

	it('should handle settings links', async () => {
		const mockSettingsData = { url: 'https://example.com/settings' };
		getDCEntity.mockResolvedValue(mockSettingsData);

		const result = await getDCLink(
			{ type: 'settings', linkTarget: 'entity' },
			'client-1'
		);
		expect(result).toBe(mockSettingsData.url);
	});

	it('should handle default entity links', async () => {
		const mockEntityData = { link: 'https://example.com/post/123' };
		getDCEntity.mockResolvedValue(mockEntityData);

		const result = await getDCLink(
			{ type: 'posts', linkTarget: 'entity' },
			'client-1'
		);
		expect(result).toBe(mockEntityData.link);
	});

	it('should return null when no data is available', async () => {
		getDCEntity.mockResolvedValue(null);

		const result = await getDCLink(
			{ type: 'posts', linkTarget: 'entity' },
			'client-1'
		);
		expect(result).toBeNull();
	});

	it('should cache links', async () => {
		getDCEntity.mockResolvedValueOnce({ link: 'test' });
		getDCEntity.mockResolvedValueOnce({ link: 'test2' });

		const result = await getDCLink(
			{ type: 'posts', linkTarget: 'entity' },
			'client-1'
		);
		expect(result).toBe('test');

		const cachedResult = await getDCLink(
			{ type: 'posts', linkTarget: 'entity' },
			'client-1'
		);
		expect(cachedResult).toBe('test');
	});
});
