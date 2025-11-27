/**
 * Internal dependencies
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique ID for a MaxiBlock
 *
 * Uses a combination of:
 * - Block name (e.g., 'button-maxi')
 * - UUID v4 (first segment for compatibility)
 * - '-u' suffix (MaxiBlocks uniqueID marker)
 *
 * @param {Object} params           - Parameters object
 * @param {string} params.blockName - The block name (e.g., 'maxi-blocks/button-maxi')
 * @returns {string} Unique ID in format: 'button-maxi-{uuid}-u'
 */
const uniqueIDGenerator = ({ blockName }) => {
	const name = blockName.replace('maxi-blocks/', '');
	const uniquePart = uuidv4().split('-')[0];

	return `${name}-${uniquePart}-u`;
};

export default uniqueIDGenerator;
