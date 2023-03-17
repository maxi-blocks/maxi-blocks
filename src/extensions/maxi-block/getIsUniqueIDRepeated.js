/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsUniqueIDRepeated = (uniqueIDToCompare, repeatCount = 1) => {
	let currentRepeatCount = 0;

	return goThroughMaxiBlocks(block => {
		if (block.attributes.uniqueID === uniqueIDToCompare) {
			currentRepeatCount += 1;

			if (currentRepeatCount > repeatCount) {
				return true;
			}
		}
		return false;
	});
};

export default getIsUniqueIDRepeated;
