/**
 * WordPress dependencies
 */
import { select, resolveSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCEntity from '@extensions/DC/getDCEntity';
import getDCErrors from '@extensions/DC/getDCErrors';
import {
	getDCOrder,
	getRelationKeyForId,
	getCurrentTemplateSlug,
	getPostBySlug,
} from '@extensions/DC/utils';
import { getCartData } from '@extensions/DC/getWooCommerceData';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
	resolveSelect: jest.fn(),
}));

jest.mock('@extensions/DC/getDCErrors', () => jest.fn());

jest.mock('@extensions/DC/utils', () => ({
	getDCOrder: jest.fn(),
	getRelationKeyForId: jest.fn(),
	getCurrentTemplateSlug: jest.fn(),
	getPostBySlug: jest.fn(),
}));

jest.mock('@extensions/DC/getWooCommerceData', () => ({
	getCartData: jest.fn(),
}));

describe('getDCEntity', () => {
	const mockPost = {
		id: 123,
		title: { rendered: 'Test Post' },
		content: { rendered: '<p>Test content</p>' },
		excerpt: { rendered: '<p>Test excerpt</p>' },
		link: '/test-post/',
	};

	const mockUser = {
		id: 1,
		name: 'Test User',
		slug: 'test-user',
	};

	const mockCategory = {
		id: 5,
		name: 'Test Category',
		slug: 'test-category',
	};

	const mockTag = {
		id: 10,
		name: 'Test Tag',
		slug: 'test-tag',
	};

	const mockSettingsData = {
		title: 'Site Title',
		description: 'Site Description',
	};

	const mockCartData = {
		items: [],
		total: 0,
	};

	beforeEach(() => {
		jest.clearAllMocks();

		getDCErrors.mockReturnValue(false);
		getCurrentTemplateSlug.mockReturnValue('single');
		getDCOrder.mockImplementation((relation, orderBy) => {
			if (relation === 'by-date') return 'date';
			if (relation === 'alphabetical') return 'title';
			return null;
		});
		getRelationKeyForId.mockReturnValue(null);
		getPostBySlug.mockResolvedValue(null);
		getCartData.mockResolvedValue(mockCartData);

		const selectStores = {
			'maxiBlocks/dynamic-content': {
				getCustomPostTypes: () => [
					'products',
					'testimonials',
					'wp_font_family',
				],
				getCustomTaxonomies: () => ['category', 'product_cat'],
				getRelationTypes: () => ['posts', 'pages', 'products'],
				getOrderTypes: () => ['posts', 'pages', 'products'],
			},
			core: {
				getPostType: () => ({
					taxonomies: ['category', 'post_tag'],
				}),
				getTaxonomy: () => mockCategory,
				getCurrentUser: () => ({ id: 1 }),
				getCurrentPostId: () => 123,
			},
			'core/edit-site': {},
			'core/editor': {
				getCurrentPostId: () => 123,
			},
		};
		select.mockImplementation(store => {
			return selectStores[store];
		});

		const resolveSelectStores = {
			core: {
				getEntityRecords: jest.fn().mockResolvedValue([mockPost]),
				getEntityRecord: jest.fn().mockResolvedValue(mockPost),
				getEditedEntityRecord: jest
					.fn()
					.mockResolvedValue(mockSettingsData),
				getUsers: jest.fn().mockResolvedValue([mockUser]),
				getUser: jest.fn().mockResolvedValue(mockUser),
				getPostType: jest.fn().mockResolvedValue({
					taxonomies: ['category', 'post_tag'],
				}),
				getTaxonomies: jest
					.fn()
					.mockResolvedValue([
						{ slug: 'category' },
						{ slug: 'post_tag' },
					]),
			},
		};
		resolveSelect.mockImplementation(store => {
			return resolveSelectStores[store];
		});
	});

	it('should return content error when there is an error', async () => {
		const errorMessage = 'This is an error message';
		getDCErrors.mockReturnValue(errorMessage);

		const dataRequest = {
			type: 'posts',
			error: 'next',
			show: 'next',
			relation: 'by-id',
		};

		const result = await getDCEntity(dataRequest);
		expect(result).toBe(errorMessage);
		expect(getDCErrors).toHaveBeenCalledWith(
			'posts',
			'next',
			'next',
			'by-id'
		);
	});

	it('should get user when type is users and relation is by-id', async () => {
		const dataRequest = {
			type: 'users',
			id: 1,
			relation: 'by-id',
		};

		const result = await getDCEntity(dataRequest);

		expect(result).toEqual(mockUser);
		expect(resolveSelect('core').getUser).toHaveBeenCalledWith(1);
	});

	it('should get user based on author id when specified', async () => {
		const dataRequest = {
			type: 'users',
			id: 2,
			author: 5,
			relation: 'by-id',
		};

		await getDCEntity(dataRequest);

		expect(resolveSelect('core').getUser).toHaveBeenCalledWith(5);
	});

	it('should get random user when relation is random', async () => {
		const dataRequest = {
			type: 'users',
			relation: 'random',
			accumulator: 0.5,
		};

		const users = [
			{ id: 1, name: 'User 1' },
			{ id: 2, name: 'User 2' },
			{ id: 3, name: 'User 3' },
		];

		const mockGetUsers = jest.fn().mockResolvedValue(users);
		resolveSelect.mockImplementation(store => {
			if (store === 'core') {
				return {
					getUsers: mockGetUsers,
				};
			}
			return null;
		});

		const result = await getDCEntity(dataRequest);

		expect(resolveSelect('core').getUsers).toHaveBeenCalledWith({
			who: 'authors',
			per_page: 100,
			hide_empty: false,
		});
		expect(users).toContain(result);
	});

	it('should get users by date', async () => {
		const dataRequest = {
			type: 'users',
			relation: 'by-date',
			order: 'desc',
			accumulator: 2,
		};

		const users = [
			{ id: 1, name: 'User 1' },
			{ id: 2, name: 'User 2' },
			{ id: 3, name: 'User 3' },
		];

		const mockGetUsers = jest.fn().mockResolvedValue(users);
		resolveSelect.mockImplementation(store => {
			if (store === 'core') {
				return {
					getUsers: mockGetUsers,
				};
			}
			return null;
		});

		const result = await getDCEntity(dataRequest);

		expect(resolveSelect('core').getUsers).toHaveBeenCalledWith({
			who: 'authors',
			per_page: 3,
			hide_empty: false,
			order: 'desc',
			orderby: 'registered_date',
		});
		expect(result).toEqual(users[2]);
	});

	it('should get random entity when relation is random', async () => {
		const dataRequest = {
			type: 'posts',
			relation: 'random',
			accumulator: 0.7,
		};

		const posts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
			{ id: 3, title: { rendered: 'Post 3' } },
		];

		const mockGetEntityRecords = jest.fn().mockResolvedValue(posts);
		resolveSelect.mockImplementation(store => {
			if (store === 'core') {
				return {
					getEntityRecords: mockGetEntityRecords,
				};
			}
			return null;
		});

		const result = await getDCEntity(dataRequest);

		expect(resolveSelect('core').getEntityRecords).toHaveBeenCalledWith(
			'postType',
			'post',
			{
				per_page: 100,
				hide_empty: false,
			}
		);
		expect(posts).toContain(result);
	});

	it('should get settings when type is settings', async () => {
		const dataRequest = {
			type: 'settings',
			relation: 'by-id',
		};

		const result = await getDCEntity(dataRequest);

		expect(result).toEqual(mockSettingsData);
		expect(
			resolveSelect('core').getEditedEntityRecord
		).toHaveBeenCalledWith('root', 'site');
	});

	it('should get cart data when type is cart', async () => {
		const dataRequest = {
			type: 'cart',
			relation: 'by-id',
		};

		const result = await getDCEntity(dataRequest);

		expect(result).toEqual(mockCartData);
		expect(getCartData).toHaveBeenCalled();
	});

	it('should get ordered entities', async () => {
		getRelationKeyForId.mockReturnValue('author');
		getDCOrder.mockReturnValue('date');

		const dataRequest = {
			type: 'posts',
			relation: 'by-author',
			id: 1,
			order: 'desc',
			orderBy: 'by-date',
			accumulator: 0,
		};

		const result = await getDCEntity(dataRequest);

		expect(getDCOrder).toHaveBeenCalledWith('by-author', 'by-date');
		expect(getRelationKeyForId).toHaveBeenCalledWith('by-author', 'posts');
		expect(resolveSelect('core').getEntityRecords).toHaveBeenCalledWith(
			'postType',
			'post',
			{
				per_page: 1,
				order: 'desc',
				orderby: 'date',
				offset: 0,
				author: 1,
			}
		);
		expect(result).toEqual(mockPost);
	});

	it('should handle current relation in FSE for single posts', async () => {
		select.mockImplementation(store => {
			if (store === 'core/edit-site') {
				return {}; // Exists
			}
			return select.mock.results[0].value;
		});

		getCurrentTemplateSlug.mockReturnValue('single-post-test-post');
		getPostBySlug.mockResolvedValue(mockPost);

		const dataRequest = {
			type: 'posts',
			relation: 'current',
		};

		const result = await getDCEntity(dataRequest);

		expect(getCurrentTemplateSlug).toHaveBeenCalled();
		expect(getPostBySlug).toHaveBeenCalledWith('test-post');
		expect(result).toEqual(mockPost);
	});

	it('should get taxonomy terms by ID', async () => {
		const dataRequest = {
			type: 'tags',
			id: 10,
			relation: 'by-id',
		};

		const mockGetEntityRecords = jest.fn().mockResolvedValue([mockTag]);
		resolveSelect.mockImplementation(store => {
			if (store === 'core') {
				return {
					getEntityRecords: mockGetEntityRecords,
				};
			}
			return null;
		});

		const result = await getDCEntity(dataRequest);

		expect(resolveSelect('core').getEntityRecords).toHaveBeenCalledWith(
			'taxonomy',
			'post_tag',
			{
				per_page: 1,
				hide_empty: false,
				include: 10,
			}
		);
		expect(result).toEqual(mockTag);
	});

	it('should cache and reuse existing entities', async () => {
		getRelationKeyForId.mockReturnValue('author');

		await getDCEntity({
			type: 'posts',
			relation: 'by-author',
			id: 1,
		});

		resolveSelect.mockClear();

		await getDCEntity({
			type: 'posts',
			relation: 'by-author',
			id: 1,
		});

		expect(resolveSelect('core').getEntityRecord.mock.calls.length).toBe(0);
	});

	it('should return null when entity does not exist', async () => {
		resolveSelect.mockImplementation(store => {
			if (store === 'core') {
				return {
					getEntityRecords: jest.fn().mockResolvedValue([]),
					getEntityRecord: jest.fn().mockResolvedValue(null),
				};
			}
			return null;
		});

		const dataRequest = {
			type: 'posts',
			id: 999,
			relation: 'by-id',
		};

		const result = await getDCEntity(dataRequest);

		expect(result).toBeNull();
	});
});
