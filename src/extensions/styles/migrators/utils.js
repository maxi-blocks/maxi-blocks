/**
 * Internal dependencies
 */
import { getBlockData } from '../../attributes';

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
