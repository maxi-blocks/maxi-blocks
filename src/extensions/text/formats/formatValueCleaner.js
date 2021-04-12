/**
 * Reproduce the formatValue object as it is, with 'empty' slots instead of
 * 'null' or 'undefined' in the array 'formats'.
 */
const formatValueCleaner = formatValue => {
	const array = [];
	const response = {};
	const newFormatValue = { ...formatValue };
	const { formats } = newFormatValue;
	const totalLength = formats.length;

	array.length = totalLength;

	formats.forEach((format, i) => {
		if (format) response[i] = format;
	});

	Object.entries(response).forEach(([key, value]) => {
		array[key] = value;
	});

	formatValue.formats = array;

	return formatValue;
};

export default formatValueCleaner;
