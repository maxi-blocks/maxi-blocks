/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * Controls
 */
const controls = {
	async RECEIVE_CUSTOM_DATA() {
		const id = select('core/editor').getCurrentPostId();

		return apiFetch({ path: `/maxi-blocks/v1.0/custom-data/${id}` });
	},
	async SAVE_CUSTOM_DATA({ isUpdate, customData }) {
		const id = select('core/editor').getCurrentPostId();

		await apiFetch({
			path: '/maxi-blocks/v1.0/custom-data',
			method: 'POST',
			data: {
				id,
				data: JSON.stringify(customData),
				update: isUpdate,
			},
		}).catch(err => {
			console.error('Error saving Custom Data. Code error: ', err);
		});
	},
};

export default controls;
