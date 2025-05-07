/**
 * WordPress dependencies
 */
import { resolveSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDCContent from '@extensions/DC/getDCContent';
import * as utils from '@extensions/DC/utils';
import getDCEntity from '@extensions/DC/getDCEntity';
import { getACFFieldContent } from '@extensions/DC/getACFData';
import getACFContentByType from '@extensions/DC/getACFContentByType';
import {
	getCartContent,
	getProductsContent,
} from '@extensions/DC/getWCContent';
import processDCDate, { formatDateOptions } from '@extensions/DC/processDCDate';

jest.mock('@wordpress/data', () => ({
	resolveSelect: jest.fn(),
	select: jest.fn(store => {
		if (store === 'maxiBlocks/dynamic-content') {
			return {
				getLimitTypes: jest.fn(),
				getOrderTypes: jest.fn(),
				getRelationTypes: jest.fn(),
				getACFGroups: jest.fn(),
				getACFFields: jest.fn(),
				getCustomTaxonomies: jest.fn(),
			};
		}
		return jest.fn();
	}),
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => text),
}));

jest.mock('@extensions/DC/constants', () => ({
	...jest.requireActual('@extensions/DC/constants'),
	attributeDefaults: {
		status: false,
		source: 'wp',
		type: 'posts',
		relation: 'by-id',
		'order-by': 'by-date',
		order: jest.fn(attributes => ({
			attributes,
			order: 'ASC',
		})),
	},
}));

jest.mock('@extensions/DC/utils', () => ({
	limitString: jest.fn((str, limit) => str),
	parseText: jest.fn(text => text),
	getSimpleText: jest.fn(text => text),
	getItemLinkContent: jest.fn((content, linkStatus) => content),
	getTaxonomyContent: jest.fn(async () => 'Taxonomy content'),
	getCurrentTemplateSlug: jest.fn(() => 'archive-slug'),
}));

jest.mock('@extensions/DC/processDCDate', () => {
	const processDCDate = jest.fn(() => 'Formatted date');
	return {
		__esModule: true,
		default: processDCDate,
		formatDateOptions: jest.fn(() => ({})),
	};
});

jest.mock('@extensions/DC/getDCEntity', () => jest.fn());
jest.mock('@extensions/DC/getACFData', () => ({
	getACFFieldContent: jest.fn(),
}));
jest.mock('@extensions/DC/getACFContentByType', () => jest.fn());
jest.mock('@extensions/DC/getWCContent', () => ({
	getCartContent: jest.fn(),
	getProductsContent: jest.fn(),
}));

describe('handleParentField', () => {
	const originalHandleParentField = jest.requireActual(
		'@extensions/DC/getDCContent'
	).handleParentField;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return "No parent" if contentValue is falsy', async () => {
		const mockResolveSelect = {
			getEntityRecords: jest.fn(),
		};
		resolveSelect.mockReturnValue(mockResolveSelect);

		const result = await originalHandleParentField(0, 'category');

		expect(result).toBe('No parent');
		expect(mockResolveSelect.getEntityRecords).not.toHaveBeenCalled();
	});

	it('should return parent name if found', async () => {
		const mockResolveSelect = {
			getEntityRecords: jest
				.fn()
				.mockResolvedValue([{ name: 'Parent Category' }]),
		};
		resolveSelect.mockReturnValue(mockResolveSelect);

		const result = await originalHandleParentField(123, 'category');

		expect(result).toBe('Parent Category');
		expect(mockResolveSelect.getEntityRecords).toHaveBeenCalledWith(
			'taxonomy',
			'category',
			{ per_page: 1, include: 123 }
		);
	});

	it('should return "No parent" if parent is not found', async () => {
		const mockResolveSelect = {
			getEntityRecords: jest.fn().mockResolvedValue([]),
		};
		resolveSelect.mockReturnValue(mockResolveSelect);

		const result = await originalHandleParentField(123, 'category');

		expect(result).toBe('No parent');
	});
});

describe('getDCContent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetModules();
	});

	it('should return null if dataRequest is empty', async () => {
		const result = await getDCContent({});
		expect(result).toBeNull();
	});

	it('should handle archive-type field', async () => {
		const result = await getDCContent({ field: 'archive-type' });
		expect(utils.getCurrentTemplateSlug).toHaveBeenCalled();
		expect(result).toBe('archive slug');
	});

	it('should return ACF field content', async () => {
		getDCEntity.mockResolvedValue({ id: 123 });
		getACFFieldContent.mockResolvedValue('ACF content');
		getACFContentByType.mockReturnValue('Processed ACF content');

		const result = await getDCContent({
			source: 'acf',
			field: 'acf_field',
			acfFieldType: 'text',
		});

		expect(getACFFieldContent).toHaveBeenCalledWith('acf_field', 123);
		expect(getACFContentByType).toHaveBeenCalledWith(
			'ACF content',
			'text',
			expect.any(Object)
		);
		expect(result).toBe('Processed ACF content');
	});

	it('should handle example values for empty current relation data', async () => {
		getDCEntity.mockResolvedValue({});

		const result = await getDCContent({
			source: 'acf',
			relation: 'current',
			field: 'test_field',
		});

		expect(result).toBe('Test_field: example value');
	});

	it('should handle products type', async () => {
		getDCEntity.mockResolvedValue({ title: 'Product title' });
		getProductsContent.mockReturnValue('Product content');

		const dataRequest = {
			type: 'products',
			field: 'title',
		};

		const result = await getDCContent(dataRequest);

		expect(getProductsContent).toHaveBeenCalledWith(dataRequest, {
			title: 'Product title',
		});
		expect(result).toBe('Product content');
	});

	it('should handle cart type', async () => {
		getDCEntity.mockResolvedValue({ items: [] });
		getCartContent.mockReturnValue('Cart content');

		const dataRequest = {
			type: 'cart',
			field: 'items',
		};

		const result = await getDCContent(dataRequest);

		expect(getCartContent).toHaveBeenCalledWith(dataRequest, { items: [] });
		expect(result).toBe('Cart content');
	});

	it('should handle date field', async () => {
		getDCEntity.mockResolvedValue({ date: '2023-01-01' });
		processDCDate.mockReturnValue('Formatted date');

		const dataRequest = {
			field: 'date',
			customDate: 'custom',
			format: 'F j, Y',
			locale: 'en',
		};

		const result = await getDCContent(dataRequest);

		expect(formatDateOptions).toHaveBeenCalledWith(dataRequest);
		expect(processDCDate).toHaveBeenCalledWith(
			'2023-01-01',
			'custom',
			'F j, Y',
			'en',
			{}
		);
		expect(result).toBe('Formatted date');
	});

	it('should use cache for repeated requests', async () => {
		getDCEntity.mockResolvedValue({ title: 'Cached title' });
		select.mockReturnValue({
			getLimitTypes: jest.fn(
				() => jest.requireActual('@extensions/DC/constants').limitTypes
			),
		});
		const dataRequest = { field: 'title', type: 'posts' };

		await getDCContent(dataRequest);
		await getDCContent(dataRequest);

		// getDCEntity should be called only once due to caching
		expect(getDCEntity).toHaveBeenCalledTimes(1);
	});
});
