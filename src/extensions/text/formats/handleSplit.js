/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 *
 * @param {string}  value
 * @param {boolean} isOriginal
 * @param {Object}  attributes
 * @param {string}  clientId
 * @param {string}  blockName
 * @returns {Object} block
 */
const handleSplit = (value, isOriginal, attributes, clientId, blockName) => {
	let newAttributes;

	if (isOriginal || value) {
		newAttributes = {
			...attributes,
			content: value,
			...(!isOriginal && { uniqueID: null }),
		};
	}

	const block = createBlock(blockName, newAttributes);

	if (isOriginal) {
		block.clientId = clientId;
	}

	return block;
};

export default handleSplit;
