/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';

const getIsTemplatePart = () =>
	getIsSiteEditor() &&
	select('core/edit-site').getEditedPostType() === 'wp_template_part';

export default getIsTemplatePart;
