import { resolveSelect } from '@wordpress/data';

const controls = {
	GET_POST_TYPES: () => resolveSelect('core').getPostTypes({ per_page: -1 }),
};

export default controls;
