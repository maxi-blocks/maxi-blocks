/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { capitalize, isEmpty } from 'lodash';

const removeCustomLabelNumber = customLabelToReplace =>
	customLabelToReplace.replace(/_\d+$/, '');

const getCustomLabelCount = customLabel => {
	const { getBlocks } = select('core/block-editor');

	// TODO: replace with goThroughMaxiBlocks helper which was created in #3887
	const goThroughBlocks = (blocks, customLabelToCompare) => {
		let currentCount = 0;

		blocks.forEach(block => {
			if (
				removeCustomLabelNumber(block.attributes.customLabel) ===
				customLabelToCompare
			)
				currentCount += 1;

			if (block.innerBlocks.length)
				currentCount += goThroughBlocks(
					block.innerBlocks,
					customLabelToCompare
				);
		});

		return currentCount;
	};

	const blocks = getBlocks();
	const repeatCount = goThroughBlocks(
		blocks,
		removeCustomLabelNumber(customLabel)
	);

	return repeatCount;
};

const getCustomLabel = (previousCustomLabel, uniqueID) => {
	const customLabelFromUniqueID = capitalize(uniqueID.replace('-maxi-', '_'));
	if (
		isEmpty(previousCustomLabel) ||
		removeCustomLabelNumber(previousCustomLabel) ===
			removeCustomLabelNumber(customLabelFromUniqueID)
	)
		return customLabelFromUniqueID;

	const customLabelCount = getCustomLabelCount(previousCustomLabel);
	return customLabelCount > 1
		? `${removeCustomLabelNumber(
				previousCustomLabel
		  ).trim()}_${customLabelCount}`
		: previousCustomLabel;
};

export default getCustomLabel;
