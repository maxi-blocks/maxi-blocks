/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';
import getIsTemplatePart from './getIsTemplatePart';
import getTemplatePart from './getTemplatePart';

/**
 * Returns the tagName of the template part if we are on the FSE template part editor.
 *
 * @param {string} clientId The clientId of the block in template part from which we want to get the tagName.
 * @returns {string|false} The tagName of the template part or false if we are not on the FSE editor.
 */
const getTemplatePartTagName = clientId => {
	if (!getIsSiteEditor()) return false;

	const { getEditedPostId } = select('core/edit-site');

	// Checking if we on the FSE template part editor.
	if (getIsTemplatePart()) return getEditedPostId().split('//', 2)[1];

	const templatePartParent = getTemplatePart(clientId);

	if (!templatePartParent) return false;

	const {
		name,
		attributes: { tagName },
	} = templatePartParent;

	return name === 'core/template-part' ? tagName : false;
};

export default getTemplatePartTagName;
