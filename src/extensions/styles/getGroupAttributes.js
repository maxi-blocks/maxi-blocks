import * as defaults from './defaults/index';

const getGroupAttributes = (attributes, target) => {
	const response = {};

	Object.keys(defaults[target]).forEach(key => {
		response[key] = attributes[key];
	});

	return response;
};

export default getGroupAttributes;
