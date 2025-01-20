/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';

// Constants
const NAME = 'imgWidth to responsive Migrator';
const IMAGE_BLOCK = 'image-maxi';

// Cache block names for better performance
const blockNameCache = new Map();

const getBlockName = uniqueID => {
	if (blockNameCache.has(uniqueID)) {
		return blockNameCache.get(uniqueID);
	}
	const blockName = getBlockNameFromUniqueID(uniqueID);
	blockNameCache.set(uniqueID, blockName);
	return blockName;
};

const isEligible = blockAttributes => {
	const { uniqueID, imgWidth } = blockAttributes;

	// Early return if no imgWidth
	if (!imgWidth) return false;

	return getBlockName(uniqueID) === IMAGE_BLOCK;
};

const migrate = newAttributes => {
	const { imgWidth } = newAttributes;

	// Direct property mutations for better performance
	newAttributes['img-width-general'] = imgWidth;
	delete newAttributes.imgWidth;

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
