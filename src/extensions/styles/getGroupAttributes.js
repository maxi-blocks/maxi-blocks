/**
 * Internal dependencies
 */
import { getIsValid } from './utils';
import * as defaults from './defaults/index';

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
			defaults[`${target}${isHover ? 'Hover' : ''}`] || defaults[target];

		Object.keys(defaultAttributes).forEach(key => {
			if (getIsValid(attributes[`${prefix}${key}`], cleaned))
				response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
		});
	} else
		target.forEach(el => {
			const defaultAttributes =
				defaults[`${el}${isHover ? 'Hover' : ''}`] || defaults[el];

			Object.keys(defaultAttributes).forEach(key => {
				if (getIsValid(attributes[`${prefix}${key}`], cleaned))
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
			});
		});

	return response;
};

export default getGroupAttributes;
