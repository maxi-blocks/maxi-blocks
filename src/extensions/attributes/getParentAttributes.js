/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';

const getParentAttributes = (rawClientId, groupAttr) => {
	const clientId =
		rawClientId || select('core/block-editor').getSelectedBlockClientId();

	const { getBlockAttributes } = select('core/block-editor');

	const attributes = getBlockAttributes(
		wp.data.select('core/block-editor').getBlockRootClientId(clientId)
	);

	if (!groupAttr) return attributes;

	return getGroupAttributes(attributes, groupAttr);
};

export default getParentAttributes;
