/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { fromListToText, fromTextToList } from '../../extensions/text/formats';

const name = 'maxi-blocks/text-maxi';

const {
	getNextBlockClientId,
	getPreviousBlockClientId,
	getBlockAttributes,
} = select('core/block-editor');

const { removeBlock, updateBlockAttributes } = dispatch('core/block-editor');

export const onMerge = (props, forward) => {
	const { attributes, clientId, setAttributes } = props;
	const { isList, content } = attributes;

	if (forward) {
		const nextBlockClientId = getNextBlockClientId(clientId);

		if (nextBlockClientId) {
			const nextBlockAttributes = getBlockAttributes(nextBlockClientId);
			const nextBlockContent = nextBlockAttributes.content;
			const newBlockIsList = nextBlockAttributes.isList;

			const nextBlockContentNeedsTransform = isList !== newBlockIsList;
			const newNextBlockContent = nextBlockContentNeedsTransform
				? newBlockIsList
					? fromListToText(nextBlockContent)
					: fromTextToList(nextBlockContent)
				: nextBlockContent;

			setAttributes({
				content: content.concat(newNextBlockContent),
			});

			removeBlock(nextBlockClientId);
		}
	} else {
		const previousBlockClientId = getPreviousBlockClientId(clientId);

		if (!previousBlockClientId) {
			removeBlock(clientId);
		} else {
			const previousBlockAttributes = getBlockAttributes(
				previousBlockClientId
			);
			const previousBlockContent = previousBlockAttributes.content;

			updateBlockAttributes(previousBlockClientId, {
				content: previousBlockContent.concat(
					attributes.isList ? fromListToText(content) : content
				),
			});

			removeBlock(clientId);
		}
	}
};

export const onSplit = (attributes, value) => {
	if (!value) {
		return createBlock(name);
	}

	return createBlock(name, {
		...attributes,
		content: value,
	});
};
