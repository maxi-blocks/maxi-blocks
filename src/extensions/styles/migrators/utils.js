/**
 * Internal dependencies
 */
import { getBlockData, getBlockNameFromUniqueID } from '@extensions/attributes';

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
	if (!uniqueID) return null;
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
