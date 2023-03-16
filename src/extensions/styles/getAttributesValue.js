/**
 * Internal dependencies
 */
import getAttributeKey from './getAttributeKey';

/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty, isNil, isArray } from 'lodash';

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

const getAttributesValue = ({
	target,
	props,
	isHover,
	breakpoint,
	prefix = '',
	allowNil = false,
}) => {
	if (isArray(target))
		return target.reduce((acc, item) => {
			acc[item] = getAttributeValue({
				target: item,
				props,
				isHover,
				breakpoint,
				prefix,
				allowNil,
			});

			return acc;
		}, {});

	return getAttributeValue({
		target,
		props,
		isHover,
		breakpoint,
		prefix,
		allowNil,
	});
};

export default getAttributesValue;
