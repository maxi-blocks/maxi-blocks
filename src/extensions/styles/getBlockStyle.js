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

	const rootClientId = getBlockHierarchyRootClientId(id);
	const rootAttributes = getBlockAttributes(rootClientId);

	if (rootAttributes?.blockStyle) return rootAttributes?.blockStyle;

	if (getBlockAttributes(id)?.blockStyle)
		return getBlockAttributes(id).blockStyle;

	return 'light';
};

export default getBlockStyle;
