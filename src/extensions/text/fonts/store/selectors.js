/**
 * Returns post styles.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Format types.
 */
export const getFonts = state => {
	if (state.fonts) return state.fonts;
	return state;
};

/**
 * Returns post styles.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Format types.
 */
export const getFont = (state, font) => {
	if (state.fonts) return state.fonts[font];
	return state;
};
