import getGroupAttributes from './getGroupAttributes';

const getRowGapProps = attributes => {
	const response = getGroupAttributes(attributes, 'flex');

	Object.keys(response).forEach(key => {
		if (!key.includes('_cg') && !key.includes('_rg')) delete response[key];
	});

	return response;
};

export default getRowGapProps;
