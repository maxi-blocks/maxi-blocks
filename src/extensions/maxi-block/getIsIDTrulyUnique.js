/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

const getIsIDTrulyUnique = (id, repeatCount = 1) => {
	if (!id.endsWith('-u')) return false;

	let currentRepeatCount = 0;

	goThroughMaxiBlocks(block => {
		const { uniqueID } = block.attributes;
		if (uniqueID === id) {
			currentRepeatCount += 1;
		}
	});

	if (currentRepeatCount > repeatCount) {
		return false;
	}
	return true;
};

export default getIsIDTrulyUnique;
