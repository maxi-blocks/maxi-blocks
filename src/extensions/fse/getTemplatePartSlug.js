/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';

/**
 * Returns the slug of the template part if we are on the FSE template part editor.
 *
 * @param {string} clientId The clientId of the block in template part from which we want to get the slug.
 * @returns {string|false} The slug of the template part or false if we are not on the FSE editor.
 */

const getTemplatePartSlug = clientId => {
	if (!getIsSiteEditor()) return false;

	const { getEditedPostType, getEditedPostId } = select('core/edit-site');

	// Checking if we on the FSE template part editor.
	if (getEditedPostType() === 'wp_template_part')
		return getEditedPostId().split('//', 2)[1];

	if (!clientId) return false;

	// Checking if we on the FSE template editor and clientId in inside of the template part.
	const { getBlock, getBlockParents } = select('core/block-editor');

	const firstOnHierarchyParent = getBlock(getBlockParents(clientId)[0]);

	if (!firstOnHierarchyParent) return false;

	const {
		name,
		attributes: { slug },
	} = firstOnHierarchyParent;

	return name === 'core/template-part' ? slug : false;
};

export default getTemplatePartSlug;
