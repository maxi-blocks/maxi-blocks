/**
 * WordPress dependencies
 */
const { apiFetch } = wp;
/**
 * Controls
 */
const controls = {
	async RECEIVE_STYLE_CARDS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/style-cards/' });
	},
	async SAVE_STYLE_CARDS(action) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/style-cards/',
			method: 'POST',
			data: {
				styleCards: JSON.stringify(action.styleCards),
			},
		});
	},
};

export default controls;
