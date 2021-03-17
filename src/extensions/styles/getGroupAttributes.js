import * as defaults from './defaults/index';

const getGroupAttributes = (
	attributes,
	target,
	isHover = false,
	prefix = '',
	cleaned = false
) => {
	const response = {};

	console.log('attributes: ' + JSON.stringify(attributes));
	console.log('target: ' + target);
	console.log('isHover: ' + isHover);
	console.log('prefix: ' + prefix);
	console.log('cleaned: ' + cleaned);
	console.log('=======================================');

	if (typeof target === 'string')
		Object.keys(defaults[`${target}${isHover ? 'Hover' : ''}`]).forEach(
			key => {
				if ((cleaned && attributes[`${prefix}${key}`]) || !cleaned)
					response[`${prefix}${key}`] = attributes[`${prefix}${key}`];
			}
		);
	else
		target.forEach(el => {
			Object.keys(defaults[`${el}${isHover ? 'Hover' : ''}`]).forEach(
				key => {
					if ((cleaned && attributes[`${prefix}${key}`]) || !cleaned)
						response[`${prefix}${key}`] =
							attributes[`${prefix}${key}`];
				}
			);
		});

	return response;
};

export default getGroupAttributes;
