import { isNumber } from 'lodash';
import { goThroughMaxiBlocks } from '../../maxi-block';

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
	if (state.styles) return state.styles[target];

	return false;
};

export const getPrevSavedAttrs = state => {
	if (state.prevSavedAttrs) return state.prevSavedAttrs;

	return false;
};

export const getCSSCache = (state, uniqueID, styleID) => {
	if (state.cssCache && state.cssCache[styleID])
		return state.cssCache[styleID];

	if (state.cssCache && state.cssCache[uniqueID])
		return state.cssCache[uniqueID];

	if (state.cssCache && !styleID && !uniqueID) return state.cssCache;

	return false;
};

export const getBlockMarginValue = state => {
	if (isNumber(state.blockMarginValue)) return state.blockMarginValue;

	return false;
};

export const getAllStylesAreSaved = state => {
	if (state.styles) {
		let allStylesAreSaved = true;

		goThroughMaxiBlocks(block => {
			const {
				attributes: { uniqueID },
			} = block;

			if (!state.styles[uniqueID]) allStylesAreSaved = false;
		});

		return allStylesAreSaved;
	}

	return false;
};

export const getDefaultGroupAttributes = state => {
	if (state.defaultGroupAttributes) return state.defaultGroupAttributes;

	return false;
};
