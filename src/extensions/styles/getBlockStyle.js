/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const blockSwitcher = style => {
	switch (style) {
		case 'maxi-dark':
		case 'dark':
			return 'dark';
		case 'maxi-light':
		case 'light':
		default:
			return 'light';
	}
};

const getBlockStyle = clientId => {
	const {
		getBlockHierarchyRootClientId,
		getBlockAttributes,
		getSelectedBlockClientId,
		getFirstMultiSelectedBlockClientId,
	} = select('core/block-editor');

	const id =
		clientId ||
		getSelectedBlockClientId() ||
		getFirstMultiSelectedBlockClientId();

	const {
		blockStyle: currentBlockStyle,
		blockStyleOriginal: blockStyleOriginal,
	} = getBlockAttributes(id);

	if (currentBlockStyle !== 'maxi-parent')
		return blockSwitcher(blockStyleOriginal);

	const rootClientId = getBlockHierarchyRootClientId(id);
	const rootAttributes = getBlockAttributes(rootClientId);
	const { blockStyleOriginal: rootBlockStyleOriginal } = rootAttributes;

	return blockSwitcher(rootBlockStyleOriginal);
};

export default getBlockStyle;
