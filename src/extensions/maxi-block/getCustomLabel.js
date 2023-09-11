/**
 * External dependencies
 */
import { trimEnd, dropRight, split, join } from 'lodash';

/**
 * Internal dependencies
 */
import uniqueCustomLabelGenerator from '../attributes/uniqueCustomLabelGenerator';

const removeRandomPart = str => {
	// Remove '-u' from the end
	const withoutU = trimEnd(str, '-u');

	// Split the string by '-'
	const parts = split(withoutU, '-');

	// Remove the last element
	const removedLast = dropRight(parts);

	// Join the array back into a string
	return join(removedLast, '-');
};

const getCustomLabel = (previousCustomLabel, uniqueID) => {
	const blockName = removeRandomPart(uniqueID);

	return uniqueCustomLabelGenerator(blockName);
};

export default getCustomLabel;
