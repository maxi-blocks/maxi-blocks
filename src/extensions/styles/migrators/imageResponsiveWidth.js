/**
 * Internal dependencies
 */
import { getBlockNameFromUniqueID } from '@extensions/attributes';

const name = 'imgWidth to responsive Migrator';

const isEligible = blockAttributes => {
	const { uniqueID } = blockAttributes;

	const blockName = getBlockNameFromUniqueID(uniqueID);

	if (blockName === 'image-maxi') {
		const { imgWidth } = blockAttributes;

		if (imgWidth) return true;
	}

	return false;
};

const migrate = newAttributes => {
	const { imgWidth } = newAttributes;
	newAttributes['img-width-general'] = imgWidth;
	delete newAttributes.imgWidth;

	return newAttributes;
};

export default { name, isEligible, migrate };
