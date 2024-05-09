import {
	ignoredPostTypes,
	ignoredTaxonomies,
	supportedPostTypes,
	supportedTaxonomies,
} from '../constants';

const actions = {
	*loadCustomPostTypes() {
		const allPostTypes = yield { type: 'GET_POST_TYPES' };

		const excludedTypes = new Set([
			...supportedPostTypes,
			...ignoredPostTypes,
		]);

		const customPostTypes = allPostTypes
			.filter(postType => !excludedTypes.has(postType.slug))
			.map(postType => postType.slug);

		const customLimitTypes = allPostTypes
			.filter(
				postType =>
					postType.supports.editor || postType.supports.excerpt
			)
			.map(postType => postType.slug);

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
};

export default actions;
