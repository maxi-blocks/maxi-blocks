/**
 * WordPress dependencies
 */
const { toHTMLString } = wp.richText;

/**
 * @param {Object} param0 Data for generating a new string
 */
const getUpdatedString = ({ formatValue, isList }) => {
	const newContent = toHTMLString({
		value: formatValue,
		multilineTag: (isList && 'li') || null,
	});

	return newContent;
};

export default getUpdatedString;
