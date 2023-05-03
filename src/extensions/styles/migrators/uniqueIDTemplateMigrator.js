/**
 * Internal dependencies
 */
import { uniqueIDGenerator } from '../../attributes';
import { getBlockNameFromUniqueID } from './utils';

/**
 * This migrator is used to normalize uniqueIDs attributes used on FSE templates parts.
 */
const name = 'UniqueID template migrator';

const isEligible = blockAttributes => {
	const { uniqueID } = blockAttributes;

	if (uniqueID.includes('template')) return true;

	return false;
};

const migrate = newAttributes => {
	// We set a random new uniqueID expecting the `uniqueIDChecker` method on `maxiBlockComponent`
	// will ensure a correct and non repeated one.
	newAttributes.uniqueID = uniqueIDGenerator({
		blockName: getBlockNameFromUniqueID(newAttributes.uniqueID),
		diff: 1,
	});

	return newAttributes;
};

export default { name, isEligible, migrate };
