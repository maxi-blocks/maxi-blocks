/**
 * Internal dependencies
 */
import { getBlockData } from '../../attributes';

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Returns block name from uniqueID
 */
export const getBlockNameFromUniqueID = uniqueID =>
	uniqueID.slice(0, uniqueID.indexOf('maxi') + 4);

/**
 * Returns block data from uniqueID
 */
export const getBlockDataByUniqueID = uniqueID =>
	getBlockData(getBlockNameFromUniqueID(uniqueID));

/**
 * Returns blocks customCss selectors
 */
export const getBlockSelectorsByUniqueID = uniqueID =>
	getBlockDataByUniqueID(uniqueID)?.customCss.selectors;

/**
 * Returns blocks `interactionBuilderSettings`
 */
export const getIBDataItem = ({ uniqueID, sid, settings }) => {
	const interactionBuilderSettings =
		getBlockDataByUniqueID(uniqueID)?.interactionBuilderSettings;

	if (!interactionBuilderSettings) return null;

	return (
		Object.values(interactionBuilderSettings)
			.flat()
			.find(
				item =>
					(sid && item?.sid === sid) ||
					(!sid && settings && item?.label === settings)
			) || null
	);
};

/**
 * Get uniqueID of a block in the editor with a specific legacyUniqueID
 */
export const getUniqueIDByLegacyUniqueID = legacyUniqueID => {
	const blocks = select('core/block-editor').getBlocks();

	for (const block of blocks) {
		if (
			block.name.startsWith('maxi-blocks/') &&
			block?.attributes?.legacyUniqueID === legacyUniqueID
		) {
			return block?.attributes?.uniqueID; // Return uniqueID of the block
		}
	}

	return null; // Return null if no block is found with the specified legacyUniqueID
};
