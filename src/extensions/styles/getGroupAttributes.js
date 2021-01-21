import * as defaults from './defaults/index';

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = ''
) => {
	const response = {};

	if (typeof target === 'string')
		Object.keys(defaults[`${target}${isHover ? 'Hover' : ''}`]).forEach(
			key => {
				response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
			}
		);
	else
		target.forEach(el => {
			Object.keys(defaults[`${el}${isHover ? 'Hover' : ''}`]).forEach(
				key => {
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
				}
			);
		});

	return response;
};

export default getGroupAttributes;
