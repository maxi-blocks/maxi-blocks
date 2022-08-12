/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import minifyCssString from 'minify-css-string';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

/**
 * Internal dependencies
 */
import frontendStyleGenerator from '../frontendStyleGenerator';
import { getIsSiteEditorAndIsTemplatePart } from '../../fse';

async function processCss(code) {
	const { css } = postcss([autoprefixer]).process(code);
	const minifiedCss = minifyCssString(css);

	return minifiedCss;
}

/**
 * Controls
 */
const controls = {
	async SAVE_STYLES({ isUpdate, styles }) {
		const { isSiteEditor, isTemplatePart } =
			getIsSiteEditorAndIsTemplatePart();

		if (isTemplatePart) return;

		const id = isSiteEditor
			? select('core/edit-site').getEditedPostId()
			: select('core/editor').getCurrentPostId();

		const parsedStyles = await processCss(frontendStyleGenerator(styles));
		const fonts = select('maxiBlocks/text').getPostFonts();

		await apiFetch({
			path: '/maxi-blocks/v1.0/styles',
			method: 'POST',
			data: {
				id,
				meta: JSON.stringify({
					styles: parsedStyles,
					fonts,
				}),
				update: isUpdate,
				isTemplate: isSiteEditor,
			},
		}).catch(err => {
			console.error('Error saving styles. Code error: ', err);
		});
	},
};

export default controls;
