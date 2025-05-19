/**
 * External dependencies
 */
import { jest } from '@jest/globals';

/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCOptions, {
	getIdOptions,
	clearIdOptionsCache,
} from '@extensions/DC/getDCOptions';

// Mock WordPress dependencies
jest.mock('@wordpress/data', () => ({
	resolveSelect: jest.fn(),
	select: jest.fn(),
}));

jest.mock('@wordpress/core-data', () => ({
	store: 'core',
}));

// Mock utils
jest.mock('@extensions/DC/utils', () => ({
	getFields: jest.fn(() => [{ value: 'title' }]),
	limitString: jest.fn(str => str),
	getCurrentTemplateSlug: jest.fn(() => 'single'),
}));

// Mock DC constants
jest.mock('@extensions/DC/constants', () => ({
	idTypes: [
		'posts',
		'pages',
		'users',
		'categories',
		'tags',
		'media',
		'products',
		'product_categories',
		'product_tags',
	],
	orderByRelations: ['by-category'],
	idOptionByField: {
		posts: 'title',
		pages: 'title',
		media: 'title',
		products: 'title',
		users: 'name',
	},
}));

describe('getIdOptions', () => {
	let mockGetEntityRecords;
	let mockGetUsers;

	beforeEach(() => {
		jest.clearAllMocks();
		clearIdOptionsCache();
		localStorage.clear();

		// Reset the timestamp to control cache testing
		jest.spyOn(Date, 'now').mockImplementation(() => 1000);

		// Set up commonly used mocks
		mockGetEntityRecords = jest.fn();
		mockGetUsers = jest.fn();

		resolveSelect.mockReturnValue({
			getEntityRecords: mockGetEntityRecords,
			getUsers: mockGetUsers,
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns false for invalid type', async () => {
		const result = await getIdOptions(
			'invalid-type',
			'by-id',
			null,
			false,
			false
		);
		expect(result).toBe(false);
	});

	it('fetches posts correctly', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		const result = await getIdOptions('posts', 'by-id', null, false, false);

		expect(mockGetEntityRecords.mock.calls[0]).toMatchSnapshot();
		expect(result).toEqual(mockPosts);
	});

	it('uses cache when available', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		// First call should fetch data
		await getIdOptions('posts', 'by-id', null, false, false);

		// Second call should use cache
		await getIdOptions('posts', 'by-id', null, false, false);

		// Should only have been called once
		expect(mockGetEntityRecords).toHaveBeenCalledTimes(1);
	});

	it('fetches new data when cache expires', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		// First call
		await getIdOptions('posts', 'by-id', null, false, false);

		// Simulate cache expiration (5 minutes + 1 ms)
		jest.spyOn(Date, 'now').mockImplementation(
			() => 1000 + 5 * 60 * 1000 + 1
		);

		// Second call should fetch again
		await getIdOptions('posts', 'by-id', null, false, false);

		expect(mockGetEntityRecords).toHaveBeenCalledTimes(2);
	});

	it('fetches categories correctly', async () => {
		const mockCategories = [
			{ id: 1, name: 'Category 1' },
			{ id: 2, name: 'Category 2' },
		];

		mockGetEntityRecords.mockResolvedValue(mockCategories);

		const result = await getIdOptions(
			'categories',
			'by-id',
			null,
			false,
			false
		);

		expect(mockGetEntityRecords.mock.calls[0]).toMatchSnapshot();
		expect(result).toEqual(mockCategories);
	});

	it('fetches users correctly', async () => {
		const mockUsers = [
			{ id: 1, name: 'User 1' },
			{ id: 2, name: 'User 2' },
		];

		mockGetUsers.mockResolvedValue(mockUsers);

		const result = await getIdOptions('users', 'by-id', null, false, false);

		expect(result).toEqual(mockUsers);
	});

	it('handles custom post types correctly', async () => {
		const mockCustomPosts = [
			{ id: 1, title: { rendered: 'Custom Post 1' } },
			{ id: 2, title: { rendered: 'Custom Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockCustomPosts);

		const result = await getIdOptions(
			'custom-type',
			'by-id',
			null,
			true,
			false
		);

		expect(mockGetEntityRecords.mock.calls[0]).toMatchSnapshot();
		expect(result).toEqual(mockCustomPosts);
	});

	it('handles custom taxonomies correctly', async () => {
		const mockCustomTaxonomy = [
			{ id: 1, name: 'Custom Tax 1' },
			{ id: 2, name: 'Custom Tax 2' },
		];

		mockGetEntityRecords.mockResolvedValue(mockCustomTaxonomy);

		const result = await getIdOptions(
			'custom-tax',
			'by-id',
			null,
			false,
			true
		);

		expect(mockGetEntityRecords.mock.calls[0]).toMatchSnapshot();
		expect(result).toEqual(mockCustomTaxonomy);
	});

	it('handles by-custom-taxonomy relation correctly', async () => {
		const mockTaxonomyTerms = [
			{ id: 1, name: 'Term 1' },
			{ id: 2, name: 'Term 2' },
		];

		mockGetEntityRecords.mockResolvedValue(mockTaxonomyTerms);

		const result = await getIdOptions(
			'posts',
			'by-custom-taxonomy-product_cat',
			null,
			false,
			false
		);

		expect(mockGetEntityRecords.mock.calls[0]).toMatchSnapshot();
		expect(result).toEqual(mockTaxonomyTerms);
	});

	it('handles errors gracefully', async () => {
		mockGetEntityRecords.mockRejectedValue(new Error('API error'));

		const result = await getIdOptions('posts', 'by-id', null, false, false);

		expect(result).toEqual([]);
	});

	it('handles pagination with correct per_page parameter', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		await getIdOptions('posts', 'by-date', null, false, false, 5);

		expect(mockGetEntityRecords.mock.calls[0]).toMatchSnapshot();
	});
});

describe('getDCOptions', () => {
	let mockGetEntityRecords;

	beforeEach(() => {
		jest.clearAllMocks();
		clearIdOptionsCache();

		// Setup mock data for custom post types/taxonomies
		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: jest
						.fn()
						.mockReturnValue(['custom-post-type']),
					getCustomTaxonomies: jest
						.fn()
						.mockReturnValue(['custom-taxonomy']),
				};
			}
			return {};
		});

		// Mock entity records for getIdOptions to use
		mockGetEntityRecords = jest.fn();
		resolveSelect.mockReturnValue({
			getEntityRecords: mockGetEntityRecords,
			getUsers: jest.fn().mockResolvedValue([
				{ id: 1, name: 'User 1' },
				{ id: 2, name: 'User 2' },
			]),
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('formats post options correctly', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		const params = {
			type: 'posts',
			id: 1,
			field: 'title',
			relation: 'by-id',
			author: null,
		};

		const result = await getDCOptions(params, [], 'text');

		expect(result.newPostIdOptions).toEqual([
			{ label: '1 - Post 1', value: 1 },
			{ label: '2 - Post 2', value: 2 },
		]);
	});

	it('formats category options correctly', async () => {
		const mockCategories = [
			{ id: 1, name: 'Category 1' },
			{ id: 2, name: 'Category 2' },
		];

		mockGetEntityRecords.mockResolvedValue(mockCategories);

		const params = {
			type: 'categories',
			id: 1,
			field: 'name',
			relation: 'by-id',
			author: null,
		};

		const result = await getDCOptions(params, [], 'text');

		expect(result.newPostIdOptions).toEqual([
			{ label: 'Category 1', value: 1 },
			{ label: 'Category 2', value: 2 },
		]);
	});

	it('sets default ID when current ID is not in options', async () => {
		const mockPosts = [
			{ id: 2, title: { rendered: 'Post 2' } },
			{ id: 3, title: { rendered: 'Post 3' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		const params = {
			type: 'posts',
			id: 1, // This ID doesn't exist in the mock data
			field: 'title',
			relation: 'by-id',
			author: null,
		};

		const result = await getDCOptions(params, [], 'text');

		// Should set the ID to the first available one
		expect(result.newValues).toHaveProperty('dc-id', 2);
	});

	it('changes relation for orderByRelations when no options', async () => {
		mockGetEntityRecords.mockResolvedValue([]);

		const params = {
			type: 'posts',
			id: 1,
			field: 'title',
			relation: 'by-category',
			author: null,
		};

		const result = await getDCOptions(
			params,
			[{ label: 'Category 1', value: 1 }],
			'text'
		);

		expect(result.newValues).toEqual({
			'dc-relation': 'by-date',
			'dc-order': 'desc',
		});
	});

	it('handles context loop mode correctly', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		const params = {
			type: 'posts',
			id: undefined, // ID that doesn't exist on block
			field: 'title',
			relation: 'by-id',
			author: null,
		};

		const result = await getDCOptions(params, [], 'text', true, {
			'cl-status': true,
		});

		// In CL mode with cl-status true, should set ID to undefined if doesn't exist on block
		expect(result.newValues).toHaveProperty('cl-id', undefined);
	});

	it('returns null when post ID options are unchanged', async () => {
		const mockPosts = [
			{ id: 1, title: { rendered: 'Post 1' } },
			{ id: 2, title: { rendered: 'Post 2' } },
		];

		mockGetEntityRecords.mockResolvedValue(mockPosts);

		const existingPostIdOptions = [
			{ label: '1 - Post 1', value: 1 },
			{ label: '2 - Post 2', value: 2 },
		];

		const params = {
			type: 'posts',
			id: 1,
			field: 'title',
			relation: 'by-id',
			author: null,
		};

		const result = await getDCOptions(
			params,
			existingPostIdOptions,
			'text'
		);

		// Should return null when options haven't changed
		expect(result).toBeNull();
	});
});
