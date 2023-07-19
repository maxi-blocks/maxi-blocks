/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';

const generateTemporalID = (blockName, diff = 1) => {
	const newID = `${blockName
		.replace('maxi-blocks/', '')
		.replace(/[0-9]/g, '')}-${diff}`;
	if (getIsUniqueIDRepeated(newID, 0))
		return generateTemporalID(blockName, diff + 1);
	return newID;
};

const temporalIDGenerator = ({ blockName, diff = 1, clientId }) => {
	return generateTemporalID(blockName, diff);
};

export default temporalIDGenerator;
