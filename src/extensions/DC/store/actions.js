import { ignoredPostTypes, supportedPostTypes } from '../constants';

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
			type: 'UPDATE_CUSTOM_POST_TYPES',
			customPostTypes,
			customLimitTypes,
		};
	},
};

export default actions;
