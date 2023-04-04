/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { goThroughMaxiBlocks } from '../maxi-block';
import { getIsTemplatePart, getSiteEditorIframeBody } from '../fse';

const getClientIdFromUniqueId = uniqueID => {
	/**
	 * In case if block is from template part and it's post type isn't `wp_template_part`.
	 * We should use DOM to get `clientId`. Because `clientId` from `entityRecord`
	 * and `clientId` which gutenberg use for `getBlock` are different 🤷
	 */
	if (!getIsTemplatePart() && uniqueID.includes('template-part-')) {
		const block = getSiteEditorIframeBody().querySelector(`.${uniqueID}`);
		if (block) return block.getAttribute('data-block');
	}

	// First try to get from the store
	const blocks = select('maxiBlocks/blocks').receiveBlocks();
	if (blocks && Object.keys(blocks).includes(uniqueID))
		return blocks[uniqueID];

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
