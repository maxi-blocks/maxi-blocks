/**
 * Internal dependencies
 */
import getIsUniqueCustomLabelRepeated from '../maxi-block/getIsUniqueCustomLabelRepeated';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const uniqueCustomLabelGenerator = (blockName, diff = 1) => {
	const newLabel = `${capitalize(blockName.replace('-maxi', ''))}_${diff}`;
	if (getIsUniqueCustomLabelRepeated(newLabel, 0))
		return uniqueCustomLabelGenerator(blockName, diff + 1);
	return newLabel;
};

export default uniqueCustomLabelGenerator;
