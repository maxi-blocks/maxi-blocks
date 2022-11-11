// source: https://github.com/WordPress/gutenberg/blob/7c467c773b7c391bfe40281a39ac5630688e3437/packages/rich-text/src/can-outdent-list-items.js
/**
 * Internal dependencies
 */

import getLineIndex from './getLineIndex';

/**
 * Checks if the selected list item can be outdented.
 *
 * @param {RichTextValue} value Value to check.
 *
 * @return {boolean} Whether or not the selected list item can be outdented.
 */
const canOutdentListItems = value => {
	const { replacements, start } = value;
	const startingLineIndex = getLineIndex(value, start);

	return replacements[startingLineIndex] !== undefined;
};

export default canOutdentListItems;
