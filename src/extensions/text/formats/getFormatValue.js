/**
 * WordPress dependencies
 */
const { create } = wp.richText;

/**
 * Generates RichText format value
 *
 * @param {Object} formatElement 		Preformatted object for RichText
 *
 * @returns {Object} RichText format value
 */
const getFormatValue = formatElement => {
	const selection = window.getSelection();

	if (selection.anchorNode) {
		const selectionNode = selection.anchorNode.parentNode;
		const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

		formatElement.element = selectionNode;
		formatElement.range = range;

		const newFormat = create(formatElement);

		return newFormat;
	}

	return create(formatElement);
};

export default getFormatValue;
