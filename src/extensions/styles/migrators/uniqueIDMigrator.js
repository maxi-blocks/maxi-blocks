/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';
import uniqueIDGenerator from '@extensions/attributes/uniqueIDGenerator';
import getCustomLabel from '@extensions/maxi-block/getCustomLabel';

const name = 'uniqueID';
const ignoreAttributesForSave = true;

const isEligible = blockAttributes => !blockAttributes.uniqueID.endsWith('-u');

const migrate = newAttributes => {
	const { uniqueID, customLabel } = newAttributes;
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const newUniqueID = uniqueIDGenerator({ blockName });
	if (!customLabel || customLabel === '') {
		const newCustomLabel = getCustomLabel(customLabel, newUniqueID);
		newAttributes.customLabel = newCustomLabel;
	}

	newAttributes.uniqueID = newUniqueID;
	newAttributes.legacyUniqueID = uniqueID;

	return newAttributes;
};

export default { name, isEligible, migrate, ignoreAttributesForSave };
