/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';
import DC_LINK_BLOCKS from '@components/toolbar/components/link/dcLinkBlocks';

// Constants
const NAME = 'DC link blocks';
const VALID_VERSIONS = new Set(['1.3', '1.3.1', '1.4.1']);

// Cache block names for better performance
const blockNameCache = new Map();

const getBlockName = uniqueID => {
	if (blockNameCache.has(uniqueID)) {
		return blockNameCache.get(uniqueID);
	}
	const blockName = `maxi-blocks/${getBlockNameFromUniqueID(uniqueID)}`;
	blockNameCache.set(uniqueID, blockName);
	return blockName;
};

const isEligible = blockAttributes => {
	const {
		'maxi-version-current': maxiVersionCurrent,
		uniqueID,
		'dc-link-status': dcLinkStatus,
		'dc-status': dcStatus,
	} = blockAttributes;

	// Early return for quick fails
	if (!dcLinkStatus || dcStatus) return false;
	if (!VALID_VERSIONS.has(maxiVersionCurrent)) return false;

	return DC_LINK_BLOCKS.includes(getBlockName(uniqueID));
};

const migrate = newAttributes => {
	// Direct property mutation for better performance
	newAttributes['dc-status'] = true;
	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
