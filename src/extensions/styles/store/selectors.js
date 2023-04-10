import { isNumber } from 'lodash';

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

export const getCSSCache = (state, uniqueID) => {
	if (state.cssCache && state.cssCache[uniqueID])
		return state.cssCache[uniqueID];

	if (state.cssCache && !uniqueID) return state.cssCache;

	return false;
};

export const getBlockMarginValue = state => {
	if (isNumber(state.blockMarginValue)) return state.blockMarginValue;

	return false;
};
