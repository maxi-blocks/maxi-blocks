/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';

const getTemplatePartSlug = clientId => {
	const { getEditedPostType, getEditedPostId } = select('core/edit-site');

	// Checking if we on the FSE template part editor.
	if (getIsSiteEditor() && getEditedPostType() === 'wp_template_part')
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
