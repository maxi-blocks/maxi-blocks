import { select } from '@wordpress/data';
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
	if (state.styles) return state.styles[target];

	return false;
};

export const getPrevSavedAttrs = state => {
	if (state.prevSavedAttrs)
		return {
			prevSavedAttrs: state.prevSavedAttrs,
			prevSavedAttrsClientId: state.prevSavedAttrsClientId,
		};

	return false;
};

export const getCSSCache = (state, uniqueID) => {
	if (!state.cssCache) return false;

	if (uniqueID) {
		if (typeof state.cssCache.get === 'function') {
			return state.cssCache.get(uniqueID) || false;
		}

		if (state.cssCache[uniqueID]) return state.cssCache[uniqueID];

		return false;
	}

	return state.cssCache;
};

export const getBlockMarginValue = state => {
	if (isNumber(state.blockMarginValue)) return state.blockMarginValue;

	return false;
};

export const getAllStylesAreSaved = state => {
	if (state.styles) {
		const trackedBlocks = select('maxiBlocks/blocks')?.getBlocks?.() || {};
		const uniqueIDs = Object.keys(trackedBlocks);

		if (!uniqueIDs.length) return false;

		return uniqueIDs.every(uniqueID => !!state.styles[uniqueID]);
	}

	return false;
};

export const getDefaultGroupAttributes = state => {
	if (state.defaultGroupAttributes) return state.defaultGroupAttributes;

	return false;
};
