/*
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty, isNil } from 'lodash';

const getIsValid = (val, cleaned = false) =>
	(cleaned &&
		(val ||
			isNumber(val) ||
			isBoolean(val) ||
			(isEmpty(val) && !isNil(val)))) ||
	!cleaned;

export default getIsValid;
