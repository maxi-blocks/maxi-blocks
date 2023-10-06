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
	returnValueWithoutBreakpoint = true,
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

	if (returnValueWithoutBreakpoint) {
		return props[`${prefix}${target}`];
	}

	return null;
};

export default getAttributeValue;
