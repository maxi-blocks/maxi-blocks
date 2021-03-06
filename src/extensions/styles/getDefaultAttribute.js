/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { getBlockAttributes } = wp.blocks;

/**
 * External dependencies
 */
import { isString, isArray, isNil } from 'lodash';
import getStyleCardAttr from './defaults/style-card';

/**
 * Returns the block name if they are all the same
 */
const getBlocksName = clientIds => {
	const { getBlockName } = select('core/block-editor');

	if (clientIds.length === 1) return getBlockName(clientIds[0]);

	const isSameBlockType = clientIds.some((block1, block2) => {
		return getBlockName(block1) !== getBlockName(block2);
	});

	if (isSameBlockType) return getBlockName(clientIds[0]);

	return false;
};

/**
 * Returns default property of the block
 *
 * @param {string} clientId Block's client id
 * @param {string} prop Claimed property to return
 */
const getDefaultAttribute = (prop, clientIds = null) => {
	const { getBlockName, getSelectedBlockClientIds } = select(
		'core/block-editor'
	);

	let blockName = '';

	if (isString(clientIds)) blockName = getBlockName(clientIds);
	else if (isArray(clientIds)) blockName = getBlocksName(clientIds);
	else if (isNil(clientIds))
		blockName = getBlocksName(getSelectedBlockClientIds());

	console.log(prop);
	// console.log(getStyleCardAttr());
	switch (prop) {
		case 'background-color':
			return '#eeeeee';
		case 'color-general':
			return '#000000';
		default: {
			return getBlockAttributes(blockName)[prop];
		}
	}

	// else {
	// if (blockName) {
	// 	console.log('returned: ' + getBlockAttributes(blockName)[prop]);
	// 	return getBlockAttributes(blockName)[prop];
	// }
	// }
};

export default getDefaultAttribute;
