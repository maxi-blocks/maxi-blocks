/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getIsUniqueIDRepeated = (uniqueIDToCompare, repeatCount = 1) => {
	const { getBlocks } = select('core/block-editor');

	const goThroughBlocks = (
		blocks,
		uniqueIDToCompare,
		repeatCount,
		rawCurrentRepeatCount = 0
	) => {
		let currentRepeatCount = rawCurrentRepeatCount;
		let repeated = false;

		blocks.forEach(block => {
			if (block.attributes.uniqueID === uniqueIDToCompare) {
				currentRepeatCount += 1;

				if (currentRepeatCount > repeatCount) {
					repeated = true;
				}
			}

			if (block.innerBlocks.length) {
				const foundRepeated = goThroughBlocks(
					block.innerBlocks,
					uniqueIDToCompare,
					repeatCount,
					currentRepeatCount
				);

				if (foundRepeated) {
					repeated = true;
				}
			}
		});

		return repeated;
	};

	const blocks = getBlocks();
	const repeated = goThroughBlocks(blocks, uniqueIDToCompare, repeatCount);

	return repeated;
};

export default getIsUniqueIDRepeated;
