/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsUniqueIDRepeated = (uniqueIDToCompare, repeatCount = 1) => {
	let currentRepeatCount = 0;

	return (
		!!select('maxiBlocks/blocks').getBlock(uniqueIDToCompare) ||
		goThroughMaxiBlocks(block => {
			if (block.attributes.uniqueID === uniqueIDToCompare) {
				currentRepeatCount += 1;

				if (currentRepeatCount > repeatCount) {
					return true;
				}
			}
			return false;
		})
	);
};

export default getIsUniqueIDRepeated;
