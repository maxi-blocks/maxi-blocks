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
	async RECEIVE_DEVICE_TYPE() {
		const originalDeviceType = select(
			'core/edit-post'
		).__experimentalGetPreviewDeviceType();

		return originalDeviceType === 'Desktop'
			? 'general'
			: originalDeviceType;
	},
};

const reducer = (
	state = { breakpoints: {}, meta: {}, deviceType: 'general' },
	action
) => {
	switch (action.type) {
		case 'SEND_POST_STYLES':
			return {
				...state,
				meta: action.meta,
			};
		case 'SEND_BREAKPOINTS':
			return {
				...state,
				breakpoints: action.breakpoints,
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
	receiveMaxiDeviceType(state) {
		if (state) return state.deviceType;
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
