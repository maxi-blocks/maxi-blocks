/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

const controls = {
	async RECEIVE_GENERAL_SETTINGS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/settings' });
	},
	async SAVE_GENERAL_SETTING(settings) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/settings/',
			method: 'POST',
			data: {
				settings,
			},
		}).catch(err => {
			console.error(
				'Error saving general maxi setting. Code error: ',
				err
			);
		});
	},
	async RECEIVE_BREAKPOINTS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/breakpoints/' });
	},
	async RECEIVE_DEVICE_TYPE() {
		const originalDeviceType = select('maxiBlocks').receiveMaxiDeviceType();

		return originalDeviceType === 'Desktop'
			? 'general'
			: originalDeviceType;
	},
	async GET_MAXI_BLOCKS_SAVED_STYLES() {
		const response = await apiFetch({
			path: '/maxi-blocks/v1.0/saved-styles',
		});
		return response ? JSON.parse(response) : {};
	},
	async SET_MAXI_BLOCKS_SAVED_STYLES(styles) {
		console.log(
			'SET_MAXI_BLOCKS_SAVED_STYLES function called with styles:',
			styles
		);
		if (!styles) {
			console.log('No styles provided to SET_MAXI_BLOCKS_SAVED_STYLES');
			return;
		}
		console.log('styles in controls', styles);
		const stringifiedStyles = JSON.stringify(styles);
		console.log('stringifiedStyles', stringifiedStyles);
		await apiFetch({
			path: '/maxi-blocks/v1.0/saved-styles',
			method: 'POST',
			data: {
				stringifiedStyles,
			},
		}).catch(err => {
			console.error('Error saving styles. Code error: ', err);
		});
		return { styles };
	},
};

export default controls;
