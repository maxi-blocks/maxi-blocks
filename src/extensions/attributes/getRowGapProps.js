import { getGroupAttributes } from '@extensions/styles';

const getRowGapProps = attributes => {
	const response = getGroupAttributes(attributes, 'flex');

	Object.keys(response).forEach(key => {
		if (!key.includes('gap')) delete response[key];
	});

	return response;
};

export default getRowGapProps;
