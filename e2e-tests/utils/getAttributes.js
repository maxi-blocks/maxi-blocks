import getBlockAttributes from './getBlockAttributes';

const getAttributes = async attrs => {
	const attributes = await getBlockAttributes();

	if (typeof attrs === 'string') return attributes[attrs];

	const response = {};

	attrs.forEach(attr => {
		response[attr] = attributes[attr];
	});

	return response;
};

export default getAttributes;
