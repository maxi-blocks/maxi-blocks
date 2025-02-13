/**
 * Internal dependencies
 */
import { getBlockData, getBlockNameFromUniqueID } from '@extensions/attributes';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

// Constants
const NAME = 'maxiAttributes';
const VALID_VERSIONS = new Set([
	'0.1',
	'0.0.1 SC1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
]);

const isEligible = blockAttributes => {
	const {
		uniqueID,
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	// Get block data only if necessary
	const blockName = getBlockNameFromUniqueID(uniqueID);
	const blockData = getBlockData(blockName);

	// Early return if no maxiAttributes
	if (!('maxiAttributes' in blockData)) return false;

	return !maxiVersionOrigin || VALID_VERSIONS.has(maxiVersionCurrent);
};

const migrate = newAttributes => {
	const blockData = getBlockData(getBlockNameFromUniqueID(newAttributes.uniqueID));
	const { maxiAttributes } = blockData;

	// Direct property assignment for better performance
	for (const [key, value] of Object.entries(maxiAttributes)) {
		if (isNil(newAttributes[key])) {
			newAttributes[key] = value;
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
