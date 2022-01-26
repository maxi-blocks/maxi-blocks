/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import frontendStyleGenerator from '../frontendStyleGenerator';

/**
 * Controls
 */
const controls = {
	async SAVE_STYLES({ isUpdate, styles }) {
		console.log('styles');
		console.log(styles);
		const id = select('core/editor').getCurrentPostId();
		const parsedStyles = frontendStyleGenerator(styles);
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
		});
	},
};

export default controls;
