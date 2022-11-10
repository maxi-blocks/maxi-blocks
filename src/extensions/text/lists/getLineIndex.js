// source: https://github.com/WordPress/gutenberg/blob/a7e2895829c16ecd77a5ba22d84f1dee1cfb0977/packages/rich-text/src/get-line-index.js
/**
 * Internal dependencies
 */
import { LINE_SEPARATOR } from './utils';

/**
 * Gets the currently selected line index, or the first line index if the
 * selection spans over multiple items.
 *
 * @param {RichTextValue} value      Value to get the line index from.
 * @param {boolean}       startIndex Optional index that should be contained by
 *                                   the line. Defaults to the selection start
 *                                   of the value.
 *
 * @return {number|void} The line index. Undefined if not found.
 */
const getLineIndex = ({ start, text }, startIndex = start) => {
	let index = startIndex;

	// eslint-disable-next-line no-plusplus
	while (index--) {
		if (text[index] === LINE_SEPARATOR) {
			return index;
		}
	}

	return null;
};

export default getLineIndex;
