// source: https://github.com/WordPress/gutenberg/blob/7c467c773b7c391bfe40281a39ac5630688e3437/packages/rich-text/src/outdent-list-items.js
/**
 * Internal dependencies
 */
import { LINE_SEPARATOR } from './utils';
import getLineIndex from './getLineIndex';
import getParentLineIndex from './getParentLineIndex';
import getLastChildIndex from './getLastChildIndex';
import canOutdentListItems from './canOutdentListItems';

/**
 * Outdents any selected list items if possible.
 *
 * @param {RichTextValue} value Value to change.
 *
 * @return {RichTextValue} The changed value.
 */
const outdentListItems = value => {
	if (!canOutdentListItems(value)) {
		return value;
	}

	const { text, replacements, start, end } = value;
	const startingLineIndex = getLineIndex(value, start);
	const newFormats = replacements.slice(0);
	const parentFormats =
		replacements[getParentLineIndex(value, startingLineIndex)] || [];
	const endingLineIndex = getLineIndex(value, end);
	const lastChildIndex = getLastChildIndex(value, endingLineIndex);

	// Outdent all list items from the starting line index until the last child
	// index of the ending list. All children of the ending list need to be
	// outdented, otherwise they'll be orphaned.
	for (let index = startingLineIndex; index <= lastChildIndex; index += 1) {
		// Skip indices that are not line separators.
		if (text[index] !== LINE_SEPARATOR) {
			// eslint-disable-next-line no-continue
			continue;
		}

		// In the case of level 0, the formats at the index are undefined.
		const currentFormats = newFormats[index] || [];

		// Omit the indentation level where the selection starts.
		newFormats[index] = parentFormats.concat(
			currentFormats.slice(parentFormats.length + 1)
		);

		if (newFormats[index].length === 0) {
			delete newFormats[index];
		}
	}

	return {
		...value,
		replacements: newFormats,
	};
};

export default outdentListItems;
