/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Controls
 */
const controls = {
	async RECEIVE_STYLE_CARDS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/style-cards/' }).then(sc =>
			JSON.parse(sc)
		);
	},
	async SAVE_STYLE_CARDS(action) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/style-cards/',
			method: 'POST',
			data: {
				styleCards: JSON.stringify(action.styleCards),
			},
		}).catch(err => {
			console.error('Error saving Style Card. Code error: ', err);
		});
	},
};

export default controls;
