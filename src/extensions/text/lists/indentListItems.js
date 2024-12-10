// source: https://github.com/WordPress/gutenberg/blob/a7e2895829c16ecd77a5ba22d84f1dee1cfb0977/packages/rich-text/src/indent-list-items.js

/**
 * Internal dependencies
 */
import { LINE_SEPARATOR } from './utils';
import getLineIndex from './getLineIndex';
import canIndentListItems from './canIndentListItems';

/**
 * Gets the line index of the first previous list item with higher indentation.
 *
 * @param {RichTextValue} value     Value to search.
 * @param {number}        lineIndex Line index of the list item to compare
 *                                  with.
 *
 * @return {number|void} The line index.
 */
const getTargetLevelLineIndex = ({ text, replacements }, lineIndex) => {
	const startFormats = replacements[lineIndex] || [];

	let index = lineIndex;

	// eslint-disable-next-line no-plusplus
	while (index-- >= 0) {
		if (text[index] !== LINE_SEPARATOR) {
			// eslint-disable-next-line no-continue
			continue;
		}

		const formatsAtIndex = replacements[index] || [];

		// Return the first line index that is one level higher. If the level is
		// lower or equal, there is no result.
		if (formatsAtIndex.length === startFormats.length + 1) {
			return index;
		}
		if (formatsAtIndex.length <= startFormats.length) {
			// eslint-disable-next-line consistent-return
			return;
		}
	}

	return null;
};

/**
 * Indents any selected list items if possible.
 *
 * @param {RichTextValue}  value      Value to change.
 * @param {RichTextFormat} rootFormat Root format.
 *
 * @return {RichTextValue} The changed value.
 */
const indentListItems = (value, rootFormat) => {
	if (!canIndentListItems(value)) {
		return value;
	}

	const lineIndex = getLineIndex(value);
	const previousLineIndex = getLineIndex(value, lineIndex);
	const { text, replacements, end } = value;
	const newFormats = replacements.slice();
	const targetLevelLineIndex = getTargetLevelLineIndex(value, lineIndex);

	for (let index = lineIndex; index < end; index += 1) {
		if (text[index] !== LINE_SEPARATOR) {
			// eslint-disable-next-line no-continue
			continue;
		}

		// Get the previous list, and if there's a child list, take over the
		// formats. If not, duplicate the last level and create a new level.
		if (targetLevelLineIndex) {
			const targetFormats = replacements[targetLevelLineIndex] || [];
			newFormats[index] = targetFormats.concat(
				(newFormats[index] || []).slice(targetFormats.length - 1)
			);
		} else {
			const targetFormats = replacements[previousLineIndex] || [];
			const lastformat =
				targetFormats[targetFormats.length - 1] || rootFormat;

			newFormats[index] = targetFormats.concat(
				[lastformat],
				(newFormats[index] || []).slice(targetFormats.length)
			);
		}
	}

	return {
		...value,
		replacements: newFormats,
	};
};

export default indentListItems;
