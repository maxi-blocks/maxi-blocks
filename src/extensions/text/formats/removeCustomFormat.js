/**
 * WordPress dependencies
 */
import { toHTMLString } from '@wordpress/rich-text';

/**
 * External dependencies
 */
import { inRange } from 'lodash';

const removeCustomFormat = ({ formatValue, className, isList }) => {
	const newFormatValue = { ...formatValue };
	const { start, end, formats } = newFormatValue;

	Object.entries(formats).forEach(([key, value], i) => {
		if (
			inRange(+key, start, end) &&
			value &&
			value[0].attributes.className === className
		)
			delete newFormatValue.formats[key];
	});

	const newContent = toHTMLString({
		value: newFormatValue,
		multilineTag: isList ? 'li' : null,
	});

	return {
		formatValue: newFormatValue,
		content: newContent,
	};
};

export default removeCustomFormat;
