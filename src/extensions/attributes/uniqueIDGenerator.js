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
 * - Timestamp in base36 (for temporal uniqueness)
 * - Random string (for collision prevention in batch operations)
 * - '-u' suffix (MaxiBlocks uniqueID marker)
 *
 * The timestamp + random addition significantly reduces the risk of
 * collisions when multiple blocks are created simultaneously (batch paste).
 *
 * @param {Object} params           - Parameters object
 * @param {string} params.blockName - The block name (e.g., 'maxi-blocks/button-maxi')
 * @returns {string} Unique ID in format: 'button-maxi-{uuid}-{timestamp}{random}-u'
 */
const uniqueIDGenerator = ({ blockName }) => {
	const name = blockName.replace('maxi-blocks/', '');
	const uniquePart = uuidv4().split('-')[0];

	// Add timestamp in base36 for temporal uniqueness (more compact than base10)
	const timestamp = Date.now().toString(36);

	// Add 4-character random string for collision prevention in batch operations
	const random = Math.random().toString(36).substring(2, 6);

	return `${name}-${uniquePart}-${timestamp}${random}-u`;
};

export default uniqueIDGenerator;
