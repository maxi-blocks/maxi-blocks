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

	const response = {};

	if (isHover) {
		Object.assign(
			response,
			getGroupAttributes(attributes, target, false, prefix, cleaned)
		);
	}

	const processTarget = el => {
		const defaultAttributes =
			defaults[`${el}${isHover ? 'Hover' : ''}`] || defaults[el];
		if (defaultAttributes) {
			Object.keys(defaultAttributes).forEach(key => {
				if (getIsValid(attributes[`${prefix}${key}`], cleaned)) {
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
				}
			});
		}
	};

	if (typeof target === 'string') {
		processTarget(target);
	} else {
		target.forEach(el => processTarget(el));
	}

	return response;
};

export default getGroupAttributes;
