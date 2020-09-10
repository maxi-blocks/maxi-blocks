/**
 * WordPress dependencies
 */
const { getActiveFormat } = wp.richText;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * @param {Object} formatValue Format object for RichText
 * @param {string} formatName Format type
 */
const isFormatActive = (formatValue, formatName) => {
	const activeFormat = getActiveFormat(formatValue, formatName);
	const isActive =
		(!isNil(activeFormat) && activeFormat.type === formatName) || false;

	return isActive;
};

export default isFormatActive;
