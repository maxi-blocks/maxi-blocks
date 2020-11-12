/**
 * WordPress dependencies
 */
const { apiFetch } = wp;
const { registerStore, select, dispatch } = wp.data;

/**
 * Register Store
 */
const controls = {
	async RECEIVE_POST_STYLES() {
		const id = select('core/editor').getCurrentPostId();

		return apiFetch({ path: `/maxi-blocks/v1.0/post/${id}` });
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
	async RECEIVE_CLOUD_LIBRARY() {
		return fetch(
			'http://localhost/maxiblocks/wp-json/maxi-blocks-API/v0.1/patterns'
		)
			.then(response => response.json())
			.then(data => {
				return data;
			})
			.catch(err => console.error(err));
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
	async SAVE_POST_STYLES(action) {
		const id = select('core/editor').getCurrentPostId();

		await apiFetch({
			path: '/maxi-blocks/v1.0/post',
			method: 'POST',
			data: {
				id,
				meta: JSON.stringify(action.meta),
				update: action.update,
			},
		});
	},
};

const reducer = (
	state = {
		breakpoints: {},
		meta: {},
		deviceType: 'general',
		presets: '',
		cloudLibrary: {},
	},
	action
) => {
	switch (action.type) {
		case 'SEND_POST_STYLES':
			return {
				...state,
				meta: action.meta,
			};
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
		case 'SAVE_POST_STYLES':
			controls.SAVE_POST_STYLES(action);
			return {
				...state,
				meta: action.meta,
			};
		case 'SEND_DEVICE_TYPE':
			return {
				...state,
				deviceType: action.deviceType,
			};
		case 'SEND_CLOUD_LIBRARY':
			return {
				...state,
				cloudLibrary: action.cloudLibrary,
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
	receiveMaxiStyles() {
		return {
			type: 'RECEIVE_POST_STYLES',
		};
	},
	sendMaxiStyles(meta) {
		return {
			type: 'SEND_POST_STYLES',
			meta,
		};
	},
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
	saveMaxiStyles(meta, update = false) {
		return {
			type: 'SAVE_POST_STYLES',
			meta,
			update,
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
	receiveMaxiCloudLibrary() {
		return {
			type: 'RECEIVE_CLOUD_LIBRARY',
		};
	},
	sendMaxiCloudLibrary(cloudLibrary) {
		return {
			type: 'SEND_CLOUD_LIBRARY',
			cloudLibrary,
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
	receiveMaxiStyles(state) {
		if (state) return state.meta;
		return false;
	},
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
	receiveMaxiCloudLibrary(state) {
		if (state) return state.cloudLibrary;
		return false;
	},
};

const resolvers = {
	*receiveMaxiStyles() {
		const maxiStyles = yield actions.receiveMaxiStyles();
		return actions.sendMaxiStyles(maxiStyles);
	},
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
	*receiveMaxiCloudLibrary() {
		const maxiCloudLibrary = yield actions.receiveMaxiCloudLibrary();
		return actions.sendMaxiCloudLibrary(maxiCloudLibrary);
	},
};

registerStore('maxiBlocks', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});
