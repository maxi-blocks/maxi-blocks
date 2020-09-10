/**
 * WordPress dependencies
 */
const { removeFormat } = wp.richText;

/**
 * RemoveFormatWithClass
 */
const removeFormatWithClass = ({
	formatValue,
	formatName,
	typography,
	formatClassName,
}) => {
	const newFormatValue = removeFormat(formatValue, formatName);

	delete typography.customFormats[formatClassName];

	return {
		formatValue: newFormatValue,
		typography,
	};
};

export default removeFormatWithClass;
