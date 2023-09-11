/**
 * Internal dependencies
 */
import { getBlockData } from '../../attributes';

/**
 * Returns block name from uniqueID
 *
 * @example uniqueID: accordion-maxi-123 -> accordion-maxi
 * @example uniqueID: accordion-maxi-1se8ef1z-u -> accordion-maxi
 */
export const getBlockNameFromUniqueID = uniqueID => {
	const match = uniqueID.match(/^(.*?)(-\d+|-[\w\d]+-u)$/);
	if (match) return match[1];
	return uniqueID; // fallback
};

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
