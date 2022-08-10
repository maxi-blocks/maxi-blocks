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
		const isSiteEditing = !!select('core/edit-site');
		const isTemplatePart =
			isSiteEditing &&
			select('core/edit-site').getEditedPostType() === 'wp_template_part';

		if (isTemplatePart) return;

		const id = isSiteEditing
			? select('core/edit-site').getEditedPostId()
			: select('core/editor').getCurrentPostId();

		const parsedStyles = await processCss(frontendStyleGenerator(styles));
		const fonts = select('maxiBlocks/text').getPostFonts();

		await apiFetch({
			path: '/maxi-blocks/v1.0/meta',
			method: 'POST',
			data: {
				id,
				meta: JSON.stringify({
					styles: parsedStyles,
					fonts,
				}),
				update: isUpdate,
				isTemplate: isSiteEditing,
			},
		}).catch(err => {
			console.error('Error saving styles. Code error: ', err);
		});
	},
};

export default controls;
