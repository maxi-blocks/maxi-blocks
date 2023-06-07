/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsUniqueStyleIDRepeated = uniqueIDToCompare => {
	return (
		!!select('maxiBlocks/blocks').getBlock(uniqueIDToCompare) ||
		goThroughMaxiBlocks(block => {
			if (block.attributes.styleID === uniqueIDToCompare) {
				return true;
			}
			return false;
		})
	);
};

export default getIsUniqueStyleIDRepeated;
