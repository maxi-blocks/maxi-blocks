/**
 * Internal dependencies
 */
import { getBlockData, getBlockNameFromUniqueID } from '@extensions/attributes';

// Cache for block data to avoid repeated lookups
const blockDataCache = new Map();

/**
 * Returns block data from uniqueID with caching
 */
export const getBlockDataByUniqueID = uniqueID => {
	if (!uniqueID) return null;

	// Check cache first
	if (blockDataCache.has(uniqueID)) {
		return blockDataCache.get(uniqueID);
	}

	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockData = getBlockData(blockName);

	// Cache the result
	blockDataCache.set(uniqueID, blockData);

	return blockData;
};

/**
 * Returns blocks customCss selectors
 */
export const getBlockSelectorsByUniqueID = uniqueID => {
	const blockData = getBlockDataByUniqueID(uniqueID);
	return blockData?.customCss?.selectors;
};

/**
 * Returns blocks `interactionBuilderSettings`
 */
export const getIBDataItem = ({ uniqueID, sid, settings }) => {
	if (!uniqueID) return null;

	const blockData = getBlockDataByUniqueID(uniqueID);
	const interactionBuilderSettings = blockData?.interactionBuilderSettings;

	if (!interactionBuilderSettings) return null;

	// Use for...of for better performance
	const flattenedSettings = [].concat(...Object.values(interactionBuilderSettings));
	for (const item of flattenedSettings) {
		if ((sid && item?.sid === sid) || (!sid && settings && item?.label === settings)) {
			return item;
		}
	}

	return null;
};
