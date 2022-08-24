/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getSiteEditorIframeBody from './getSiteEditorIframeBody';

const getIsTemplatesListOpened = () =>
	!getSiteEditorIframeBody() && select('core/edit-site').isNavigationOpened();

export default getIsTemplatesListOpened;
