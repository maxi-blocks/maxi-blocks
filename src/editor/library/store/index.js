/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

/**
 * Register Store
 */
const controls = {
	async RECEIVE_CLOUD_LIBRARY({ objType }) {
		return fetch(
			`http://localhost/maxiblocks/wp-json/maxi-blocks-API/v0.1/${objType}`
		)
			.then(response => response.json())
			.then(data => data)
			.catch(err => {
				console.error(err);
				return [];
			});
	},
};

const reducer = (
	state = {
		cloudLibrary: {
			pages: [],
			patterns: [],
			blocks: [],
			styleCards: [],
		},
	},
	action
) => {
	switch (action.type) {
		case 'SEND_CLOUD_LIBRARY':
			return {
				...state,
				cloudLibrary: {
					...state.cloudLibrary,
					[action.objType]: action.cloudLibrary,
				},
			};
		default:
			return state;
	}
};

const actions = {
	receiveMaxiCloudLibrary(type) {
		return {
			type: 'RECEIVE_CLOUD_LIBRARY',
			objType: type,
		};
	},
	sendMaxiCloudLibrary(cloudLibrary, objType) {
		return {
			type: 'SEND_CLOUD_LIBRARY',
			cloudLibrary,
			objType,
		};
	},
};

const selectors = {
	receiveMaxiCloudLibrary(state, type) {
		if (state && state.cloudLibrary[type]) return state.cloudLibrary[type];
		return false;
	},
};

const resolvers = {
	*receiveMaxiCloudLibrary(type) {
		const maxiCloudLibrary = yield actions.receiveMaxiCloudLibrary(type);
		return actions.sendMaxiCloudLibrary(maxiCloudLibrary, type);
	},
};

registerStore('maxiBlocks/cloudLibrary', {
	reducer,
	actions,
	selectors,
	controls,
	resolvers,
});
