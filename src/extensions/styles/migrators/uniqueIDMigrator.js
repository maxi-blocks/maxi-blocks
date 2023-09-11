/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from './utils';
import uniqueIDGenerator from '../../attributes/uniqueIDGenerator';
import getCustomLabel from '../../maxi-block/getCustomLabel';

const name = 'uniqueID';

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

export default { name, isEligible, migrate };
