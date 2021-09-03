/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * Controls
 */
const controls = {
	async SAVE_FONTS({ isUpdate, fonts }) {
		const id = select('core/editor').getCurrentPostId();

		await apiFetch({
			path: '/maxi-blocks/v1.0/post/fonts',
			method: 'POST',
			data: {
				id,
				meta: JSON.stringify({
					fonts,
				}),
				update: isUpdate,
			},
		});
	},
};

export default controls;
