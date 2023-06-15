/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';

/**
 * Returns the template part if we are on the FSE template part editor.
 */
const getTemplatePart = clientId => {
	if (!getIsSiteEditor() || !clientId) return false;

	// Checking if we on the FSE template editor and clientId in inside of the template part.
	const { getBlock, getBlockParents } = select('core/block-editor');

	const templatePartParent = getBlock(
		getBlockParents(clientId).filter(
			currentClientId =>
				getBlock(currentClientId)?.name === 'core/template-part'
		)[0]
	);

	if (!templatePartParent) return false;

	return templatePartParent;
};

export default getTemplatePart;
