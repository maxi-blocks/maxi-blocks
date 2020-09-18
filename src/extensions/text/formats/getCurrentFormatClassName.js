/**
 * WordPress dependencies
 */
const { getActiveFormat } = wp.richText;

/**
 *
 */
const getCurrentFormatClassName = (formatValue, formatName) => {
	const formatOptions = getActiveFormat(formatValue, formatName);

	const currentClassName =
		(formatOptions && formatOptions.attributes.className) || false;

	return currentClassName;
};

export default getCurrentFormatClassName;
