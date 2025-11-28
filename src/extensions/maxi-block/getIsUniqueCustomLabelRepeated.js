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
	let currentRepeatCount = 0;

	// ALWAYS use tree traversal to check the actual block editor state
	// This is crucial for batch block creation (like column templates)
	// where Redux store hasn't been updated yet but blocks are in the editor
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
