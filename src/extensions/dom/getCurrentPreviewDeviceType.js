/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getIsSiteEditor } from '@extensions/fse';

const getCurrentPreviewDeviceType = () => {
	// First, try to use the new preferred method if it exists
	if (select('core/editor') && select('core/editor').getDeviceType) {
		return select('core/editor').getDeviceType();
	}
	// Determine if we are in the site editor or post editor as a fallback
	const isSiteEditor = getIsSiteEditor(); // Ensure you have implemented this check
	const editorStore = isSiteEditor ? 'core/edit-site' : 'core/edit-post';

	// Check and call the deprecated method if available
	const storeSelect = select(editorStore);
	if (storeSelect.__experimentalGetPreviewDeviceType) {
		return storeSelect.__experimentalGetPreviewDeviceType();
	}
	console.error(
		__(
			'Unable to get the preview device type. The required method is not available.',
			'maxi-blocks'
		)
	);
	return 'Desktop'; // Fallback to 'Desktop' as a default
};

export default getCurrentPreviewDeviceType;
