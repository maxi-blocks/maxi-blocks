/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsUniqueIDRepeated from '../maxi-block/getIsUniqueIDRepeated';

const uniqueIDGenerator = (blockName, diff = 0) => {
	const { getGlobalBlockCount } = select('core/block-editor');

	const newID = `${blockName
		.replace('maxi-blocks/', '')
		.replace(/[0-9]/g, '')}-${getGlobalBlockCount(blockName) + diff}`;

	if (getIsUniqueIDRepeated(newID, 0))
		return uniqueIDGenerator(blockName, diff + 1);

	return newID;
};

export default uniqueIDGenerator;
