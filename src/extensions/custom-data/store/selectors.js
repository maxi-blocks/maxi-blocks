/**
 * Returns post customData.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Format types.
 */
// eslint-disable-next-line import/prefer-default-export
export const getPostCustomData = state => {
	if (state.customData) return state.customData;
	return state;
};
