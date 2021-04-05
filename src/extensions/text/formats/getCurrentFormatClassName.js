/**
 * WordPress dependencies
 */
import { getActiveFormat } from '@wordpress/rich-text';

/**
 * Retrieves the current className of the 'maxi
 *
 * @param {Object} formatValue  		RichText format value
 * @param {boolean} isHover 			Is the requested typography under hover state
 *
 * @returns {string} Current className for Maxi Custom format
 */
const getCurrentFormatClassName = (formatValue, isHover = false) => {
	const formatOptions = getActiveFormat(
		formatValue,
		!isHover ? 'maxi-blocks/text-custom' : 'maxi-blocks/text-custom-hover'
	);

	const currentClassName =
		(formatOptions && formatOptions.attributes.className) || false;

	return currentClassName;
};

export default getCurrentFormatClassName;
