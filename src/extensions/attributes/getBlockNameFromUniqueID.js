/**
 * Returns block name from uniqueID
 *
 * @example uniqueID: accordion-maxi-123 -> accordion-maxi
 * @example uniqueID: accordion-maxi-1se8ef1z-u -> accordion-maxi
 */
const getBlockNameFromUniqueID = uniqueID => {
	const match = uniqueID.match(/^(.*?)(-\d+|-[\w\d]+-u)$/);
	if (match) return match[1];
	return uniqueID; // fallback
};

export default getBlockNameFromUniqueID;
