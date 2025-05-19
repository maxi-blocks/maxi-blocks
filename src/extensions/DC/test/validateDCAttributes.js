/**
 * External dependencies
 */
import { jest } from '@jest/globals';

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getValidatedDCAttributes from '@extensions/DC/validateDCAttributes';
import getDCOptions from '@extensions/DC/getDCOptions';
import { validateRelations, validationsValues } from '@extensions/DC/utils';
import { getValidatedACFAttributes } from '@components/dynamic-content/acf-settings-control/utils';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

jest.mock('@extensions/DC/getDCOptions', () => jest.fn());
jest.mock('@extensions/DC/utils', () => ({
	validateRelations: jest.fn(),
	validationsValues: jest.fn(),
}));
jest.mock('@components/dynamic-content/acf-settings-control/utils', () => ({
	getValidatedACFAttributes: jest.fn(),
}));

describe('getValidatedDCAttributes', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		getDCOptions.mockResolvedValue({ newValues: null });
		validateRelations.mockReturnValue(null);
		validationsValues.mockReturnValue(null);
		getValidatedACFAttributes.mockResolvedValue({
			validatedAttributes: null,
		});

		const mockDCStore = {
			getWasCustomPostTypesLoaded: jest.fn().mockReturnValue(true),
			getWasCustomTaxonomiesLoaded: jest.fn().mockReturnValue(true),
			isIntegrationListLoaded: jest.fn().mockReturnValue(true),
		};

		select.mockImplementation(store => {
			if (store === 'maxiBlocks/dynamic-content') {
				return mockDCStore;
			}
			return {};
		});
	});

	it('should call all validation functions with correct parameters', async () => {
		const attributes = {
			type: 'posts',
			field: 'title',
			relation: 'by-id',
			id: 1,
			source: 'wp',
			linkTarget: 'post',
			acfGroup: '',
		};

		const contentType = 'text';
		const contextLoop = { 'cl-status': true, 'cl-pagination-per-page': 5 };
		const isCL = false;

		await getValidatedDCAttributes(
			attributes,
			contentType,
			contextLoop,
			isCL
		);

		expect(getDCOptions).toHaveBeenCalledWith(
			{ ...attributes, previousRelation: attributes.relation },
			attributes.id,
			contentType,
			isCL,
			{
				'cl-status': contextLoop['cl-status'],
				'cl-pagination-per-page': contextLoop['cl-pagination-per-page'],
			}
		);

		expect(validationsValues).toHaveBeenCalledWith(
			attributes.type,
			attributes.field,
			attributes.relation,
			contentType,
			attributes.source,
			attributes.linkTarget,
			isCL,
			attributes.acfGroup
		);

		expect(validateRelations).toHaveBeenCalledWith(
			attributes.type,
			attributes.relation,
			isCL
		);

		// Check ACF validation wasn't called for 'wp' source
		expect(getValidatedACFAttributes).not.toHaveBeenCalled();
	});

	it('should call ACF validation function when source is acf', async () => {
		const attributes = {
			type: 'posts',
			field: 'acf_field',
			relation: 'by-id',
			id: 1,
			source: 'acf',
			linkTarget: 'post',
			acfGroup: 'test_group',
		};

		const contentType = 'text';
		const contextLoop = null;
		const isCL = false;

		await getValidatedDCAttributes(
			attributes,
			contentType,
			contextLoop,
			isCL
		);

		expect(getValidatedACFAttributes).toHaveBeenCalledWith(
			attributes.acfGroup,
			attributes.field,
			contentType,
			'dc-'
		);
	});

	it('should use cl prefix for ACF validation when isCL is true', async () => {
		const attributes = {
			type: 'posts',
			field: 'acf_field',
			relation: 'by-id',
			id: 1,
			source: 'acf',
			linkTarget: 'post',
			acfGroup: 'test_group',
		};

		const contentType = 'text';
		const contextLoop = { 'cl-status': true };
		const isCL = true;

		await getValidatedDCAttributes(
			attributes,
			contentType,
			contextLoop,
			isCL
		);

		// Check ACF validation was called with cl- prefix
		expect(getValidatedACFAttributes).toHaveBeenCalledWith(
			attributes.acfGroup,
			attributes.field,
			contentType,
			'cl-'
		);
	});

	it('should combine all validation results', async () => {
		const dcOptionsValues = { 'dc-id': 2 };
		const validatedAttributesValues = { 'dc-field': 'excerpt' };
		const validatedRelationsValues = { 'dc-type': 'posts' };
		const validatedACFValues = { 'dc-acf-field': 'custom_field' };

		getDCOptions.mockResolvedValue({ newValues: dcOptionsValues });
		validationsValues.mockReturnValue(validatedAttributesValues);
		validateRelations.mockReturnValue(validatedRelationsValues);
		getValidatedACFAttributes.mockResolvedValue({
			validatedAttributes: validatedACFValues,
		});

		const attributes = {
			type: 'pages',
			field: 'invalid_field',
			relation: 'current',
			id: 999, // Invalid ID
			source: 'acf',
			linkTarget: 'invalid_target',
			acfGroup: 'test_group',
		};

		const result = await getValidatedDCAttributes(attributes, 'text', null);

		// Check that all validation results are combined
		expect(result).toEqual({
			...dcOptionsValues,
			...validatedAttributesValues,
			...validatedRelationsValues,
			...validatedACFValues,
		});
	});

	it('should return null if no validations return values', async () => {
		getDCOptions.mockResolvedValue({ newValues: null });
		validationsValues.mockReturnValue(null);
		validateRelations.mockReturnValue(null);
		getValidatedACFAttributes.mockResolvedValue({
			validatedAttributes: null,
		});

		const attributes = {
			type: 'posts',
			field: 'title',
			relation: 'by-id',
			id: 1,
			source: 'wp',
			linkTarget: 'post',
		};

		const result = await getValidatedDCAttributes(attributes, 'text', null);

		expect(result).toBeNull();
	});

	it('should handle undefined dcOptions', async () => {
		getDCOptions.mockResolvedValue(undefined);
		validationsValues.mockReturnValue({ 'dc-field': 'title' });

		const attributes = {
			type: 'posts',
			field: 'content',
			relation: 'by-id',
			id: 1,
			source: 'wp',
			linkTarget: 'post',
		};

		const result = await getValidatedDCAttributes(attributes, 'text', null);

		expect(result).toEqual({ 'dc-field': 'title' });
	});

	it('should handle errors from validation functions', async () => {
		// Mock console.error to prevent test output pollution
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		const testError = new Error('Test error');
		getDCOptions.mockRejectedValue(testError);

		const attributes = {
			type: 'posts',
			field: 'title',
			relation: 'by-id',
			id: 1,
			source: 'wp',
			linkTarget: 'post',
		};

		await expect(
			getValidatedDCAttributes(attributes, 'text', null)
		).rejects.toThrow('Test error');

		consoleErrorSpy.mockRestore();
	});
});
