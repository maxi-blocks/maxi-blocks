import { resolveSelect } from '@wordpress/data';

const controls = {
	GET_POST_TYPES: () => resolveSelect('core').getPostTypes(),
};

export default controls;
