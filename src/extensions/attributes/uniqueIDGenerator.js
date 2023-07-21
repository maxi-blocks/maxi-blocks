/**
 * Internal dependencies
 */

import { v4 as uuidv4 } from 'uuid';

const generateUniqueID = blockName => {
	const name = blockName.replace('maxi-blocks/', '');
	const uniquePart = uuidv4().split('-')[0];
	return `${name}-${uniquePart}-u`;
};

const uniqueIDGenerator = ({ blockName }) => {
	return generateUniqueID(blockName);
};

export default uniqueIDGenerator;
