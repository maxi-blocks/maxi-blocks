/**
 * Updates style object on the store
 *
 * @param {Object} styles new/updated targets with styles
 * @return {Object} Action object.
 */
export async function updateStyles(target = null, styles) {
	return {
		type: 'UPDATE_STYLES',
		target,
		styles,
	};
}

/**
 * Targets to be removed from style object on the store
 *
 * @param {Array} targets target items to be removed
 * @return {Object} Action object.
 */
export async function removeStyles(targets) {
	return {
		type: 'REMOVE_STYLES',
		targets,
	};
}

/**
 * Triggers the saver to the DB from the style object on the store
 *
 * @param {boolean} isUpdate discerns between previewing or posting
 * @return {Object} Action object.
 */
export function saveStyles(isUpdate) {
	return {
		type: 'SAVE_STYLES',
		isUpdate,
	};
}

export function savePrevSavedAttrs(prevSavedAttrs) {
	return {
		type: 'SAVE_PREV_SAVED_ATTRS',
		prevSavedAttrs: Object.keys(prevSavedAttrs),
	};
}

export const saveCSSCache = (
	uniqueID,
	styleID,
	stylesObj,
	isIframe,
	isSiteEditor
) => {
	return {
		type: 'SAVE_CSS_CACHE',
		uniqueID,
		styleID,
		stylesObj,
		isIframe,
		isSiteEditor,
	};
};

export const removeCSSCache = uniqueID => {
	return {
		type: 'REMOVE_CSS_CACHE',
		uniqueID,
	};
};

export const saveBlockMarginValue = blockMarginValue => {
	return {
		type: 'SAVE_BLOCK_MARGIN_VALUE',
		blockMarginValue,
	};
};
