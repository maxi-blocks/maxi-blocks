/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import { getIsTemplatePart, getSiteEditorIframeBody } from '@extensions/fse';

const getClientIdFromUniqueId = uniqueID => {
	if (!uniqueID) return false;
	/**
	 * In case if block is from template part and it's post type isn't `wp_template_part`.
	 * We should use DOM to get `clientId`. Because `clientId` from `entityRecord`
	 * and `clientId` which gutenberg use for `getBlock` are different 🤷
	 */
	if (!getIsTemplatePart() && uniqueID.includes('template-part-')) {
		const block = getSiteEditorIframeBody().querySelector(`.${uniqueID}`);
		if (block) return block.getAttribute('data-block');
	}

	// O(1) lookup from Redux store
	const blockData = select('maxiBlocks/blocks').getBlock(uniqueID);
	if (blockData?.clientId) {
		return blockData.clientId;
	}

	// Fallback to tree traversal if not in store (e.g., template parts)
	let clientId = null;

	goThroughMaxiBlocks(block => {
		if (block.attributes.uniqueID === uniqueID) {
			clientId = block.clientId;
			return true;
		}
		return false;
	});

	return clientId;
};

export default getClientIdFromUniqueId;
