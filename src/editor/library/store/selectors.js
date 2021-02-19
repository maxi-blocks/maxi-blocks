/**
 * Selectors
 */
const selectors = {
	receiveMaxiCloudLibrary(state, type) {
		if (state && state.cloudLibrary[type]) return state.cloudLibrary[type];
		return false;
	},
};

export default selectors;
