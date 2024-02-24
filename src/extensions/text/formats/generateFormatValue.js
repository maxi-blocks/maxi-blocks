/**
 * WordPress dependencies
 */
import { create } from '@wordpress/rich-text';

/**
 * Generates RichText format value
 *
 * @param {Object} formatElement Preformatted object for RichText
 * @param {Object} node          Node DOM element
 *
 * @returns {Object} RichText format value
 */
const generateFormatValue = node => {
	const selection = node.ownerDocument.defaultView.getSelection();
	const formatElement = {};

	if (node) {
		const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

		formatElement.element = node;
		formatElement.range = range;

		const newFormat = create(formatElement);

		return newFormat;
	}
	if (selection.anchorNode) {
		const selectionNode =
			selection.anchorNode.parentElement.closest(
				'.maxi-text-block__content'
			) ||
			selection.anchorNode.parentElement.closest(
				'.maxi-button-block__content'
			);
		const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

		formatElement.element = selectionNode;
		formatElement.range = range;

		const newFormat = create(formatElement);

		return newFormat;
	}

	return create(formatElement);
};

export default generateFormatValue;
