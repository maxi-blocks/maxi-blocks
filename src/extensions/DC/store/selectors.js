import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { postTypeRelationOptions } from '../constants';

const selectors = {
	getRelationTypes: state => {
		if (state) return state.relationTypes;

		return false;
	},
	getCustomPostTypes: state => {
		if (state) return state.customPostTypes;

		return false;
	},
	getCustomRelationOptions: (state, type) => {
		const postType = select('core').getPostType(type);

		const relationOptions = postTypeRelationOptions;

		if (postType.supports.title) {
			relationOptions.push({
				label: __('Get alphabetical', 'maxi-blocks'),
				value: 'alphabetical',
			});
		}
		if (postType.supports.author) {
			relationOptions.push({
				label: __('Get by author', 'maxi-blocks'),
				value: 'by-author',
			});
		}
		if (postType.taxonomies.includes('category')) {
			relationOptions.push({
				label: __('Get by category', 'maxi-blocks'),
				value: 'by-category',
			});
		}
		if (postType.taxonomies.includes('post_tag')) {
			relationOptions.push({
				label: __('Get by tag', 'maxi-blocks'),
				value: 'by-tag',
			});
		}

		return relationOptions;
	},
};

export default selectors;
