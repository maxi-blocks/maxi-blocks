/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getSiteEditorAndIsTemplatePart = () => {
	const isSiteEditor = !!select('core/edit-site');
	const isTemplatePart =
		isSiteEditor &&
		select('core/edit-site').getEditedPostType() === 'wp_template_part';

	return { isSiteEditor, isTemplatePart };
};

export default getSiteEditorAndIsTemplatePart;
