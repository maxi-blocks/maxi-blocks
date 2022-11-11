// source: https://github.com/WordPress/gutenberg/blob/7c467c773b7c391bfe40281a39ac5630688e3437/packages/rich-text/src/get-parent-line-index.js
/**
 * Internal dependencies
 */
import { LINE_SEPARATOR } from './utils';

/**
 * Gets the index of the first parent list. To get the parent list formats, we
 * go through every list item until we find one with exactly one format type
 * less.
 *
 * @param {RichTextValue} value     Value to search.
 * @param {number}        lineIndex Line index of a child list item.
 *
 * @return {number|void} The parent list line index.
 */
const getParentLineIndex = ({ text, replacements }, lineIndex) => {
	const startFormats = replacements[lineIndex] || [];

	let index = lineIndex;

	// eslint-disable-next-line no-plusplus
	while (index-- >= 0) {
		if (text[index] !== LINE_SEPARATOR) {
			// eslint-disable-next-line no-continue
			continue;
		}

		const formatsAtIndex = replacements[index] || [];

		if (formatsAtIndex.length === startFormats.length - 1) {
			return index;
		}
	}

	return null;
};

export default getParentLineIndex;
