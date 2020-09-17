/**
 * WordPress dependencies
 */
const { applyFormat, toHTMLString } = wp.richText;

/**
 * @param {Object} param0 Data for generating a new string
 */
const getFormattedString = ({
	formatValue,
	formatName,
	isActive,
	isList,
	attributes,
}) => {
	const newFormat = applyFormat(formatValue, {
		type: formatName,
		isActive,
		...attributes,
	});

	const newContent = toHTMLString({
		value: newFormat,
		multilineTag: (isList && 'li') || null,
	});

	return newContent;
};

export default getFormattedString;
