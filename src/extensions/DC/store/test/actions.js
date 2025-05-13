/**
 * Internal dependencies
 */
import actions from '@extensions/DC/store/actions';

const mockPostTypes = [
	{ slug: 'post', supports: { editor: true, excerpt: true } },
	{ slug: 'page', supports: { editor: true, excerpt: true } },
	{ slug: 'attachment', supports: { editor: false, excerpt: false } },
	{ slug: 'book', supports: { editor: true, excerpt: true } },
	{ slug: 'recipe', supports: { editor: true, excerpt: false } },
	{ slug: 'wp_block', supports: { editor: false, excerpt: false } },
];

const mockTaxonomies = [
	{ slug: 'category' },
	{ slug: 'post_tag' },
	{ slug: 'genre' },
	{ slug: 'cuisine' },
	{ slug: 'nav_menu' },
];

describe('DC/actions', () => {
	describe('setACFGroups', () => {
		it('should return SET_ACF_GROUPS action', () => {
			const acfGroups = [
				{ id: 1, title: 'Group 1' },
				{ id: 2, title: 'Group 2' },
			];

			const action = actions.setACFGroups(acfGroups);

			expect(action).toEqual({
				type: 'SET_ACF_GROUPS',
				acfGroups,
			});
		});
	});

	describe('setACFFields', () => {
		it('should return SET_ACF_FIELDS action', () => {
			const groupId = 1;
			const acfFields = [
				{ id: 'field1', name: 'Field 1' },
				{ id: 'field2', name: 'Field 2' },
			];

			const action = actions.setACFFields(groupId, acfFields);

			expect(action).toEqual({
				type: 'SET_ACF_FIELDS',
				groupId,
				acfFields,
			});
		});
	});

	describe('loadCustomPostTypes', () => {
		it('should filter post types correctly and return LOAD_CUSTOM_POST_TYPES action', () => {
			const generator = actions.loadCustomPostTypes();

			// First yield - get post types
			const firstYield = generator.next();
			expect(firstYield.value).toEqual({
				type: 'GET_POST_TYPES',
			});

			// Second yield - return filtered post types
			const secondYield = generator.next(mockPostTypes);

			expect(secondYield.value).toEqual({
				type: 'LOAD_CUSTOM_POST_TYPES',
				customPostTypes: ['book', 'recipe'],
				customLimitTypes: ['post', 'page', 'book', 'recipe'],
			});

			expect(secondYield.done).toBe(true);
		});
	});

	describe('loadCustomTaxonomies', () => {
		it('should filter taxonomies correctly and return LOAD_CUSTOM_TAXONOMIES action', () => {
			const generator = actions.loadCustomTaxonomies();

			// First yield - get taxonomies
			const firstYield = generator.next();
			expect(firstYield.value).toEqual({
				type: 'GET_TAXONOMIES',
			});

			// Second yield - return filtered taxonomies
			const secondYield = generator.next(mockTaxonomies);

			expect(secondYield.value).toEqual({
				type: 'LOAD_CUSTOM_TAXONOMIES',
				customTaxonomies: ['genre', 'cuisine'],
			});

			expect(secondYield.done).toBe(true);
		});
	});

	describe('loadIntegrationOptions', () => {
		it('should return SET_INTEGRATION_OPTIONS action with integration plugins', () => {
			const mockIntegrationPlugins = ['acf', 'woocommerce'];
			const generator = actions.loadIntegrationOptions();

			// First yield - get integration plugins
			const firstYield = generator.next();
			expect(firstYield.value).toEqual({
				type: 'GET_INTEGRATION_PLUGINS',
			});

			// Second yield - return integration options
			const secondYield = generator.next(mockIntegrationPlugins);

			expect(secondYield.value).toEqual({
				type: 'SET_INTEGRATION_OPTIONS',
				integrationPlugins: mockIntegrationPlugins,
			});

			expect(secondYield.done).toBe(true);
		});
	});
});
