import { resolveSelect } from '@wordpress/data';
import getDCMedia, { cache } from '@extensions/DC/getDCMedia';
import getDCEntity from '@extensions/DC/getDCEntity';
import { getACFFieldContent } from '@extensions/DC/getACFData';
import { getProductsContent } from '@extensions/DC/getWCContent';

jest.mock('@wordpress/data', () => ({
	resolveSelect: jest.fn(),
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(str => str),
}));

jest.mock('@extensions/DC/getDCEntity');
jest.mock('@extensions/DC/getACFData');
jest.mock('@extensions/DC/getWCContent');

describe('getDCMedia', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Clear cache before each test
		Object.keys(cache).forEach(key => delete cache[key]);
	});

	it('should handle user avatar', async () => {
		const mockUser = {
			avatar_urls: {
				24: 'https://example.com/avatar.jpg?s=24',
				48: 'https://example.com/avatar.jpg?s=48',
				96: 'https://example.com/avatar.jpg?s=96',
			},
		};
		getDCEntity.mockResolvedValue(mockUser);

		const result = await getDCMedia(
			{ type: 'users', field: 'avatar', mediaSize: 48 },
			'client-1'
		);

		expect(result).toEqual({
			url: 'https://example.com/avatar.jpg?s=48',
		});
	});

	it('should handle author avatar for posts', async () => {
		const mockPost = { author: 123 };
		const mockAuthor = {
			avatar_urls: {
				96: 'https://example.com/author.jpg?s=96',
			},
		};

		getDCEntity.mockResolvedValue(mockPost);
		resolveSelect.mockImplementation(() => ({
			getUser: () => Promise.resolve(mockAuthor),
		}));

		const result = await getDCMedia(
			{ type: 'posts', field: 'author_avatar', mediaSize: 48 },
			'client-1'
		);

		expect(result).toEqual({
			url: 'https://example.com/author.jpg?s=48',
		});
	});

	it('should handle ACF field with URL return format', async () => {
		const mockPost = { id: 123 };
		const mockACFField = {
			return_format: 'url',
			value: 'https://example.com/image.jpg',
		};

		getDCEntity.mockResolvedValue(mockPost);
		getACFFieldContent.mockResolvedValue(mockACFField);

		const result = await getDCMedia(
			{ type: 'posts', field: 'custom_image', source: 'acf' },
			'client-1'
		);

		expect(result).toEqual({ url: 'https://example.com/image.jpg' });
	});

	it('should handle ACF field with ID return format', async () => {
		const mockPost = { id: 123 };
		const mockACFField = {
			return_format: 'id',
			value: 456,
		};
		const mockMedia = {
			source_url: 'https://example.com/media.jpg',
			caption: { rendered: 'Test Caption' },
		};
		const mockGetEntityRecord = jest.fn().mockResolvedValue(mockMedia);

		getDCEntity.mockResolvedValue(mockPost);
		getACFFieldContent.mockResolvedValue(mockACFField);
		resolveSelect.mockImplementation(() => ({
			getEntityRecord: mockGetEntityRecord,
		}));

		const result = await getDCMedia(
			{ type: 'posts', field: 'custom_image', source: 'acf' },
			'client-1'
		);

		expect(result).toEqual({
			id: 456,
			url: 'https://example.com/media.jpg',
			caption: 'Test Caption',
		});
		expect(resolveSelect).toHaveBeenCalledWith('core');
		expect(mockGetEntityRecord).toHaveBeenCalledWith(
			'postType',
			'attachment',
			456
		);
	});

	it('should handle product media', async () => {
		const mockProduct = { id: 123 };
		const mockMedia = {
			source_url: 'https://example.com/product.jpg',
			caption: { rendered: 'Product Image' },
		};
		const mockGetEntityRecord = jest.fn().mockResolvedValue(mockMedia);

		getDCEntity.mockResolvedValue(mockProduct);
		getProductsContent.mockResolvedValue(456);
		resolveSelect.mockImplementation(() => ({
			getEntityRecord: mockGetEntityRecord,
		}));

		const result = await getDCMedia(
			{ type: 'products', field: 'featured_image' },
			'client-1'
		);

		expect(result).toEqual({
			id: 456,
			url: 'https://example.com/product.jpg',
			caption: 'Product Image',
		});
		expect(resolveSelect).toHaveBeenCalledWith('core');
		expect(mockGetEntityRecord).toHaveBeenCalledWith(
			'postType',
			'attachment',
			456
		);
	});

	it('should handle regular media', async () => {
		const mockPost = { featured_image: 789 };
		const mockMedia = {
			source_url: 'https://example.com/post.jpg',
			caption: { rendered: 'Post Image' },
		};
		const mockGetEntityRecord = jest.fn().mockResolvedValue(mockMedia);

		getDCEntity.mockResolvedValue(mockPost);
		resolveSelect.mockImplementation(() => ({
			getEntityRecord: mockGetEntityRecord,
		}));

		const result = await getDCMedia(
			{ type: 'posts', field: 'featured_image' },
			'client-1'
		);

		expect(result).toEqual({
			id: 789,
			url: 'https://example.com/post.jpg',
			caption: 'Post Image',
		});
		expect(resolveSelect).toHaveBeenCalledWith('core');
		expect(mockGetEntityRecord).toHaveBeenCalledWith(
			'postType',
			'attachment',
			789
		);
	});

	it('should return null when media fetch fails', async () => {
		const mockPost = { featured_image: 789 };
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		const mockGetEntityRecord = jest
			.fn()
			.mockRejectedValue(new Error('Media not found'));

		getDCEntity.mockResolvedValue(mockPost);
		resolveSelect.mockImplementation(() => ({
			getEntityRecord: mockGetEntityRecord,
		}));

		const result = await getDCMedia(
			{ type: 'posts', field: 'featured_image' },
			'client-1'
		);

		expect(result).toBeNull();
		expect(consoleSpy).toHaveBeenCalled();
		expect(resolveSelect).toHaveBeenCalledWith('core');
		expect(mockGetEntityRecord).toHaveBeenCalledWith(
			'postType',
			'attachment',
			789
		);
		consoleSpy.mockRestore();
	});

	it('should cache entity data used by media resolution', async () => {
		const mockPost = { featured_image: 789 };
		const mockMedia = {
			source_url: 'https://example.com/post.jpg',
			caption: { rendered: 'Post Image' },
		};
		const mockGetEntityRecord = jest.fn().mockResolvedValue(mockMedia);

		getDCEntity.mockResolvedValueOnce(mockPost);
		resolveSelect.mockImplementation(() => ({
			getEntityRecord: mockGetEntityRecord,
		}));

		// First call
		const result1 = await getDCMedia(
			{ type: 'posts', field: 'featured_image' },
			'client-1'
		);

		// Second call should use cache
		const result2 = await getDCMedia(
			{ type: 'posts', field: 'featured_image' },
			'client-1'
		);

		expect(result1).toEqual(result2);
		expect(getDCEntity).toHaveBeenCalledTimes(1);
		expect(resolveSelect).toHaveBeenCalledWith('core');
		expect(mockGetEntityRecord).toHaveBeenCalledWith(
			'postType',
			'attachment',
			789
		);
		expect(mockGetEntityRecord).toHaveBeenCalledTimes(2);
	});

	it('should return null when no data is available', async () => {
		getDCEntity.mockResolvedValue(null);

		const result = await getDCMedia(
			{ type: 'posts', field: 'featured_image' },
			'client-1'
		);

		expect(result).toBeNull();
	});
});
