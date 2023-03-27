/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsSiteEditor from './getIsSiteEditor';
import getSiteEditorIframeBody from './getSiteEditorIframeBody';

const getIsTemplatesListOpened = () =>
	getIsSiteEditor() && !getSiteEditorIframeBody();

export default getIsTemplatesListOpened;
