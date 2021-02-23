/**
 * WordPress dependencies
 */
const { apiFetch } = wp;
const { select } = wp.data;

const controls = {
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
