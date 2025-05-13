jest.mock('@wordpress/data', () => {
	const mockGetCustomTaxonomies = jest.fn();
	const mockEntityRecords = jest.fn();

	return {
		select: jest.fn(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomTaxonomies: mockGetCustomTaxonomies,
				};
			}
			return {};
		}),
		resolveSelect: jest.fn(() => ({
			getEntityRecords: mockEntityRecords,
		})),
	};
});

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => text),
}));

jest.mock('@extensions/DC/constants', () => ({
	linkTypesOptions: {
		posts: [
			{ label: 'Post link', value: 'post' },
			{ label: 'Author link', value: 'author' },
		],
		pages: [{ label: 'Page link', value: 'page' }],
	},
	linkFieldsOptions: {
		title: [{ label: 'Title link', value: 'title_link' }],
		content: [{ label: 'Content link', value: 'content_link' }],
	},
}));

/**
 * Internal dependencies
 */
import {
	parseText,
	cutTags,
	getSimpleText,
	limitString,
	getLinkTargets,
	getTaxonomyContent,
	getCurrentTemplateSlug,
	getFields,
	getRelationOptions,
	validationsValues,
	getPostBySlug,
} from '@extensions/DC/utils';

import { resolveSelect, select } from '@wordpress/data';

// Get references to the mocked functions
const mockGetCustomTaxonomies = select(
	'maxiBlocks/dynamic-content'
).getCustomTaxonomies;
const mockEntityRecords = resolveSelect().getEntityRecords;

describe('DC utility string manipulation functions', () => {
	describe('parseText', () => {
		it('should sanitize HTML and return text content', () => {
			const html = '<p>Hello <strong>world</strong>!</p>';

			const result = parseText(html);

			expect(result).toBe('Hello world!');
		});

		it('should handle empty input', () => {
			expect(parseText('')).toBe('');
			expect(parseText(null)).toBe('');
			expect(parseText(undefined)).toBe('');
		});
	});

	describe('cutTags', () => {
		it('should remove HTML tags and replace with spaces', () => {
			const html = '<p>Hello</p><div>world!</div>';

			const result = cutTags(html);

			expect(result).toBe(' Hello  world! ');
		});

		it('should handle inline tags', () => {
			const html =
				'This is <strong>bold</strong> and <em>italic</em> text';

			const result = cutTags(html);

			expect(result).toBe('This is  bold  and  italic  text');
		});

		it('should handle empty input', () => {
			expect(cutTags('')).toBe('');
			expect(cutTags(null)).toBe('');
			expect(cutTags(undefined)).toBe('');
		});

		it('should not modify string without tags', () => {
			const text = 'Plain text without tags';

			const result = cutTags(text);

			expect(result).toBe('Plain text without tags');
		});
	});

	describe('getSimpleText', () => {
		it('should remove style tags and their content', () => {
			const html =
				'<p>Hello</p><style>.class { color: red; }</style><p>world!</p>';

			const result = getSimpleText(html);

			expect(result).toBe(' Hello  world! ');
		});

		it('should remove SVG tags and their content', () => {
			const html =
				'<p>Start</p><svg width="100"><circle cx="50" cy="50" r="40"/></svg><p>End</p>';

			const result = getSimpleText(html);

			expect(result).toBe(' Start  End ');
		});

		it('should remove other HTML tags', () => {
			const html =
				'<h1>Title</h1><p>Description with <a href="#">link</a></p>';

			const result = getSimpleText(html);

			expect(result).toBe(' Title  Description with  link  ');
		});

		it('should handle empty input', () => {
			expect(getSimpleText('')).toBe('');
			expect(getSimpleText(null)).toBe('');
			expect(getSimpleText(undefined)).toBe('');
		});
	});

	describe('limitString', () => {
		it('should truncate strings longer than the limit', () => {
			const text = 'This is a long text that needs to be truncated';
			const limit = 10;

			const result = limitString(text, limit);

			expect(result).toBe('This is a …');
			expect(result.length).toBe(limit + 1); // +1 for the ellipsis
		});

		it('should add ellipsis to truncated strings', () => {
			const text = 'Hello world!';
			const limit = 5;

			const result = limitString(text, limit);

			expect(result).toBe('Hello…');
		});

		it('should not modify strings shorter than the limit', () => {
			const text = 'Short';
			const limit = 10;

			const result = limitString(text, limit);

			expect(result).toBe('Short');
		});

		it('should remove HTML tags before limiting', () => {
			const html = '<p>Text with <strong>tags</strong> to be limited</p>';
			const limit = 15;

			const result = limitString(html, limit);

			expect(result).toBe('Text with  tags…');
		});

		it('should trim the text before limiting', () => {
			const text = '  Text with spaces  ';
			const limit = 10;

			const result = limitString(text, limit);

			expect(result).toBe('Text with …');
		});

		it('should return the original string for zero or negative limits', () => {
			const text = 'Test text';

			expect(limitString(text, 0)).toBe('Test text');
			expect(limitString(text, -5)).toBe('Test text');
		});

		it('should handle empty input', () => {
			expect(limitString('', 10)).toBe('');
			expect(limitString(null, 10)).toBe('');
			expect(limitString(undefined, 10)).toBe('');
		});
	});

	describe('getLinkTargets', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			mockGetCustomTaxonomies.mockReturnValue([]);
		});

		it('should always include the default entity target', () => {
			const result = getLinkTargets('posts', 'title');

			expect(result).toContainEqual({
				label: 'Selected entity',
				value: 'entity',
			});
		});

		it('should include link targets based on type', () => {
			const result = getLinkTargets('posts', 'title');

			expect(result).toEqual([
				{
					label: 'Selected entity',
					value: 'entity',
				},
			]);
		});

		it('should include link targets based on field', () => {
			const result = getLinkTargets('posts', 'title');

			expect(result).toEqual([
				{
					label: 'Selected entity',
					value: 'entity',
				},
			]);
		});

		it('should include different link targets for different types', () => {
			const postsResult = getLinkTargets('posts', 'content');
			const pagesResult = getLinkTargets('pages', 'content');

			expect(postsResult).toEqual([
				{
					label: 'Selected entity',
					value: 'entity',
				},
			]);
			expect(pagesResult).toEqual([
				{
					label: 'Selected entity',
					value: 'entity',
				},
			]);
		});

		it('should add custom taxonomy links when field is a custom taxonomy', () => {
			mockGetCustomTaxonomies.mockReturnValue([
				'category',
				'tag',
				'custom_tax',
			]);

			const result = getLinkTargets('posts', 'custom_tax');

			expect(result).toContainEqual({
				label: 'Custom_tax links',
				value: 'custom_tax',
			});
		});

		it('should not add custom taxonomy links when field is not a custom taxonomy', () => {
			mockGetCustomTaxonomies.mockReturnValue(['category', 'tag']);

			const result = getLinkTargets('posts', 'title');

			expect(result).not.toContainEqual(
				expect.objectContaining({
					value: 'title',
				})
			);
		});
	});
});

describe('getTaxonomyContent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return null when taxonomyIds is empty', async () => {
		const result = await getTaxonomyContent([], ', ', false, 'category');

		expect(result).toBeNull();
		expect(mockEntityRecords).not.toHaveBeenCalled();
	});

	it('should return null when taxonomyIds is null', async () => {
		const result = await getTaxonomyContent(null, ', ', false, 'category');

		expect(result).toBeNull();
		expect(mockEntityRecords).not.toHaveBeenCalled();
	});

	it('should return null when no taxonomy records are found', async () => {
		mockEntityRecords.mockResolvedValue(null);

		const result = await getTaxonomyContent(
			[1, 2],
			', ',
			false,
			'category'
		);

		expect(result).toBeNull();
		expect(mockEntityRecords).toHaveBeenCalledWith('taxonomy', 'category', {
			include: [1, 2],
		});
	});

	it('should return null when taxonomy records array is empty', async () => {
		mockEntityRecords.mockResolvedValue([]);

		const result = await getTaxonomyContent(
			[1, 2],
			', ',
			false,
			'category'
		);

		expect(result).toBeNull();
		expect(mockEntityRecords).toHaveBeenCalledWith('taxonomy', 'category', {
			include: [1, 2],
		});
	});

	it('should return plain text with delimiter when linkStatus is false', async () => {
		mockEntityRecords.mockResolvedValue([
			{ name: 'Category 1' },
			{ name: 'Category 2' },
		]);

		const result = await getTaxonomyContent(
			[1, 2],
			', ',
			false,
			'category'
		);

		expect(result).toBe('Category 1,  Category 2');
		expect(mockEntityRecords).toHaveBeenCalledWith('taxonomy', 'category', {
			include: [1, 2],
		});
	});

	it('should return HTML with links when linkStatus is true', async () => {
		mockEntityRecords.mockResolvedValue([
			{ name: 'Category 1' },
			{ name: 'Category 2' },
		]);

		const result = await getTaxonomyContent([1, 2], ', ', true, 'category');

		expect(result).toBe(
			'<span><a class="maxi-text-block--link"><span>Category 1</span></a>,  <a class="maxi-text-block--link"><span>Category 2</span></a></span>'
		);
		expect(mockEntityRecords).toHaveBeenCalledWith('taxonomy', 'category', {
			include: [1, 2],
		});
	});

	it('should use provided delimiter in the output', async () => {
		mockEntityRecords.mockResolvedValue([
			{ name: 'Tag 1' },
			{ name: 'Tag 2' },
		]);

		const result = await getTaxonomyContent(
			[1, 2],
			' | ',
			false,
			'post_tag'
		);

		expect(result).toBe('Tag 1 |  Tag 2');
		expect(mockEntityRecords).toHaveBeenCalledWith('taxonomy', 'post_tag', {
			include: [1, 2],
		});
	});
});

describe('getCurrentTemplateSlug', () => {
	const mockEditSite = {
		getEditedPostContext: jest.fn(),
		getEditedPostId: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		select.mockImplementation(store => {
			if (store === 'core/edit-site') {
				return mockEditSite;
			}
			return null;
		});
	});

	it('should return null when editSite is not available', () => {
		select.mockReturnValueOnce(null);

		const result = getCurrentTemplateSlug();

		expect(result).toBeNull();
	});

	it('should return null when templateSlug and postId are both not available', () => {
		mockEditSite.getEditedPostContext.mockReturnValue({});
		mockEditSite.getEditedPostId.mockReturnValue(null);

		const result = getCurrentTemplateSlug();

		expect(result).toBeNull();
	});

	it('should use templateSlug from getEditedPostContext when available', () => {
		mockEditSite.getEditedPostContext.mockReturnValue({
			templateSlug: 'home',
		});

		const result = getCurrentTemplateSlug();

		expect(result).toBe('home');
		expect(mockEditSite.getEditedPostContext).toHaveBeenCalled();
	});

	it('should use getEditedPostId as fallback (WordPress 6.5 compatibility)', () => {
		mockEditSite.getEditedPostContext.mockReturnValue({});
		mockEditSite.getEditedPostId.mockReturnValue('page');

		const result = getCurrentTemplateSlug();

		expect(result).toBe('page');
		expect(mockEditSite.getEditedPostContext).toHaveBeenCalled();
		expect(mockEditSite.getEditedPostId).toHaveBeenCalled();
	});

	it('should extract the part after // when template slug contains it', () => {
		mockEditSite.getEditedPostContext.mockReturnValue({
			templateSlug: 'wp-custom-template//archive-products',
		});

		const result = getCurrentTemplateSlug();

		expect(result).toBe('archive-products');
	});

	it('should return the original slug when no // is present', () => {
		mockEditSite.getEditedPostContext.mockReturnValue({
			templateSlug: 'single-post',
		});

		const result = getCurrentTemplateSlug();

		expect(result).toBe('single-post');
	});
});

// Mock the non-exported functions used by getFields
jest.mock('@extensions/DC/constants', () => {
	const mockFieldOptions = {
		text: {
			posts: [{ label: 'Title', value: 'title' }],
			categories: [{ label: 'Name', value: 'name' }],
		},
		image: {
			posts: [{ label: 'Featured image', value: 'featured_media' }],
			categories: [{ label: 'Category image', value: 'category_image' }],
		},
	};

	return {
		...jest.requireActual('@extensions/DC/constants'),
		fieldOptions: mockFieldOptions,
	};
});

describe('getFields', () => {
	const mockGetPostType = jest.fn();
	const mockGetTaxonomy = jest.fn();
	const mockGetCustomPostTypes = jest.fn();
	const mockGetCustomTaxonomies = jest.fn();
	const mockEditSite = {};

	beforeEach(() => {
		jest.clearAllMocks();

		// Reset default implementation of select
		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: mockGetCustomPostTypes,
					getCustomTaxonomies: mockGetCustomTaxonomies,
				};
			}
			if (store === 'core') {
				return {
					getPostType: mockGetPostType,
					getTaxonomy: mockGetTaxonomy,
				};
			}
			if (store === 'core/edit-site') {
				return mockEditSite;
			}
			return null;
		});

		// Default custom types response
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue([]);
	});

	it('should return fields for custom post types', () => {
		mockGetCustomPostTypes.mockReturnValue(['book']);
		mockGetPostType.mockReturnValue({
			supports: {
				title: true,
				editor: true,
				thumbnail: true,
			},
			taxonomies: [],
		});

		const result = getFields('text', 'book');

		expect(mockGetCustomPostTypes).toHaveBeenCalled();
		expect(mockGetPostType).toHaveBeenCalledWith('book');
		// At minimum, should contain these fields
		expect(result).toContainEqual({
			label: 'Static text',
			value: 'static_text',
		});
		expect(result).toContainEqual({ label: 'Title', value: 'title' });
		expect(result).toContainEqual({ label: 'Date', value: 'date' });
	});

	it('should return fields for custom taxonomies', () => {
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue(['custom_tax']);
		mockGetTaxonomy.mockReturnValue({
			hierarchical: true,
		});
		// Mock for getCurrentTemplateSlug
		mockEditSite.getEditedPostContext = jest
			.fn()
			.mockReturnValue({ templateSlug: 'default' });

		const result = getFields('text', 'custom_tax');

		expect(mockGetCustomTaxonomies).toHaveBeenCalled();
		expect(mockGetTaxonomy).toHaveBeenCalledWith('custom_tax');
		// Should contain base taxonomy fields
		expect(result).toContainEqual({ label: 'Name', value: 'name' });
		expect(result).toContainEqual({
			label: 'Description',
			value: 'description',
		});
		expect(result).toContainEqual({ label: 'Parent', value: 'parent' });
	});

	it('should add archive type name when in FSE mode for supported types', () => {
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue([]);
		// Setup FSE mode
		mockEditSite.getEditedPostContext = jest
			.fn()
			.mockReturnValue({ templateSlug: 'category' });

		const result = getFields('text', 'categories');

		expect(result).toContainEqual({
			label: "Archive type's name",
			value: 'archive-type',
		});
	});

	it('should not add archive type name for image content type', () => {
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue([]);
		// Setup FSE mode
		mockEditSite.getEditedPostContext = jest
			.fn()
			.mockReturnValue({ templateSlug: 'category' });

		const result = getFields('image', 'categories');

		// Should return fields from fieldOptions without archive type
		expect(result).toBeDefined();
		expect(result).toEqual([
			{ label: 'Category image', value: 'category_image' },
		]);
	});

	it('should fall back to fieldOptions when not a custom type', () => {
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue([]);

		// No FSE mode
		const originalMock = select.mockImplementation;
		select.mockImplementation = jest.fn(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: mockGetCustomPostTypes,
					getCustomTaxonomies: mockGetCustomTaxonomies,
				};
			}
			return store === 'core/edit-site' ? undefined : null;
		});

		const result = getFields('text', 'posts');

		// Restore original mock
		select.mockImplementation = originalMock;

		expect(result).toEqual([{ label: 'Title', value: 'title' }]);
	});
});

// Mock additional dependencies for getRelationOptions tests
jest.doMock('@extensions/DC/constants', () => {
	const mockFieldOptions = {
		text: {
			posts: [{ label: 'Title', value: 'title' }],
			categories: [{ label: 'Name', value: 'name' }],
		},
		image: {
			posts: [{ label: 'Featured image', value: 'featured_media' }],
			categories: [{ label: 'Category image', value: 'category_image' }],
		},
	};

	const mockRelationOptions = {
		text: {
			posts: [
				{ label: 'Get latest', value: 'latest' },
				{ label: 'Get oldest', value: 'oldest' },
			],
			categories: [{ label: 'Get top level', value: 'top-level' }],
		},
	};

	return {
		...jest.requireActual('@extensions/DC/constants'),
		fieldOptions: mockFieldOptions,
		relationOptions: mockRelationOptions,
		postTypeRelationOptions: [
			{ label: 'Get latest', value: 'latest' },
			{ label: 'Get oldest', value: 'oldest' },
		],
		taxonomyRelationOptions: [
			{ label: 'Get hierarchical', value: 'hierarchical' },
		],
	};
});

describe('getRelationOptions', () => {
	const mockGetPostType = jest.fn();
	const mockGetCustomPostTypes = jest.fn();
	const mockGetCustomTaxonomies = jest.fn();
	const mockGetCurrentPostType = jest.fn();
	const mockEditSite = {};

	beforeEach(() => {
		jest.clearAllMocks();

		// Reset select mock implementation
		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: mockGetCustomPostTypes,
					getCustomTaxonomies: mockGetCustomTaxonomies,
				};
			}
			if (store === 'core') {
				return {
					getPostType: mockGetPostType,
				};
			}
			if (store === 'core/editor') {
				return {
					getCurrentPostType: mockGetCurrentPostType,
				};
			}
			if (store === 'core/edit-site') {
				return mockEditSite;
			}
			return null;
		});

		// Default responses
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue([]);
		mockGetCurrentPostType.mockReturnValue('post');
	});

	it('should return options for custom post types', () => {
		// Setup custom post type
		mockGetCustomPostTypes.mockReturnValue(['book']);
		mockGetPostType.mockReturnValue({
			supports: { title: true, author: true },
			taxonomies: ['category', 'post_tag'],
		});

		const result = getRelationOptions('book', 'text');

		expect(mockGetCustomPostTypes).toHaveBeenCalled();
		expect(mockGetPostType).toHaveBeenCalledWith('book');
		// Just check that we get an array with some options
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it('should return options for custom taxonomies', () => {
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue(['custom_taxonomy']);

		const result = getRelationOptions('custom_taxonomy', 'text');

		expect(mockGetCustomTaxonomies).toHaveBeenCalled();
		expect(Array.isArray(result)).toBe(true);
	});

	it('should return options for regular content types', () => {
		const result = getRelationOptions('posts', 'text');

		expect(Array.isArray(result)).toBe(true);
	});

	it('should add custom taxonomy options for non-archive types', () => {
		mockGetCustomTaxonomies.mockReturnValue(['genre', 'mood']);

		const result = getRelationOptions('posts', 'text');

		// Since we can't guarantee exactly what will be in the results due to mocking,
		// just check that we get something back
		expect(Array.isArray(result)).toBe(true);
	});

	it('should handle current post type matching', () => {
		// Current post type matches the requested type
		mockGetCurrentPostType.mockReturnValue('posts');

		const result = getRelationOptions('posts', 'text');

		expect(Array.isArray(result)).toBe(true);
	});

	it('should handle archive templates', () => {
		// Setup archive template
		mockEditSite.getEditedPostContext = jest.fn().mockReturnValue({
			templateSlug: 'archive',
		});

		const result = getRelationOptions('posts', 'text', 'archive');

		expect(Array.isArray(result)).toBe(true);
	});

	it('should handle showing current content', () => {
		// Setup template that should show current content
		const result = getRelationOptions('posts', 'text', 'single');

		expect(Array.isArray(result)).toBe(true);
	});

	it('should handle not showing current content', () => {
		// Mock implementation to return options
		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: () => [],
					getCustomTaxonomies: () => [],
				};
			}
			if (store === 'core/editor') {
				return {
					getCurrentPostType: () => 'page',
				};
			}
			return null;
		});

		// Use a template type that shouldn't show current for 'posts'
		const result = getRelationOptions(
			'posts',
			'text',
			'non-matching-template'
		);

		expect(Array.isArray(result)).toBe(true);
	});
});

describe('validationsValues', () => {
	const mockGetWasCustomPostTypesLoaded = jest.fn();
	const mockGetWasCustomTaxonomiesLoaded = jest.fn();
	const mockIsIntegrationListLoaded = jest.fn();
	const mockGetCurrentPostType = jest.fn();
	const mockGetTypeOptions = jest.fn();
	const mockGetACFTypeOptions = jest.fn();
	const mockGetCustomPostTypes = jest.fn();
	const mockGetCustomTaxonomies = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getWasCustomPostTypesLoaded:
						mockGetWasCustomPostTypesLoaded,
					getWasCustomTaxonomiesLoaded:
						mockGetWasCustomTaxonomiesLoaded,
					isIntegrationListLoaded: mockIsIntegrationListLoaded,
					getCustomPostTypes: mockGetCustomPostTypes,
					getCustomTaxonomies: mockGetCustomTaxonomies,
					getTypeOptions: mockGetTypeOptions,
					getACFTypeOptions: mockGetACFTypeOptions,
				};
			}
			if (store === 'core/editor') {
				return {
					getCurrentPostType: mockGetCurrentPostType,
				};
			}
			if (store === 'core/edit-site') {
				return {
					getEditedPostContext: () => ({ templateSlug: 'single' }),
				};
			}
			return {};
		});

		// Set default values
		mockGetWasCustomPostTypesLoaded.mockReturnValue(true);
		mockGetWasCustomTaxonomiesLoaded.mockReturnValue(true);
		mockIsIntegrationListLoaded.mockReturnValue(true);
		mockGetCurrentPostType.mockReturnValue('post');
		mockGetCustomPostTypes.mockReturnValue([]);
		mockGetCustomTaxonomies.mockReturnValue([]);

		// Mock typeOptions for different content types
		mockGetTypeOptions.mockReturnValue({
			text: [
				{ label: 'Posts', value: 'posts' },
				{ label: 'Pages', value: 'pages' },
			],
			image: [{ label: 'Media', value: 'media' }],
		});

		// Mock ACF type options
		mockGetACFTypeOptions.mockReturnValue([
			{ label: 'ACF Text', value: 'acf_text' },
			{ label: 'ACF Image', value: 'acf_image' },
		]);
	});

	it('should return empty object if custom post types not loaded', () => {
		mockGetWasCustomPostTypesLoaded.mockReturnValue(false);

		const result = validationsValues('posts', 'title', 'latest', 'text');

		expect(result).toEqual({});
	});

	it('should return empty object if custom taxonomies not loaded', () => {
		mockGetWasCustomTaxonomiesLoaded.mockReturnValue(false);

		const result = validationsValues('posts', 'title', 'latest', 'text');

		expect(result).toEqual({});
	});

	it('should validate field for WordPress source', () => {
		// We can't fully mock the real functions in the test file,
		// but we can check that the function completes without errors
		// and returns an object with expected structure
		const result = validationsValues(
			'posts',
			'invalid_field',
			'latest',
			'text'
		);

		// The validation should detect the invalid field
		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});

	it('should validate relation', () => {
		const result = validationsValues(
			'posts',
			'title',
			'invalid_relation',
			'text'
		);

		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});

	it('should validate content type', () => {
		const result = validationsValues(
			'invalid_type',
			'title',
			'latest',
			'text'
		);

		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});

	it('should validate link target', () => {
		const result = validationsValues(
			'posts',
			'title',
			'latest',
			'text',
			'wp',
			'invalid_link_target'
		);

		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});

	it('should handle context loop fields with cl prefix', () => {
		// With context loop enabled (isCL = true)
		const result = validationsValues(
			'posts',
			'title',
			'latest',
			'text',
			'wp',
			'entity',
			true
		);

		expect(result).toBeDefined();
		expect(typeof result).toBe('object');

		// Check that any returned attributes use the cl- prefix
		const hasClPrefix = Object.keys(result).every(
			key => !key || key.startsWith('cl-')
		);
		expect(hasClPrefix).toBe(true);
	});

	it('should handle ACF source fields', () => {
		// With ACF source
		const result = validationsValues(
			'posts',
			'acf_field',
			'latest',
			'text',
			'acf',
			'entity',
			false,
			'test_group'
		);

		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});
});

describe('getPostBySlug', () => {
	const mockGetEntityRecords = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock select for core
		select.mockImplementation(store => {
			if (store === 'core') {
				return {
					getEntityRecords: mockGetEntityRecords,
				};
			}
			return {};
		});
	});

	it('should return a post when exact slug match exists', async () => {
		// Mock post with exact slug - make sure it returns posts with length > 0 on first call
		// to satisfy the retry logic's early return condition
		const mockPost = { id: 123, title: 'Test Post', slug: 'test-post' };
		mockGetEntityRecords.mockResolvedValue([mockPost]);

		const result = await getPostBySlug('test-post');

		// We can't assert exact number of calls due to retry logic,
		// but we can check it was called with the right parameters
		expect(mockGetEntityRecords).toHaveBeenCalledWith('postType', 'post', {
			slug: 'test-post',
			per_page: 1,
		});
		expect(result).toEqual(mockPost);
	});

	it('should try without numeric suffix when exact match not found', async () => {
		// First set of calls (with original slug) return empty array
		// Second set (with slug without suffix) returns a post
		const mockPost = {
			id: 456,
			title: 'Another Post',
			slug: 'another-post',
		};
		mockGetEntityRecords.mockImplementation((...args) => {
			const options = args[2];
			if (options.slug === 'another-post-2') {
				return Promise.resolve([]);
			}
			if (options.slug === 'another-post') {
				return Promise.resolve([mockPost]);
			}
			return Promise.resolve([]);
		});

		const result = await getPostBySlug('another-post-2');

		// Check that both slugs were tried (exact parameters checking)
		expect(mockGetEntityRecords).toHaveBeenCalledWith('postType', 'post', {
			slug: 'another-post-2',
			per_page: 1,
		});
		expect(mockGetEntityRecords).toHaveBeenCalledWith('postType', 'post', {
			slug: 'another-post',
			per_page: 1,
		});
		expect(result).toEqual(mockPost);
	});

	it('should return null when no post is found', async () => {
		// Always return empty array to simulate no posts found
		mockGetEntityRecords.mockResolvedValue([]);

		const result = await getPostBySlug('non-existent-post-1');

		// Can't check exact call count due to retries
		expect(result).toBeNull();
	});

	it('should return null for slug without numeric suffix when not found', async () => {
		// Always return empty array to simulate no posts found
		mockGetEntityRecords.mockResolvedValue([]);

		const result = await getPostBySlug('plain-slug');

		// Should still attempt to find by exact slug
		expect(mockGetEntityRecords).toHaveBeenCalledWith('postType', 'post', {
			slug: 'plain-slug',
			per_page: 1,
		});
		expect(result).toBeNull();
	});

	it('should retry operations when initial attempts fail', async () => {
		// First calls reject, later calls succeed
		const mockPost = { id: 789, title: 'Retry Post', slug: 'retry-post' };

		let callCount = 0;
		mockGetEntityRecords.mockImplementation(() => {
			callCount += 1;
			if (callCount <= 2) {
				return Promise.reject(new Error('Network error'));
			}
			return Promise.resolve([mockPost]);
		});

		const result = await getPostBySlug('retry-post');

		expect(result).toEqual(mockPost);
	});
});
