/**
 * WordPress dependencies
 */
import { toHTMLString } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import formatValueCleaner from './formatValueCleaner';

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
			newFormatValue.formats[key] = null;
	});

	const newContent = toHTMLString({
		value: formatValueCleaner(newFormatValue),
		multilineTag: isList ? 'li' : null,
	});

	return {
		formatValue: formatValueCleaner(newFormatValue),
		content: newContent,
	};
};

export default removeCustomFormat;
