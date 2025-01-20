/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';
import uniqueIDGenerator from '@extensions/attributes/uniqueIDGenerator';
import getCustomLabel from '@extensions/maxi-block/getCustomLabel';

// Constants to avoid string allocations
const NAME = 'uniqueID';
const SUFFIX = '-u';

const isEligible = ({ uniqueID }) => uniqueID && !uniqueID.endsWith(SUFFIX);

const migrate = newAttributes => {
	const { uniqueID, customLabel } = newAttributes;

	// Generate new ID only if needed
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const newUniqueID = uniqueIDGenerator({ blockName });

	// Direct property assignment instead of object spread
	newAttributes.uniqueID = newUniqueID;
	newAttributes.legacyUniqueID = uniqueID;

	// Only update customLabel if necessary
	if (!customLabel) {
		newAttributes.customLabel = getCustomLabel('', newUniqueID);
	}

	return newAttributes;
};

export default {
	name: NAME,
	isEligible,
	migrate,
	ignoreAttributesForSave: true,
};
