/**
 * WordPress dependencies
 */
const { getActiveFormat } = wp.richText;

/**
 * Retrieves the current className of the 'maxi
 *
 * @param {Object} formatValue  		RichText format value
 * @param {string} formatName 			Format type
 *
 * @returns {string} Current className for Maxi Custom format
 */
const getCurrentFormatClassName = formatValue => {
	const formatOptions = getActiveFormat(
		formatValue,
		'maxi-blocks/text-custom'
	);

	const currentClassName =
		(formatOptions && formatOptions.attributes.className) || false;

	return currentClassName;
};

export default getCurrentFormatClassName;
