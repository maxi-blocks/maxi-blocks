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
	const value =
		props?.[getAttributeKey({ key: target, isHover, prefix, breakpoint })];

	if (
		(value || isNumber(value) || isBoolean(value) || isEmpty(value)) &&
		!isNil(value)
	)
		return value;

	if (
		!allowNil &&
		(isNil(breakpoint) || breakpoint === 'g') &&
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

	return props?.[getAttributeKey({ key: target, prefix })];
};

const getAttributesValue = ({
	target,
	props,
	isHover,
	breakpoint,
	prefix = '',
	allowNil = false,
	returnObj = false,
}) => {
	if (isArray(target))
		return returnObj
			? target.reduce((acc, item) => {
					acc[item] = getAttributeValue({
						target: item,
						props,
						isHover,
						breakpoint,
						prefix,
						allowNil,
					});

					return acc;
			  }, {})
			: target.map(item =>
					getAttributeValue({
						target: item,
						props,
						isHover,
						breakpoint,
						prefix,
						allowNil,
					})
			  );

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
