/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { minify } from 'minify'; // the ERROR

/**
 * Internal dependencies
 */
import frontendStyleGenerator from '../frontendStyleGenerator';

const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

async function processCss(code) {
	const css = await postcss([autoprefixer]).process(code).css;
	// add minify here
	return css;
}

/**
 * Controls
 */
const controls = {
	async SAVE_STYLES({ isUpdate, styles }) {
		const id = select('core/editor').getCurrentPostId();
		const parsedStyles = await processCss(frontendStyleGenerator(styles));
		const fonts = select('maxiBlocks/text').getPostFonts();

		await apiFetch({
			path: '/maxi-blocks/v1.0/post',
			method: 'POST',
			data: {
				id,
				meta: JSON.stringify({
					styles: parsedStyles,
					fonts,
				}),
				update: isUpdate,
			},
		}).catch(err => {
			console.error('Error saving styles. Code error: ', err);
		});
	},
};

export default controls;
