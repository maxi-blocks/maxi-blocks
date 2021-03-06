/**
 * Updates customData object on the store
 *
 * @param {Object} customData new/updated targets with customData
 *
 * @return {Object} Action object.
 */
export function updateCustomData(customData) {
	const hasContent =
		(!!customData &&
			Object.values(customData).some(target =>
				Object.values(target).some(val => !!val)
			)) ||
		false;

	return {
		type: 'UPDATE_CUSTOM_DATA',
		customData: (hasContent && customData) || false,
	};
}

/**
 * Targets to be removed from customData object on the store
 *
 * @param {Array} target target items to be removed
 *
 * @return {Object} Action object.
 */
export function removeCustomData(target) {
	return {
		type: 'REMOVE_CUSTOM_DATA',
		target,
	};
}

/**
 * Triggers the saver to the DB from the customData object on the store
 *
 * @param {boolean} isUpdate discerns between previewing or posting
 *
 * @return {Object} Action object.
 */
export function saveCustomData(isUpdate) {
	return {
		type: 'SAVE_CUSTOM_DATA',
		isUpdate,
	};
}
