/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';

const uniqueIDGenerator = ({ blockName, diff = 1 }) => {
	const newID = `${blockName
		.replace('maxi-blocks/', '')
		.replace(/[0-9]/g, '')}-${diff}`;

	if (getIsUniqueIDRepeated(newID, 0))
		return uniqueIDGenerator({ blockName, diff: diff + 1 });

	return newID;
};

export default uniqueIDGenerator;
