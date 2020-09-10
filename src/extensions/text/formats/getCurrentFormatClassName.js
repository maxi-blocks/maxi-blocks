/**
 * WordPress dependencies
 */
const { getActiveFormat } = wp.richText;

/**
 *
 */
const getCurrentFormatClassName = (formatValue, formatName) => {
	const formatOptions = getActiveFormat(formatValue, formatName);
	const currentUnderlineClassName =
		(formatOptions && formatOptions.attributes.className) || '';

	return currentUnderlineClassName;
};

export default getCurrentFormatClassName;
