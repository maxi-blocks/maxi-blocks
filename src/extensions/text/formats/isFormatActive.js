/**
 * WordPress dependencies
 */
import { getActiveFormat } from '@wordpress/rich-text';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Check if requested format type is active
 *
 * @param {Object} formatValue 			Format object for RichText
 * @param {string} formatName 			Format type
 *
 * @returns {boolean} Is the requested format active
 */
const isFormatActive = (formatValue, formatName) => {
	const activeFormat = getActiveFormat(formatValue, formatName);
	const isActive =
		(!isNil(activeFormat) && activeFormat.type === formatName) || false;

	return isActive;
};

export default isFormatActive;
