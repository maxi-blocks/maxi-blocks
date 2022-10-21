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
	if (state.styles && state.styles) return state.styles[target];

	return false;
};

export const getPrevSavedAttrs = state => {
	if (state.prevSavedAttrs) return state.prevSavedAttrs;

	return false;
};
