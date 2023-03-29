/**
 * WordPress dependencies
 */
import { toHTMLString } from '@wordpress/rich-text';

/**
 * External dependencies
 */
import { inRange } from 'lodash';
import getFormatType from './getFormatType';

const removeCustomFormat = ({ formatValue, className, isList, isHover }) => {
	const newFormatValue = { ...formatValue };
	const { start, end, formats } = newFormatValue;

	Object.entries(formats).forEach(([key, value], i) => {
		const format = value.filter(
			val => val.type === getFormatType(isHover)
		)[0];
		if (
			inRange(+key, start, end) &&
			format &&
			format.attributes.className === className
		) {
			const index = value.indexOf(format);
			newFormatValue.formats[key].splice(index, 1);
		}
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
