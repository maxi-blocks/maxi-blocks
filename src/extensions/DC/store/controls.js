import { resolveSelect } from '@wordpress/data';

let postTypesCache = null;
let taxonomiesCache = null;

// Clear cache on each editor load
const clearCache = () => {
	postTypesCache = null;
	taxonomiesCache = null;
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
};

export default controls;
