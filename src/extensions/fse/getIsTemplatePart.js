/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';

/**
 * @returns {boolean} True if we are on the FSE template part editor.
 */
const getIsTemplatePart = () =>
	getIsSiteEditor() &&
	select('core/editor').getCurrentPostType() === 'wp_template_part';

export default getIsTemplatePart;
