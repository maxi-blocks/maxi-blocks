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

	const uniqueID = getBlockAttributes(id)?.uniqueID;
	if (uniqueID === 'container-maxi-cb5e2657-u') {
		console.log('uniqueID', uniqueID);
		console.log('id', id);
		console.log('clientId', clientId);
		console.log(
			'getBlockAttributes(id)?.blockStyle',
			getBlockAttributes(id)?.blockStyle
		);
	}

	if (getBlockAttributes(id)?.blockStyle)
		return getBlockAttributes(id).blockStyle;

	const rootClientId = getBlockHierarchyRootClientId(id);
	const rootAttributes = getBlockAttributes(rootClientId);

	if (getBlockAttributes(id)?.blockStyle) return rootAttributes?.blockStyle;

	return 'light';
};

export default getBlockStyle;
