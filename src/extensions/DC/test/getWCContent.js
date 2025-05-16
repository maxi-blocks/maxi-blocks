import {
	getProductsContent,
	getCartContent,
} from '@extensions/DC/getWCContent';
import { getProductData } from '@extensions/DC/getWooCommerceData';
import { getTaxonomyContent } from '@extensions/DC/utils';

jest.mock('@extensions/DC/getWooCommerceData');
jest.mock('@extensions/DC/utils', () => {
	const actual = jest.requireActual('@extensions/DC/utils');
	return {
		...actual,
		getTaxonomyContent: jest.fn(),
	};
});

describe('getProductsContent', () => {
	const mockProductData = {
		name: 'Test Product',
		slug: 'test-product',
		review_count: '5',
		average_rating: '4.5',
		sku: 'TP123',
		description: '<p>This is a long product description.</p>',
		short_description: '<p>Short description.</p>',
		prices: {
			price: '1999',
			regular_price: '2999',
			sale_price: '1999',
			price_range: {
				min_amount: '1999',
				max_amount: '2999',
			},
			currency_prefix: '$',
			currency_suffix: '',
			currency_minor_unit: 2,
			currency_decimal_separator: '.',
			currency_thousand_separator: ',',
		},
		images: [
			{ id: 100 }, // featured image
			{ id: 101 }, // gallery image 1
			{ id: 102 }, // gallery image 2
		],
	};

	const mockEntityData = {
		id: 1,
		product_tag: [
			{ id: 10, name: 'Tag 1', slug: 'tag-1', link: '/tag/tag-1' },
			{ id: 11, name: 'Tag 2', slug: 'tag-2', link: '/tag/tag-2' },
		],
		product_cat: [
			{ id: 20, name: 'Category 1', slug: 'cat-1', link: '/cat/cat-1' },
			{ id: 21, name: 'Category 2', slug: 'cat-2', link: '/cat/cat-2' },
		],
		featured_media: 100,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		getProductData.mockResolvedValue(mockProductData);

		getTaxonomyContent.mockImplementation((taxonomy, delimiter, isLink) =>
			isLink
				? 'Multiple Links'
				: taxonomy.map(item => item.name).join(delimiter || ', ')
		);
	});

	it('should return null if entity data is null', async () => {
		const result = await getProductsContent({ field: 'name' }, null);
		expect(result).toBeNull();
	});

	it('should fetch product name with limit', async () => {
		const result = await getProductsContent(
			{ field: 'name', limit: 4 },
			mockEntityData
		);

		expect(getProductData).toHaveBeenCalledWith(mockEntityData.id);
		expect(result).toBe('Test…');
	});

	it('should fetch product slug', async () => {
		const result = await getProductsContent(
			{ field: 'slug' },
			mockEntityData
		);

		expect(result).toBe(mockProductData.slug);
	});

	it('should fetch review count', async () => {
		const result = await getProductsContent(
			{ field: 'review_count' },
			mockEntityData
		);

		expect(result).toBe(mockProductData.review_count);
	});

	it('should fetch average rating', async () => {
		const result = await getProductsContent(
			{ field: 'average_rating' },
			mockEntityData
		);

		expect(result).toBe(mockProductData.average_rating);
	});

	it('should fetch product SKU', async () => {
		const result = await getProductsContent(
			{ field: 'sku' },
			mockEntityData
		);

		expect(result).toBe(mockProductData.sku);
	});

	it('should fetch product price', async () => {
		const result = await getProductsContent(
			{ field: 'price' },
			mockEntityData
		);

		// The price should be formatted according to the currency settings
		expect(result).toBe('$19.99');
	});

	it('should fetch product regular price', async () => {
		const result = await getProductsContent(
			{ field: 'regular_price' },
			mockEntityData
		);

		expect(result).toBe('$29.99');
	});

	it('should fetch product sale price', async () => {
		const result = await getProductsContent(
			{ field: 'sale_price' },
			mockEntityData
		);

		expect(result).toBe('$19.99');
	});

	it('should fetch price range when min and max are different', async () => {
		const result = await getProductsContent(
			{ field: 'price_range' },
			mockEntityData
		);

		expect(result).toBe('$19.99 – $29.99');
	});

	it('should fetch single price when price range min and max are the same', async () => {
		// Update mock to have same min and max
		getProductData.mockResolvedValue({
			...mockProductData,
			prices: {
				...mockProductData.prices,
				price_range: {
					min_amount: '1999',
					max_amount: '1999',
				},
			},
		});

		const result = await getProductsContent(
			{ field: 'price_range' },
			mockEntityData
		);

		expect(result).toBe('$19.99');
	});

	it('should fetch product description with limiting', async () => {
		const result = await getProductsContent(
			{ field: 'description', limit: 15 },
			mockEntityData
		);

		expect(result).toBe('This is a long …');
	});

	it('should fetch product short description', async () => {
		const result = await getProductsContent(
			{ field: 'short_description' },
			mockEntityData
		);

		expect(result).toBe('Short description.');
	});

	it('should fetch product tags', async () => {
		getTaxonomyContent.mockReturnValue('Tag 1, Tag 2');

		const result = await getProductsContent(
			{ field: 'tags', delimiterContent: ', ' },
			mockEntityData
		);

		expect(getTaxonomyContent).toHaveBeenCalledWith(
			mockEntityData.product_tag,
			', ',
			false,
			'product_tag'
		);
		expect(result).toBe('Tag 1, Tag 2');
	});

	it('should fetch product tags with link status', async () => {
		getTaxonomyContent.mockReturnValue('Multiple Links');

		const result = await getProductsContent(
			{ field: 'tags', linkTarget: 'tags' },
			mockEntityData
		);

		expect(getTaxonomyContent).toHaveBeenCalledWith(
			mockEntityData.product_tag,
			undefined,
			true,
			'product_tag'
		);
		expect(result).toBe('Multiple Links');
	});

	it('should fetch product categories', async () => {
		getTaxonomyContent.mockReturnValue('Category 1, Category 2');

		const result = await getProductsContent(
			{ field: 'categories', delimiterContent: ', ' },
			mockEntityData
		);

		expect(getTaxonomyContent).toHaveBeenCalledWith(
			mockEntityData.product_cat,
			', ',
			false,
			'product_cat'
		);
		expect(result).toBe('Category 1, Category 2');
	});

	it('should fetch product featured media', async () => {
		const result = await getProductsContent(
			{ field: 'featured_media' },
			mockEntityData
		);

		expect(result).toBe(mockEntityData.featured_media);
	});

	it('should fetch product gallery image', async () => {
		const result = await getProductsContent(
			{ field: 'gallery', imageAccumulator: 0 },
			mockEntityData
		);

		// Should return the second image (index 1) since the first is featured
		expect(result).toBe(101);
	});

	it('should fetch product gallery image with accumulator', async () => {
		const result = await getProductsContent(
			{ field: 'gallery', imageAccumulator: 1 },
			mockEntityData
		);

		// Should return the third image (index 2)
		expect(result).toBe(102);
	});

	it('should return null for unknown field', async () => {
		const result = await getProductsContent(
			{ field: 'unknown_field' },
			mockEntityData
		);

		expect(result).toBeNull();
	});
});

describe('getCartContent', () => {
	const mockCartData = {
		totals: {
			total_price: '5999',
			total_tax: '599',
			total_shipping: '499',
			total_shipping_tax: '49',
			total_discount: '1000',
			total_items: '5400',
			total_items_tax: '540',
			total_fees: '100',
			total_fees_tax: '10',
			currency_prefix: '$',
			currency_suffix: '',
			currency_minor_unit: 2,
			currency_decimal_separator: '.',
			currency_thousand_separator: ',',
		},
	};

	it('should fetch cart total price', () => {
		const result = getCartContent({ field: 'total_price' }, mockCartData);

		expect(result).toBe('$59.99');
	});

	it('should fetch cart total tax', () => {
		const result = getCartContent({ field: 'total_tax' }, mockCartData);

		expect(result).toBe('$5.99');
	});

	it('should fetch cart total shipping', () => {
		const result = getCartContent(
			{ field: 'total_shipping' },
			mockCartData
		);

		expect(result).toBe('$4.99');
	});

	it('should fetch cart total shipping tax', () => {
		const result = getCartContent(
			{ field: 'total_shipping_tax' },
			mockCartData
		);

		expect(result).toBe('$0.49');
	});

	it('should fetch cart total discount', () => {
		const result = getCartContent(
			{ field: 'total_discount' },
			mockCartData
		);

		expect(result).toBe('$10.00');
	});

	it('should fetch cart total items', () => {
		const result = getCartContent({ field: 'total_items' }, mockCartData);

		expect(result).toBe('$54.00');
	});

	it('should fetch cart total items tax', () => {
		const result = getCartContent(
			{ field: 'total_items_tax' },
			mockCartData
		);

		expect(result).toBe('$5.40');
	});

	it('should fetch cart total fees', () => {
		const result = getCartContent({ field: 'total_fees' }, mockCartData);

		expect(result).toBe('$1.00');
	});

	it('should fetch cart total fees tax', () => {
		const result = getCartContent(
			{ field: 'total_fees_tax' },
			mockCartData
		);

		expect(result).toBe('$0.10');
	});

	it('should return null for unknown field', () => {
		const result = getCartContent({ field: 'unknown_field' }, mockCartData);

		expect(result).toBeNull();
	});
});
