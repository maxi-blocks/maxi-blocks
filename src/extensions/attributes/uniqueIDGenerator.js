/**
 * External dependencies
 */
import { isEmpty, isNil, uniqueId } from 'lodash';

const uniqueIDGenerator = name => {
	const newID = uniqueId(name.replace(/[0-9]/g, ''));

	if (
		!isEmpty(document.getElementsByClassName(newID)) ||
		!isNil(document.getElementById(newID))
	)
		return uniqueIDGenerator(name);

	return newID;
};

export default uniqueIDGenerator;
