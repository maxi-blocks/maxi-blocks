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

	if (getBlockAttributes(id)?.blockStyle)
		return blockSwitcher(getBlockAttributes(id)?.blockStyle);

	const rootClientId = getBlockHierarchyRootClientId(id);
	const rootAttributes = getBlockAttributes(rootClientId);

	return blockSwitcher(rootAttributes?.blockStyle);
};

export default getBlockStyle;
