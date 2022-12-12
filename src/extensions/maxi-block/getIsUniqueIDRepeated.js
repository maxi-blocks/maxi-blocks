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

		return {
			repeated: blocks.some(block => {
				if (block.attributes.uniqueID === uniqueIDToCompare) {
					currentRepeatCount += 1;

					if (currentRepeatCount > repeatCount) {
						return true;
					}
				}

				if (block.innerBlocks.length) {
					const {
						repeated: foundRepeated,
						repeatCount: newRepeatCount,
					} = goThroughBlocks(
						block.innerBlocks,
						uniqueIDToCompare,
						repeatCount,
						currentRepeatCount
					);

					if (foundRepeated) {
						return true;
					}

					currentRepeatCount = newRepeatCount;
				}

				return false;
			}),
			repeatCount: currentRepeatCount,
		};
	};

	const blocks = getBlocks();
	const { repeated } = goThroughBlocks(
		blocks,
		uniqueIDToCompare,
		repeatCount
	);

	return repeated;
};

export default getIsUniqueIDRepeated;
