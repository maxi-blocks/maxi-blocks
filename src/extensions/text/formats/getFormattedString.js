/**
 * WordPress dependencies
 */
import { toHTMLString } from '@wordpress/rich-text';

/**
 * Updates the content of the string
 *
 * @param {Object} [$0]             Optional named arguments.
 * @param {Object} [$0.formatValue] RichText format value
 * @param {Object} [$0.isList]      Text Maxi block has list mode active
 * @returns {string} New formatted format content
 */
const getFormattedString = ({ formatValue, isList = false }) => {
	const newContent = toHTMLString({
		value: formatValue,
		multilineTag: isList ? 'li' : null,
	});

	return newContent;
};

export default getFormattedString;
