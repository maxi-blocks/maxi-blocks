/**
 * External dependencies
 */
import { capitalize, isEmpty } from 'lodash';

const removeCustomLabelNumber = customLabelToReplace =>
	customLabelToReplace.replace(/_(\d+)\s*$/, '').trim();

const getCustomLabel = (previousCustomLabel, uniqueID) => {
	const customLabelFromUniqueID = capitalize(
		uniqueID?.replace('-maxi-', '_').replace('-temporal', '')
	);
	if (
		isEmpty(previousCustomLabel) ||
		removeCustomLabelNumber(previousCustomLabel) ===
			removeCustomLabelNumber(customLabelFromUniqueID)
	)
		return customLabelFromUniqueID;

	const number = uniqueID?.match(/-(\d+)$/)[1];
	return `${removeCustomLabelNumber(previousCustomLabel)}_${number}`;
};

export default getCustomLabel;
