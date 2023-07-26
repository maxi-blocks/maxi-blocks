/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';

const getDCContent = async (dataRequest, clientId) => {
	const data = await getDCEntity(dataRequest, clientId);

	const contentValue = data?.link;

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
