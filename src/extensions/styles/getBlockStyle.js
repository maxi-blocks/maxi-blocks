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

	// First check if the current block has a style defined
	// This ensures we use the block's own style when available
	const blockAttributes = getBlockAttributes(id);
	if (blockAttributes?.blockStyle) return blockAttributes.blockStyle;

	// Only check root if the current block doesn't have a style
	const rootClientId = getBlockHierarchyRootClientId(id);

	// Fix for WP 6.8 RC3: Don't use root style if it's the same as current block
	if (rootClientId && rootClientId !== id) {
		const rootAttributes = getBlockAttributes(rootClientId);
		if (rootAttributes?.blockStyle) return rootAttributes.blockStyle;
	}

	// Default to light if no style is found
	return 'light';
};

export default getBlockStyle;
