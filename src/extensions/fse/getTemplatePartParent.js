/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';

/**
 * Returns true if the immediate parent of the block is a template part block
 */
const getTemplatePartParent = clientId => {
	if (!getIsSiteEditor() || !clientId) return false;

	// Select core/block-editor to use its methods.
	const { getBlock, getBlockParents } = select('core/block-editor');

	// Get the immediate parent of the current block.
	const immediateParentId = getBlockParents(clientId, true)?.[0];

	// If there's no parent, return false.
	if (!immediateParentId) return false;

	// Get the immediate parent block object.
	const immediateParentBlock = getBlock(immediateParentId);

	// Check if the immediate parent is a 'core/template-part' block.
	return immediateParentBlock?.name === 'core/template-part';
};

export default getTemplatePartParent;
