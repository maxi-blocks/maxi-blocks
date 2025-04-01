/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

const controls = {
	async GET_MAXI_BLOCKS_SAVED_STYLES() {
		try {
			console.log('GET: Fetching saved styles from API');
			const response = await apiFetch({
				path: '/maxi-blocks/v1.0/saved-styles',
			});
			console.log('GET: Raw API response:', response);
			// Only try to parse if response is a string
			const parsedResponse =
				typeof response === 'string' ? JSON.parse(response) : response;
			console.log('GET: Final response:', parsedResponse);
			return parsedResponse;
		} catch (err) {
			console.error('GET: Error getting styles:', err);
			return {};
		}
	},
	async SET_MAXI_BLOCKS_SAVED_STYLES(action) {
		const { styles } = action;

		if (!styles) {
			console.error('SET: No styles provided');
			return;
		}

		try {
			console.log('SET: Sending styles:', styles);
			const response = await apiFetch({
				path: '/maxi-blocks/v1.0/saved-styles',
				method: 'POST',
				data: {
					styles: JSON.stringify(styles),
				},
			});
			console.log('SET: Response:', response);
			return response;
		} catch (err) {
			console.error('SET: Error saving styles:', err);
			throw err;
		}
	},
};

export default controls;
