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

const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_POST_STYLES':
			return {
				...state,
				maxiStyles: action.maxiStyles,
			};
		case 'SEND_POST_STYLES':
			return {
				...state,
				meta: action.meta,
			}
		case 'SAVE_POST_STYLES':
			controls.SAVE_POST_STYLES(action);
			return {
				...state,
				meta: action.meta
			}
	}

	return state;
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
			meta
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
	async RECEIVE_POST_STYLES() {
		const id = select('core/editor').getCurrentPostId();

		return await apiFetch({ path: '/maxi-blocks/v1.0/maxi-blocks-styles/' + id })
			.catch(() => { return {} })
	},
	async SAVE_POST_STYLES(action) {
		const id = select('core/editor').getCurrentPostId();

		await apiFetch(
			{
				path: '/maxi-blocks/v1.0/maxi-blocks-styles',
				method: 'POST',
				data: {
					id,
					meta: JSON.stringify(action.meta),
					update: action.update
				}
			}
		)
	}
}

const selectors = {
	receiveMaxiStyles(state) {
		if(!!state)
			return state.meta;
	},
};

const resolvers = {
	* receiveMaxiStyles() {
		const maxiStyles = yield actions.receiveMaxiStyles();
		return actions.sendMaxiStyles(maxiStyles);
	}
};

const store = registerStore('maxiBlocks', {
	reducer,
	actions,
	selectors,
	controls, 
	resolvers
});