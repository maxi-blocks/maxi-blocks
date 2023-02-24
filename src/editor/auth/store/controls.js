/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Controls
 */
const controls = {
	async RECEIVE_PRO_STATUS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/pro/' }).then(data =>
			JSON.parse(data)
		);
	},
	async SAVE_PRO_STATUS(data) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/pro/',
			method: 'POST',
			data: {
				data: JSON.stringify(data),
			},
		}).catch(err => {
			console.error('Error saving pro data. Code error: ', err);
		});
	},
};

export default controls;
