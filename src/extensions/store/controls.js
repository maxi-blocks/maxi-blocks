/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

const controls = {
	async RECEIVE_GENERAL_SETTINGS() {
		// Return injected settings directly (no API call)
		if (window.maxiSettings) {
			return window.maxiSettings;
		} else {
			return apiFetch({ path: '/maxi-blocks/v1.0/settings' });
		}
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
};

export default controls;
