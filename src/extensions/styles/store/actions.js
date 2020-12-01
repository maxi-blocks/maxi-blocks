/**
 * Returns an action object used in signalling that format types have been
 * added.
 *
 * @param {Array|Object} formatTypes Format types received.
 *
 * @return {Object} Action object.
 */
export function updateStyles(styles) {
	return {
		type: 'UPDATE_STYLES',
		styles,
	};
}

/**
 * Returns an action object used in signalling that format types have been
 * added.
 *
 * @param {Array|Object} formatTypes Format types received.
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
 * Returns an action object used to remove a registered format type.
 *
 * @param {string|Array} names Format name.
 *
 * @return {Object} Action object.
 */
export function saveStyles(isUpdate) {
	return {
		type: 'SAVE_STYLES',
		isUpdate,
	};
}
