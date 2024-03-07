import { resolveSelect } from '@wordpress/data';

const controls = {
	GET_POST_TYPES: () => resolveSelect('core').getPostTypes({ per_page: -1 }),
	GET_TAXONOMIES: () => resolveSelect('core').getTaxonomies({ per_page: -1 }),
};

export default controls;
