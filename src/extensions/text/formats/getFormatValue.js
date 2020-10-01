/**
 * WordPress dependencies
 */
const { select } = wp.data;
const { create } = wp.richText;

/**
 * Generates RichText format value
 *
 * @param {Object} formatElement 		Preformatted object for RichText
 *
 * @returns {string} RichText format value
 */
const getFormatValue = formatElement => {
	const { getSelectionStart, getSelectionEnd } = select('core/block-editor');

	const formatValue = create(formatElement);
	formatValue.start = getSelectionStart().offset;
	formatValue.end = getSelectionEnd().offset;

	return formatValue;
};

export default getFormatValue;
