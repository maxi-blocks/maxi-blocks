import { resolveSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

let postTypesCache = null;
let taxonomiesCache = null;
let integrationPluginsCache = null;

// Clear cache on each editor load
export const clearCache = () => {
	postTypesCache = null;
	taxonomiesCache = null;
	integrationPluginsCache = null;
};

// Hook into the editor initialization
wp.domReady(() => {
	clearCache();
});

const controls = {
	GET_POST_TYPES: async () => {
		if (postTypesCache) {
			return postTypesCache;
		}

		const postTypes = await resolveSelect('core').getPostTypes({
			per_page: -1,
		});
		postTypesCache = postTypes;
		return postTypes;
	},
	GET_TAXONOMIES: async () => {
		if (taxonomiesCache) {
			return taxonomiesCache;
		}

		const taxonomies = await resolveSelect('core').getTaxonomies({
			per_page: -1,
		});
		taxonomiesCache = taxonomies;
		return taxonomies;
	},
	GET_INTEGRATION_PLUGINS: async () => {
		if (integrationPluginsCache) {
			return integrationPluginsCache;
		}

		try {
			const response = await apiFetch({
				path: '/maxi-blocks/v1.0/get-active-integration-plugins',
				method: 'GET',
			});
			integrationPluginsCache = response || [];
			return integrationPluginsCache;
		} catch (error) {
			console.error('Error loading integration plugins:', error);
			return [];
		}
	},
};

export default controls;
