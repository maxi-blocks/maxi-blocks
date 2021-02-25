/**
 * Selectors
 */
const selectors = {
	receiveMaxiCloudLibrary(state, type) {
		if (state && state.cloudLibrary[type]) return state.cloudLibrary[type];
		return false;
	},
	receiveCloudCategories(state) {
		if (state) return state.cloudCat;
		return false;
	},
};

export default selectors;
