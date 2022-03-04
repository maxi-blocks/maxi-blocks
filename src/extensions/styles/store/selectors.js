/**
 * Returns post styles.
 *
 * @param {Object} state Data state.
 * @return {Array} Format types.
 */
export const getPostStyles = state => {
	if (state.styles) return state.styles;
	return state;
};

/**
 * Returns the block styles.
 *
 * @param {Object} state Data state.
 * @return {Array} Format types.
 */
export const getBlockStyles = (state, target) => {
	if (state.styles && state.styles) return state[target];

	return false;
};
