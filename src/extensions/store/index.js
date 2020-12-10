/**
 * WordPress dependencies
 */
const { apiFetch } = wp;
const { registerStore, select, dispatch } = wp.data;

/**
 * Register Store
 */
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

const reducer = (
	state = {
		breakpoints: {},
		deviceType: 'general',
		presets: '',
	},
	action
) => {
	switch (action.type) {
		case 'SEND_MOTION_PRESETS':
			return {
				...state,
				presets: action.presets,
			};
		case 'SEND_BREAKPOINTS':
			return {
				...state,
				breakpoints: action.breakpoints,
			};
		case 'SAVE_MOTION_PRESETS':
			controls.SAVE_MOTION_PRESETS(action);
			return {
				...state,
				presets: action.presets,
			};
		case 'SEND_DEVICE_TYPE':
			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'SET_DEVICE_TYPE':
			return {
				...state,
				deviceType: action.deviceType,
			};
		default:
			return state;
	}
};

const actions = {
	receiveMaxiBreakpoints() {
		return {
			type: 'RECEIVE_BREAKPOINTS',
		};
	},
	sendMaxiMotionPresets(presets) {
		return {
			type: 'SEND_MOTION_PRESETS',
			presets,
		};
	},
	receiveMaxiMotionPresets() {
		return {
			type: 'RECEIVE_MOTION_PRESETS',
		};
	},
	saveMaxiMotionPresets(presets) {
		return {
			type: 'SAVE_MOTION_PRESETS',
			presets,
		};
	},
	sendMaxiBreakpoints(breakpoints) {
		return {
			type: 'SEND_BREAKPOINTS',
			breakpoints,
		};
	},
	receiveMaxiDeviceType() {
		return {
			type: 'RECEIVE_DEVICE_TYPE',
		};
	},
	sendMaxiDeviceType(deviceType) {
		return {
			type: 'SEND_DEVICE_TYPE',
			deviceType,
		};
	},
	setMaxiDeviceType(deviceType, width) {
		const {
			__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		} = dispatch('core/edit-post');

		const gutenbergDeviceType =
			(deviceType === 'general' && 'Desktop') ||
			(width >= 1024 && 'Desktop') ||
			(width >= 768 && 'Tablet') ||
			(width < 768 && 'Mobile');

		setPreviewDeviceType(gutenbergDeviceType);

		return {
			type: 'SET_DEVICE_TYPE',
			deviceType,
		};
	},
};

const selectors = {
	receiveMaxiBreakpoints(state) {
		if (state) return state.breakpoints;
		return false;
	},
	receiveMaxiMotionPresets(state) {
		if (state) return state.presets;
		return false;
	},
	receiveMaxiDeviceType(state) {
		if (state) return state.deviceType;
		return false;
	},
};

const resolvers = {
	*receiveMaxiBreakpoints() {
		const maxiBreakpoints = yield actions.receiveMaxiBreakpoints();
		return actions.sendMaxiBreakpoints(maxiBreakpoints);
	},
	*receiveMaxiMotionPresets() {
		const maxiMotionPresets = yield actions.receiveMaxiMotionPresets();
		return actions.sendMaxiMotionPresets(maxiMotionPresets);
	},
	*receiveMaxiDeviceType() {
		const maxiDeviceType = yield actions.receiveMaxiDeviceType();
		return actions.sendMaxiDeviceType(maxiDeviceType);
	},
};

registerStore('maxiBlocks', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});
