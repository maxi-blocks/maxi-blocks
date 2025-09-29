/**
 * Lodash utilities
 */
import { isEqual } from 'lodash';

/**
 * Determine whether a setting is modified compared to its default value.
 * This is the single source of truth for displaying indicator dots.
 *
 * Behavior:
 * - Returns true when currentValue and defaultValue differ.
 * - Handles primitives via strict equality, including booleans and numbers.
 * - Handles objects and arrays via deep equality (lodash isEqual).
 * - Handles null/undefined gracefully: only equal if both are nullish.
 *
 * @param {*} currentValue Current effective value of the setting.
 * @param {*} defaultValue Effective default value of the setting.
 * @returns {boolean} True if modified (values differ), false if equal.
 */
const isSettingModified = (currentValue, defaultValue) => {
	// Deep compare only; 0 and false are valid values and must not be treated as empty
	return !isEqual(currentValue, defaultValue);
};

export default isSettingModified;
