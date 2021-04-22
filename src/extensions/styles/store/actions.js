/**
 * Updates style object on the store
 *
 * @param {Object} styles new/updated targets with styles
 *
 * @return {Object} Action object.
 */
export function updateStyles(target = null, styles) {
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
 *
 * @return {Object} Action object.
 */
export function removeStyles(targets) {
	return {
		type: 'REMOVE_STYLES',
		targets,
	};
}

/**
 * Triggers the saver to the DB from the style object on the store
 *
 * @param {boolean} isUpdate discerns between previewing or posting
 *
 * @return {Object} Action object.
 */
export function saveStyles(isUpdate) {
	return {
		type: 'SAVE_STYLES',
		isUpdate,
	};
}
