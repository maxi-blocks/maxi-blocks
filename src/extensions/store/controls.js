/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

const controls = {
	async RECEIVE_ADMIN_OPTIONS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/admin-options/' });
	},
	async RECEIVE_GENERAL_SETTINGS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/settings' });
	},
	async RECEIVE_BREAKPOINTS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/breakpoints/' });
	},
	async RECEIVE_MOTION_PRESETS() {
		return apiFetch({ path: '/maxi-blocks/v1.0/motion-presets/' });
	},
	async RECEIVE_DEVICE_TYPE() {
		const originalDeviceType = select('maxiBlocks').receiveMaxiDeviceType();

		return originalDeviceType === 'Desktop'
			? 'general'
			: originalDeviceType;
	},
	async SAVE_MOTION_PRESETS(action) {
		await apiFetch({
			path: '/maxi-blocks/v1.0/motion-presets/',
			method: 'POST',
			data: {
				presets: JSON.stringify(action.presets),
			},
		});
	},
};

export default controls;
