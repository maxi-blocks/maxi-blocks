/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';

const uniqueIDGenerator = (blockName, diff = 1, isSiteEditor = false) => {
	const newID = `${blockName
		.replace('maxi-blocks/', '')
		.replace(/[0-9]/g, '')}${isSiteEditor ? '-template' : ''}-${diff}`;

	if (getIsUniqueIDRepeated(newID, 0))
		return uniqueIDGenerator(blockName, diff + 1);

	return newID;
};

export default uniqueIDGenerator;
