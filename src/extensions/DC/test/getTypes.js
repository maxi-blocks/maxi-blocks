import { select } from '@wordpress/data';
import getTypes from '@extensions/DC/getTypes';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('getTypes', () => {
	const mockDefaultOptions = [
		{ label: 'Posts', value: 'posts' },
		{ label: 'Pages', value: 'pages' },
	];

	const mockACFOptions = [
		{ label: 'Text', value: 'text' },
		{ label: 'Image', value: 'image' },
	];

	const mockCustomPostTypes = [
		'products',
		'testimonials',
		'wp_font_family', // Should be filtered out
		'wp_font_face', // Should be filtered out
		'wp_global_styles', // Should be filtered out
	];

	const mockCustomTaxonomies = ['category', 'product_cat'];

	const mockPostTypeData = {
		products: {
			labels: { singular_name: 'Product' },
			slug: 'products',
		},
		testimonials: {
			labels: { singular_name: 'Testimonial' },
			slug: 'testimonials',
		},
		wp_font_family: {
			labels: { singular_name: 'Font Family' },
			slug: 'wp_font_family',
		},
		wp_font_face: {
			labels: { singular_name: 'Font Face' },
			slug: 'wp_font_face',
		},
		wp_global_styles: {
			labels: { singular_name: 'Global Styles' },
			slug: 'wp_global_styles',
		},
	};

	const mockTaxonomyData = {
		category: {
			labels: { singular_name: 'Category' },
			slug: 'category',
		},
		product_cat: {
			labels: { singular_name: 'Product Category' },
			slug: 'product_cat',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();

		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: () => mockCustomPostTypes,
					getCustomTaxonomies: () => mockCustomTaxonomies,
					getTypeOptions: () => ({
						posts: mockDefaultOptions,
					}),
					getACFTypeOptions: () => mockACFOptions,
				};
			}
			if (store === 'core') {
				return {
					getPostType: type => mockPostTypeData[type],
					getTaxonomy: type => mockTaxonomyData[type],
				};
			}
			return {};
		});
	});

	it('should return grouped types with default parameters', () => {
		const result = getTypes('posts');

		expect(result).toEqual({
			'Standard types': mockDefaultOptions,
			'Custom types': [
				{ label: 'Product', value: 'products' },
				{ label: 'Testimonial', value: 'testimonials' },
				{ label: 'Category', value: 'category' },
				{ label: 'Product Category', value: 'product_cat' },
			],
		});
	});

	it('should return a flat array when group is false', () => {
		const result = getTypes('posts', false);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toEqual([
			...mockDefaultOptions,
			{ label: 'Product', value: 'products' },
			{ label: 'Testimonial', value: 'testimonials' },
			{ label: 'Category', value: 'category' },
			{ label: 'Product Category', value: 'product_cat' },
		]);
	});

	it('should include archive option when currentTemplateSlug includes archive', () => {
		const result = getTypes('posts', true, 'archive-template');

		expect(result['Standard types']).toContainEqual({
			label: 'All archives',
			value: 'archive',
		});
	});

	it('should append archive option to flat array when group is false', () => {
		const result = getTypes('posts', false, 'archive-template');

		expect(result).toContainEqual({
			label: 'All archives',
			value: 'archive',
		});
	});

	it('should return ACF options when source is acf', () => {
		const result = getTypes('posts', true, false, 'acf');

		expect(result).toEqual({
			'Standard types': mockACFOptions,
			'Custom types': [
				{ label: 'Product', value: 'products' },
				{ label: 'Testimonial', value: 'testimonials' },
			],
		});
	});

	it('should filter out excluded post types', () => {
		const result = getTypes('posts', false);

		const excludedTypes = [
			'wp_font_family',
			'wp_font_face',
			'wp_global_styles',
		];

		// Check that none of the excluded types are in the result
		excludedTypes.forEach(excludedType => {
			expect(result.some(type => type.value === excludedType)).toBe(
				false
			);
		});
	});

	it('should return only default options when there are no custom post types', () => {
		// Mock empty custom post types
		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: () => [],
					getCustomTaxonomies: () => [],
					getTypeOptions: () => ({
						posts: mockDefaultOptions,
					}),
					getACFTypeOptions: () => mockACFOptions,
				};
			}
			return store === 'core'
				? {
						getPostType: () => null,
						getTaxonomy: () => null,
				  }
				: {};
		});

		const result = getTypes('posts');

		// Should be a flat array since there are no custom types
		expect(Array.isArray(result)).toBe(true);
		expect(result).toEqual(mockDefaultOptions);
	});

	it('should combine default options and all archives when on archive template with no custom types', () => {
		// Mock empty custom post types
		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return {
					getCustomPostTypes: () => [],
					getCustomTaxonomies: () => [],
					getTypeOptions: () => ({
						posts: mockDefaultOptions,
					}),
					getACFTypeOptions: () => mockACFOptions,
				};
			}
			return store === 'core'
				? {
						getPostType: () => null,
						getTaxonomy: () => null,
				  }
				: {};
		});

		const result = getTypes('posts', true, 'archive-template');

		// Should be a flat array with default options and archive option
		expect(Array.isArray(result)).toBe(true);
		expect(result).toEqual([
			...mockDefaultOptions,
			{
				label: 'All archives',
				value: 'archive',
			},
		]);
	});
});
