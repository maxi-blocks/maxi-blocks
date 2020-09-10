/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { create } = wp.richText;

/**
 * @param {Object} formatElement Format object for RichText
 */
const getFormatValue = formatElement => {
	const { getSelectionStart, getSelectionEnd } = select('core/block-editor');

	const formatValue = create(formatElement);
	formatValue.start = getSelectionStart().offset;
	formatValue.end = getSelectionEnd().offset;

	return formatValue;
};

export default getFormatValue;
