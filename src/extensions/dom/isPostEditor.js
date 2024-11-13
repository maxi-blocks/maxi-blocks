/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const isPostEditor = () => {
	const postType = select('core/editor').getCurrentPostType();
	return postType === 'post';
};

export default isPostEditor;
