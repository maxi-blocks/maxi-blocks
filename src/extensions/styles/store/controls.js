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
		const id = select('core/editor').getCurrentPostId();
		const parsedStyles = frontendStyleGenerator(styles);
		const fonts = select('maxiBlocks/text').getPostFonts();

		console.log('FONTS:');
		console.log(fonts);

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
