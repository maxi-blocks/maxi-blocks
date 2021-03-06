/**
 * WordPress dependencies
 */
const { applyFormat, toHTMLString } = wp.richText;

/**
 * Applies requested format and returns new content
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.formatName]			MaxiBlocks typography
 * @param {Object} 	[$0.isList]				Text Maxi block has list mode active
 * @param {boolean} [$0.attributes]			RichText format attributes
 *
 * @returns {string} Format applied content
 */
const getFormattedString = ({
	formatValue,
	formatName,
	isList,
	attributes,
}) => {
	const newFormat = applyFormat(formatValue, {
		type: formatName,
		...attributes,
	});

	const newContent = toHTMLString({
		value: newFormat,
		multilineTag: (isList && 'li') || null,
	});

	return newContent;
};

export default getFormattedString;
