/**
 * Internal dependencies
 */
import getIsUniqueCustomLabelRepeated from '@extensions/maxi-block/getIsUniqueCustomLabelRepeated';

const uniqueCustomLabelGenerator = (customLabel, uniqueID, diff = 1) => {
	const newLabel = `${customLabel}${diff ? `_${diff}` : ''}`;
	if (getIsUniqueCustomLabelRepeated(newLabel, uniqueID, 0))
		return uniqueCustomLabelGenerator(
			customLabel,
			uniqueID,
			diff ? diff + 1 : 2
		);
	return newLabel;
};

export default uniqueCustomLabelGenerator;
