// source: https://github.com/WordPress/gutenberg/blob/7c467c773b7c391bfe40281a39ac5630688e3437/packages/rich-text/src/can-indent-list-items.js
/**
 * Internal dependencies
 */
import getLineIndex from './getLineIndex';

/**
 * Checks if the selected list item can be indented.
 *
 * @param {RichTextValue} value Value to check.
 *
 * @return {boolean} Whether or not the selected list item can be indented.
 */
const canIndentListItems = value => {
	const lineIndex = getLineIndex(value);

	// There is only one line, so the line cannot be indented.
	if (!lineIndex) {
		return false;
	}

	const { replacements } = value;
	const previousLineIndex = getLineIndex(value, lineIndex);
	const formatsAtLineIndex = replacements[lineIndex] || [];
	const formatsAtPreviousLineIndex = replacements[previousLineIndex] || [];

	// If the indentation of the current line is greater than previous line,
	// then the line cannot be furter indented.
	return formatsAtLineIndex.length <= formatsAtPreviousLineIndex.length;
};

export default canIndentListItems;
