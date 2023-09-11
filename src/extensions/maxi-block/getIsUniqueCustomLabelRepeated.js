/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsUniqueCustomLabelRepeated = (
	uniqueCustomLabelToCompare,
	repeatCount = 1
) => {
	let currentRepeatCount = 0;

	goThroughMaxiBlocks(block => {
		const { customLabel } = block.attributes;
		if (customLabel === uniqueCustomLabelToCompare) {
			currentRepeatCount += 1;
		}
	});
	if (currentRepeatCount > repeatCount) {
		return true;
	}
	return false;
};

export default getIsUniqueCustomLabelRepeated;
