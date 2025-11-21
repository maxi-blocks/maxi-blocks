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

	// Optimization: Use Redux store to iterate through known blocks first
	const maxiBlocks = select('maxiBlocks/blocks').getBlocks();
	const blockEditorStore = select('core/block-editor');

	if (maxiBlocks && Object.keys(maxiBlocks).length > 0) {
		// Fast path: iterate through Redux store
		for (const [uniqueID, blockData] of Object.entries(maxiBlocks)) {
			if (uniqueID !== uniqueIDToIgnore) {
				const { clientId } = blockData;
				const block = blockEditorStore.getBlock(clientId);

				if (block) {
					const { customLabel } = block.attributes;
					if (customLabel === uniqueCustomLabelToCompare) {
						currentRepeatCount += 1;

						if (currentRepeatCount > repeatCount) {
							return true;
						}
					}
				}
			}
		}
		return currentRepeatCount > repeatCount;
	}

	// Fallback: use tree traversal for edge cases
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
