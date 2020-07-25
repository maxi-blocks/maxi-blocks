/**
 * WordPress dependencies
 */
const apiFetch = wp.apiFetch;
const {
	registerStore,
	select
} = wp.data;

/**
 * Register Store
 */

const reducer = (state = { global-styles: {}, meta: {} }, action) => {
	switch (action.type) {
		case 'SEND_GLOBAL_STYLES':
			return {
				...state,
				global-styles: action.global_styles,
			}
	}

	return state;
};

const actions = {
	receiveMaxiStyles() {
		return {
			type: 'RECEIVE_GLOBAL_STYLES',
		};
	},
	sendMaxiStyles(meta) {
		return {
			type: 'SEND_POST_STYLES',
			meta
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
			breakpoints
		};
	},
	saveMaxiStyles(meta, update = false) {
		return {
			type: 'SAVE_POST_STYLES',
			meta,
			update
		}
	}
};

const controls = {
	async RECEIVE_GLOBAL_STYLES() {
		return await apiFetch({ path: '/maxi-blocks/v1.0/global-styles/' })
	},
	async SAVE_GLOBAL_STYLES(action) {

		await apiFetch(
			{
				path: '/maxi-blocks/v1.0/global-styles/',
				method: 'POST',
				data: {
					meta: JSON.stringify(action.meta),
					update: action.update
				}
			}
		)
	}
}

const selectors = {
	receiveMaxiStyles(state) {
		if (!!state)
			return state.meta;
	},
	receiveMaxiBreakpoints(state) {
		if (!!state)
			return state.breakpoints;
	},
};

const resolvers = {
	* receiveMaxiStyles() {
		const maxiStyles = yield actions.receiveMaxiStyles();
		return actions.sendMaxiStyles(maxiStyles);
	},
	* receiveMaxiBreakpoints() {
		const maxiBreakpoints = yield actions.receiveMaxiBreakpoints();
		return actions.sendMaxiBreakpoints(maxiBreakpoints);
	}
};

const store = registerStore('maxiBlocksGlobalStyles', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers
});