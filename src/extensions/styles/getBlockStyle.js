/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getBlockStyle = clientId => {
	const blockEditorStore = select('core/block-editor');
	if (!blockEditorStore) return 'light';

	const {
		getBlockHierarchyRootClientId,
		getBlockAttributes,
		getSelectedBlockClientId,
		getFirstMultiSelectedBlockClientId,
		getBlockParents,
	} = blockEditorStore;

	const id =
		clientId ||
		getSelectedBlockClientId() ||
		getFirstMultiSelectedBlockClientId();

	// First check if the current block has a style defined
	// This ensures we use the block's own style when available
	const blockAttributes = getBlockAttributes(id);
	if (blockAttributes?.blockStyle) return blockAttributes.blockStyle;

	// Check parent blocks hierarchy for blockStyle
	const parentIds = getBlockParents(id);
	for (const parentId of parentIds) {
		const parentAttributes = getBlockAttributes(parentId);
		if (parentAttributes?.blockStyle) return parentAttributes.blockStyle;
	}

	// Fallback to root if no parent has blockStyle
	const rootClientId = getBlockHierarchyRootClientId(id);
	if (rootClientId && rootClientId !== id) {
		const rootAttributes = getBlockAttributes(rootClientId);
		if (rootAttributes?.blockStyle) return rootAttributes.blockStyle;
	}

	// Default to light if no style is found
	return 'light';
};

export default getBlockStyle;
