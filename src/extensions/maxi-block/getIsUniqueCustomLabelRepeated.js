/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsUniqueCustomLabelRepeated = (
	uniqueCustomLabelToCompare,
	uniqueIDToIgnore,
	repeatCount = 1
) => {
	let currentRepeatCount = 0;

	goThroughMaxiBlocks(block => {
		const { customLabel, uniqueID } = block.attributes;
		if (
			uniqueID !== uniqueIDToIgnore &&
			customLabel === uniqueCustomLabelToCompare
		) {
			currentRepeatCount += 1;

			/**
			 * Stop the loop if the currentRepeatCount is greater than the repeatCount
			 */
			if (currentRepeatCount > repeatCount) {
				return true;
			}
		}

		return false;
	});

	return currentRepeatCount > repeatCount;
};

export default getIsUniqueCustomLabelRepeated;
