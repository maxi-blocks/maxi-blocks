/**
 * External dependencies
 */
import { isEmpty, isNil, uniqueId } from 'lodash';

const uniqueIDGenerator = name => {
	const newID = uniqueId(name);

	if (
		!isEmpty(document.getElementsByClassName(newID)) ||
		!isNil(document.getElementById(newID))
	)
		uniqueIDGenerator(name);

	return newID;
};

export default uniqueIDGenerator;
