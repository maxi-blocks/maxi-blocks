/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBlockData } from '@extensions/attributes';

const getIBOptionsFromBlockData = clientId => {
	const blockName = select('core/block-editor')
		.getBlock(clientId)
		?.name.replace('maxi-blocks/', '');

	// TODO: without this line, the block may break after copy/pasting
	if (!blockName) return {};

	const blockOptions = getBlockData(blockName).interactionBuilderSettings;

	return blockOptions || {};
};

export default getIBOptionsFromBlockData;
