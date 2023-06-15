/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';
import getTemplatePart from './getTemplatePart';
import getIsTemplatePart from './getIsTemplatePart';

/**
 * Returns the slug of the template part if we are on the FSE template part editor.
 *
 * @param {string} clientId The clientId of the block in template part from which we want to get the slug.
 * @returns {string|false} The slug of the template part or false if we are not on the FSE editor.
 */
const getTemplatePartSlug = clientId => {
	if (!getIsSiteEditor()) return false;

	const { getEditedPostId } = select('core/edit-site');

	// Checking if we on the FSE template part editor.
	if (getIsTemplatePart()) return getEditedPostId().split('//', 2)[1];

	const templatePartParent = getTemplatePart(clientId);

	if (!templatePartParent) return false;

	const {
		name,
		attributes: { slug },
	} = templatePartParent;

	return name === 'core/template-part' ? slug : false;
};

export default getTemplatePartSlug;
