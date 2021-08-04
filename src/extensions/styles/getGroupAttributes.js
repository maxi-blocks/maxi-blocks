/**
 * Internal dependencies
 */
import * as defaults from './defaults/index';

/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty } from 'lodash';

const getIsValid = (cleaned, val) =>
	(cleaned && (val || isNumber(val) || isBoolean(val) || isEmpty(val))) ||
	!cleaned;

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	if (!target) return null;

	const response = {
		...(isHover && {
			...getGroupAttributes(attributes, target, false, prefix, cleaned),
		}),
	};

	if (typeof target === 'string') {
		const defaultAttributes =
			defaults[`${target}${isHover ? 'Hover' : ''}`];

		Object.keys(defaultAttributes).forEach(key => {
			if (getIsValid(cleaned, attributes[`${prefix}${key}`]))
				response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
		});
	} else
		target.forEach(el => {
			const defaultAttributes =
				defaults[`${el}${isHover ? 'Hover' : ''}`];

			Object.keys(defaultAttributes).forEach(key => {
				if (getIsValid(cleaned, attributes[`${prefix}${key}`]))
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
			});
		});

	return response;
};

export default getGroupAttributes;
