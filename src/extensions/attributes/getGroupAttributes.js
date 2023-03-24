/**
 * Internal dependencies
 */
import getIsValid from './getIsValid';
import * as defaults from './defaults/index';
import parseLongAttrKey from './dictionary/parseLongAttrKey';

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

		if (defaultAttributes)
			Object?.keys(defaultAttributes)?.forEach(key => {
				const parsedKey = parseLongAttrKey(`${prefix}${key}`);
				const value = attributes[parsedKey];

				if (getIsValid(value, cleaned)) response[parsedKey] = value;
			});
	} else
		target.forEach(el => {
			const defaultAttributes =
				defaults[`${el}${isHover ? 'Hover' : ''}`] || defaults[el];

			if (defaultAttributes)
				Object.keys(defaultAttributes).forEach(key => {
					const parsedKey = parseLongAttrKey(`${prefix}${key}`);
					const value = attributes[parsedKey];

					if (getIsValid(value, cleaned)) response[parsedKey] = value;
				});
		});

	return response;
};

export default getGroupAttributes;
