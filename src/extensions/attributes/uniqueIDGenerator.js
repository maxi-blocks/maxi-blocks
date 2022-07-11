/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const uniqueIDGenerator = name => {
	const newID = uniqueId(name.replace(/[0-9]/g, ''));

	if (getIsUniqueIDRepeated(newID, 0)) return uniqueIDGenerator(name);

	return newID;
};

export default uniqueIDGenerator;
