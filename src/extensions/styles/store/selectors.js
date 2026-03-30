import { isNumber } from 'lodash';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';

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
	if (state.cssCache && state.cssCache[uniqueID])
		return state.cssCache[uniqueID];

	if (state.cssCache && !uniqueID) return state.cssCache;

	return false;
};

export const getBlockMarginValue = state => {
	if (isNumber(state.blockMarginValue)) return state.blockMarginValue;

	return false;
};

export const getAllStylesAreSaved = state => {
	if (state.styles) {
		let allStylesAreSaved = true;

		// skipTemplateParts=true: template part blocks are managed as separate
		// entities and their styles are not registered in the current editor's
		// store until they're rendered inline. Checking them causes false
		// negatives that permanently block saving.
		goThroughMaxiBlocks(
			block => {
				const {
					attributes: { uniqueID },
				} = block;

				// Skip blocks without uniqueID (e.g. maxi-cloud)
				if (!uniqueID) return;

				if (!state.styles[uniqueID]) allStylesAreSaved = false;
			},
			false,
			undefined,
			true
		);

		return allStylesAreSaved;
	}

	return false;
};

export const getDefaultGroupAttributes = state => {
	if (state.defaultGroupAttributes) return state.defaultGroupAttributes;

	return false;
};
