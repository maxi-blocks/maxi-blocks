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
}) => {
	const value =
		props[
			`${prefix}${target}${breakpoint ? `-${breakpoint}` : ''}${
				isHover ? '-hover' : ''
			}`
		];

	if (
		(value || isNumber(value) || isBoolean(value) || isEmpty(value)) &&
		!isNil(value)
	)
		return value;
	if (isHover && isNil(value))
		return getAttributeValue({
			target,
			props,
			isHover: false,
			breakpoint,
			prefix,
		});

	return props[`${prefix}${target}`];
};

export default getAttributeValue;
