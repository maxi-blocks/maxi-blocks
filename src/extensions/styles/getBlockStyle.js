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
	const { getBlockHierarchyRootClientId, getBlockAttributes } = select(
		'core/block-editor'
	);
	const { blockStyle: currentBlockStyle } = getBlockAttributes(clientId);

	if (currentBlockStyle !== 'maxi-parent')
		return blockSwitcher(currentBlockStyle);

	const rootClientId = getBlockHierarchyRootClientId(clientId);
	const rootAttributes = getBlockAttributes(rootClientId);
	const { blockStyle: parentBlockStyle } = rootAttributes;

	return blockSwitcher(parentBlockStyle);
};

export default getBlockStyle;
