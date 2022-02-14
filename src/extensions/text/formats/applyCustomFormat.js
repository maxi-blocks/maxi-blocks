/**
 * WordPress dependencies
 */
import { applyFormat, toHTMLString } from '@wordpress/rich-text';

/**
 * Applies requested format and returns new content
 *
 * @param {Object}  [$0]             Optional named arguments.
 * @param {Object}  [$0.formatValue] RichText format value
 * @param {Object}  [$0.formatName]  MaxiBlocks typography
 * @param {Object}  [$0.isList]      Text Maxi block has list mode active
 * @param {boolean} [$0.attributes]  RichText format attributes
 * @returns {string} Format applied content
 */
const applyCustomFormat = ({ formatValue, formatName, isList, attributes }) => {
	const newFormat = applyFormat(formatValue, {
		type: formatName,
		...attributes,
	});

	const newContent = toHTMLString({
		value: newFormat,
		multilineTag: isList ? 'li' : null,
		preserveWhiteSpace: true,
	});

	return {
		content: newContent,
		formatValue: newFormat,
	};
};

export default applyCustomFormat;
