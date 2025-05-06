import {
	ignoredPostTypes,
	ignoredTaxonomies,
	supportedPostTypes,
	supportedTaxonomies,
} from '@extensions/DC/constants';

const actions = {
	*loadCustomPostTypes() {
		const allPostTypes = yield { type: 'GET_POST_TYPES' };

		const excludedTypes = new Set([
			...supportedPostTypes,
			...ignoredPostTypes,
		]);

		const customPostTypes = [];
		const customLimitTypes = [];

		allPostTypes.forEach(postType => {
			if (!excludedTypes.has(postType.slug)) {
				customPostTypes.push(postType.slug);
			}
			if (postType.supports.editor || postType.supports.excerpt) {
				customLimitTypes.push(postType.slug);
			}
		});

		return {
			type: 'LOAD_CUSTOM_POST_TYPES',
			customPostTypes,
			customLimitTypes,
		};
	},
	*loadCustomTaxonomies() {
		const allTaxonomies = yield { type: 'GET_TAXONOMIES' };

		const excludedTaxonomies = new Set([
			...supportedTaxonomies,
			...ignoredTaxonomies,
		]);

		const customTaxonomies = allTaxonomies
			.filter(taxonomy => !excludedTaxonomies.has(taxonomy.slug))
			.map(taxonomy => taxonomy.slug);

		return {
			type: 'LOAD_CUSTOM_TAXONOMIES',
			customTaxonomies,
		};
	},
	setACFGroups(acfGroups) {
		return {
			type: 'SET_ACF_GROUPS',
			acfGroups,
		};
	},
	setACFFields(groupId, acfFields) {
		return {
			type: 'SET_ACF_FIELDS',
			groupId,
			acfFields,
		};
	},
	*loadIntegrationOptions() {
		const integrationPluginList = yield { type: 'GET_INTEGRATION_PLUGINS' };

		return {
			type: 'SET_INTEGRATION_OPTIONS',
			integrationPlugins: integrationPluginList,
		};
	},
};

export default actions;
