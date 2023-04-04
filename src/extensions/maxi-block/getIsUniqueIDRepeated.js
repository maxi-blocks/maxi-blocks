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

	const blocks = select('maxiBlocks/blocks').receiveBlocks();
	if (blocks) {
		const blocksKeys = Object.keys(blocks).includes(uniqueIDToCompare);

		for (let i = 0; i < blocksKeys.length; i += 1) {
			if (
				blocksKeys.indexOf(blocksKeys[i]) !== i &&
				blocksKeys.lastIndexOf(blocksKeys[i]) !== -1
			) {
				return true;
			}
		}
	}

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
