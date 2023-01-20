/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty } from 'lodash';

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

	if (value || isNumber(value) || isBoolean(value) || isEmpty(value))
		return value;

	return props[`${prefix}${target}`];
};

export default getAttributeValue;
