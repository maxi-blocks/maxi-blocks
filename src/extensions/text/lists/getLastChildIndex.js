// source: https://github.com/WordPress/gutenberg/blob/7c467c773b7c391bfe40281a39ac5630688e3437/packages/rich-text/src/get-last-child-index.js
/**
 * Internal dependencies
 */

import { LINE_SEPARATOR } from './utils';

/**
 * Gets the line index of the last child in the list.
 *
 * @param {RichTextValue} value     Value to search.
 * @param {number}        lineIndex Line index of a list item in the list.
 *
 * @return {number} The index of the last child.
 */
const getLastChildIndex = ({ text, replacements }, lineIndex) => {
	const lineFormats = replacements[lineIndex] || [];
	// Use the given line index in case there are no next children.
	let childIndex = lineIndex;

	// `lineIndex` could be `undefined` if it's the first line.
	for (let index = lineIndex || 0; index < text.length; index += 1) {
		// We're only interested in line indices.
		if (text[index] !== LINE_SEPARATOR) {
			// eslint-disable-next-line no-continue
			continue;
		}

		const formatsAtIndex = replacements[index] || [];

		// If the amout of formats is equal or more, store it, then return the
		// last one if the amount of formats is less.
		if (formatsAtIndex.length >= lineFormats.length) {
			childIndex = index;
		} else {
			return childIndex;
		}
	}

	// If the end of the text is reached, return the last child index.
	return childIndex;
};

export default getLastChildIndex;
