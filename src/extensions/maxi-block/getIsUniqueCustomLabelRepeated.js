/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsUniqueCustomLabelRepeated = (
	uniqueCustomLabelToCompare,
	uniqueIDToIgnore,
	repeatCount = 1
) => {
	const { getBlock, getCustomLabelCount } = select('maxiBlocks/blocks');
	const existingCount = getCustomLabelCount(uniqueCustomLabelToCompare);
	const ignoredBlock = uniqueIDToIgnore
		? getBlock(uniqueIDToIgnore)
		: null;
	const shouldIgnoreFromStore =
		ignoredBlock?.customLabel === uniqueCustomLabelToCompare;
	const adjustedCount =
		shouldIgnoreFromStore && existingCount > 0
			? Math.max(existingCount - 1, 0)
			: existingCount;

	if (adjustedCount > repeatCount) {
		return true;
	}

	let currentRepeatCount = 0;

	// Fallback to tree traversal to handle batch creation timing gaps
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
