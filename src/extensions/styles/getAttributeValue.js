/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty, isNil } from 'lodash';

const getBreakpointLine = (breakpoint, target) => {
	if (isEmpty(breakpoint)) return '';
	if (isEmpty(target)) return breakpoint;

	return `-${breakpoint}`;
};

const getAttributeValue = ({
	target,
	props,
	isHover,
	breakpoint,
	prefix = '',
}) => {
	const value =
		props[
			`${prefix}${target}${getBreakpointLine(breakpoint, target)}${
				isHover ? '-hover' : ''
			}`
		];

	if (
		(value || isNumber(value) || isBoolean(value) || isEmpty(value)) &&
		!isNil(value)
	)
		return value;
	if (
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

	return props[`${prefix}${target}`];
};

export default getAttributeValue;
