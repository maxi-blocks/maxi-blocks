/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { getBlockAttributes } = wp.blocks;

/**
 * Returns default property of the block
 *
 * @param {string} clientId Block's client id
 * @param {string} prop Claimed property to return
 */
const getDefaultProp = (prop, clientId = null) => {
	const { getBlockName, getSelectedBlockClientId } = select(
		'core/block-editor'
	);
	const blockName = clientId
		? getBlockName(clientId)
		: getBlockName(getSelectedBlockClientId());

	if (prop) return getBlockAttributes(blockName)[prop];
	return getBlockAttributes(blockName);
};

export default getDefaultProp;
