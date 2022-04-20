/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

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
		return getBlockAttributes(id).blockStyle;

	const rootClientId = getBlockHierarchyRootClientId(id);
	const rootAttributes = getBlockAttributes(rootClientId);

	return rootAttributes?.blockStyle;
};

export default getBlockStyle;
