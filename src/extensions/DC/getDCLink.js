/**
 * Internal dependencies
 */
import getDCEntity from './getDCEntity';

const getDCContent = async dataRequest => {
	const data = await getDCEntity(dataRequest);

	const contentValue = data?.link;

	if (contentValue) return contentValue;

	return null;
};

export default getDCContent;
