/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty } from 'lodash';

const getAttributeValue = (target, props, isHover, prefix = '') => {
	const value = props[`${prefix}${target}${isHover ? '-hover' : ''}`];

	if (value || isNumber(value) || isBoolean(value) || isEmpty(value))
		return value;

	return props[`${prefix}${target}`];
};

export default getAttributeValue;
