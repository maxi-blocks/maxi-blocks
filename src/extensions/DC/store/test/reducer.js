/**
 * Internal dependencies
 */
import reducer from '@extensions/DC/store/reducer';
import {
	relationTypes,
	orderTypes,
	limitTypes,
} from '@extensions/DC/constants';
import {
	sourceOptions,
	generalTypeOptions,
	imageTypeOptions,
	ACFTypeOptions,
	WCTypeOptions,
} from '@extensions/DC/store/initConstants';

const createTypeOptions = (
	generalTypeOptions,
	imageTypeOptions,
	acfTypeOptions
) => ({
	text: generalTypeOptions,
	button: generalTypeOptions,
	image: imageTypeOptions,
	container: generalTypeOptions,
	row: generalTypeOptions,
	column: generalTypeOptions,
	group: generalTypeOptions,
	pane: generalTypeOptions,
	slide: generalTypeOptions,
	accordion: generalTypeOptions,
	slider: generalTypeOptions,
	acf: acfTypeOptions,
	divider: generalTypeOptions,
});

describe('DC/reducer', () => {
	const expectedInitialState = {
		relationTypes,
		orderTypes,
		limitTypes,
		acfGroups: null,
		acfFields: null,
		customPostTypes: [],
		customTaxonomies: [],
		wasCustomPostTypesLoaded: false,
		wasCustomTaxonomiesLoaded: false,
		integrationPlugins: [],
		integrationListLoaded: false,
		sourceOptions,
		generalTypeOptions,
		imageTypeOptions,
		ACFTypeOptions,
		typeOptions: createTypeOptions(
			generalTypeOptions,
			imageTypeOptions,
			ACFTypeOptions
		),
	};

	it('should return default state', () => {
		const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
		expect(state).toEqual(expectedInitialState);
	});

	describe('LOAD_CUSTOM_POST_TYPES', () => {
		it('should add custom post types to state', () => {
			const customPostTypes = ['book', 'recipe'];
			const customLimitTypes = ['book'];

			const action = {
				type: 'LOAD_CUSTOM_POST_TYPES',
				customPostTypes,
				customLimitTypes,
			};

			const newState = reducer(undefined, action);

			expect(newState.customPostTypes).toEqual(customPostTypes);
			expect(newState.relationTypes).toEqual([
				...relationTypes,
				...customPostTypes,
			]);
			expect(newState.orderTypes).toEqual([
				...orderTypes,
				...customPostTypes,
			]);
			expect(newState.limitTypes).toEqual([
				...limitTypes,
				...customLimitTypes,
			]);
			expect(newState.wasCustomPostTypesLoaded).toBe(true);
		});
	});

	describe('LOAD_CUSTOM_TAXONOMIES', () => {
		it('should add custom taxonomies to state', () => {
			const customTaxonomies = ['genre', 'cuisine'];

			const action = {
				type: 'LOAD_CUSTOM_TAXONOMIES',
				customTaxonomies,
			};

			const newState = reducer(undefined, action);

			expect(newState.customTaxonomies).toEqual(customTaxonomies);
			expect(newState.relationTypes).toEqual([
				...relationTypes,
				...customTaxonomies,
			]);
			expect(newState.wasCustomTaxonomiesLoaded).toBe(true);
		});
	});

	describe('SET_ACF_GROUPS', () => {
		it('should set ACF groups in state', () => {
			const acfGroups = [
				{ id: 1, title: 'Group 1' },
				{ id: 2, title: 'Group 2' },
			];

			const action = {
				type: 'SET_ACF_GROUPS',
				acfGroups,
			};

			const newState = reducer(undefined, action);

			expect(newState.acfGroups).toEqual(acfGroups);
		});
	});

	describe('SET_ACF_FIELDS', () => {
		it('should add ACF fields for a group', () => {
			const groupId = 1;
			const acfFields = [
				{ id: 'field1', name: 'Field 1' },
				{ id: 'field2', name: 'Field 2' },
			];

			const action = {
				type: 'SET_ACF_FIELDS',
				groupId,
				acfFields,
			};

			const newState = reducer(undefined, action);

			expect(newState.acfFields).toEqual({
				[groupId]: acfFields,
			});
		});

		it('should add ACF fields for multiple groups', () => {
			const initialState = {
				...expectedInitialState,
				acfFields: {
					1: [{ id: 'field1', name: 'Field 1' }],
				},
			};

			const groupId = 2;
			const acfFields = [
				{ id: 'field2', name: 'Field 2' },
				{ id: 'field3', name: 'Field 3' },
			];

			const action = {
				type: 'SET_ACF_FIELDS',
				groupId,
				acfFields,
			};

			const newState = reducer(initialState, action);

			expect(newState.acfFields).toEqual({
				1: [{ id: 'field1', name: 'Field 1' }],
				2: acfFields,
			});
		});
	});

	describe('SET_INTEGRATION_OPTIONS', () => {
		it('should set integration options when ACF is present', () => {
			const integrationPlugins = ['acf'];

			const action = {
				type: 'SET_INTEGRATION_OPTIONS',
				integrationPlugins,
			};

			const newState = reducer(undefined, action);

			expect(newState.sourceOptions).toContainEqual({
				label: 'ACF',
				value: 'acf',
			});
			expect(newState.integrationPlugins).toEqual(integrationPlugins);
			expect(newState.integrationListLoaded).toBe(true);
		});

		it('should set integration options when WooCommerce is present', () => {
			const integrationPlugins = ['woocommerce'];

			const action = {
				type: 'SET_INTEGRATION_OPTIONS',
				integrationPlugins,
			};

			const newState = reducer(undefined, action);

			WCTypeOptions.forEach(option => {
				expect(newState.generalTypeOptions).toContainEqual(option);
			});

			expect(newState.imageTypeOptions).toContainEqual({
				label: 'Product',
				value: 'products',
			});

			expect(newState.integrationPlugins).toEqual(integrationPlugins);
			expect(newState.integrationListLoaded).toBe(true);
		});

		it('should set integration options when both ACF and WooCommerce are present', () => {
			const integrationPlugins = ['acf', 'woocommerce'];

			const action = {
				type: 'SET_INTEGRATION_OPTIONS',
				integrationPlugins,
			};

			const newState = reducer(undefined, action);

			expect(newState.sourceOptions).toContainEqual({
				label: 'ACF',
				value: 'acf',
			});

			WCTypeOptions.forEach(option => {
				expect(newState.generalTypeOptions).toContainEqual(option);
			});

			expect(newState.imageTypeOptions).toContainEqual({
				label: 'Product',
				value: 'products',
			});

			expect(newState.typeOptions.text).toEqual(
				newState.generalTypeOptions
			);
			expect(newState.typeOptions.image).toEqual(
				newState.imageTypeOptions
			);

			expect(newState.integrationPlugins).toEqual(integrationPlugins);
			expect(newState.integrationListLoaded).toBe(true);
		});

		it('should handle case when no integration plugins are provided', () => {
			const action = {
				type: 'SET_INTEGRATION_OPTIONS',
				integrationPlugins: null,
			};

			const newState = reducer(undefined, action);

			expect(newState.integrationPlugins).toEqual([]);
			expect(newState.integrationListLoaded).toBe(true);
			// Other options should remain unchanged
			expect(newState.sourceOptions).toEqual(sourceOptions);
			expect(newState.generalTypeOptions).toEqual(generalTypeOptions);
		});
	});
});
