/**
 * Internal dependencies
 */
import getAttributeKey from './getAttributeKey';

/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty, isNil } from 'lodash';

const getAttributeValue = ({
	target,
	props,
	isHover,
	breakpoint,
	prefix = '',
	allowNil = false,
}) => {
	const value = props?.[getAttributeKey(target, isHover, prefix, breakpoint)];

	if (
		(value || isNumber(value) || isBoolean(value) || isEmpty(value)) &&
		!isNil(value)
	)
		return value;

	if (
		!allowNil &&
		(isNil(breakpoint) || breakpoint === 'general') &&
		isHover &&
		isNil(value)
	)
		return getAttributeValue({
			target,
			props,
			isHover: false,
			breakpoint,
			prefix,
		});

	return props?.[getAttributeKey(target, null, prefix)];
};

export default getAttributeValue;
