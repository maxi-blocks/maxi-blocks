/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { fromListToText, fromTextToList } from '../../extensions/text/formats';

/**
 * External dependencies
 */
import { isEmpty, merge } from 'lodash';

const name = 'maxi-blocks/text-maxi';

const {
	getNextBlockClientId,
	getPreviousBlockClientId,
	getBlockAttributes,
	getBlock,
} = select('core/block-editor');

const { removeBlock, updateBlockAttributes } = dispatch('core/block-editor');

export const onMerge = (props, forward) => {
	const { attributes, clientId, setAttributes } = props;
	const { isList, content, 'custom-formats': customFormats } = attributes;

	if (forward) {
		const nextBlockClientId = getNextBlockClientId(clientId);
		const blockName = getBlock(nextBlockClientId)?.name;

		if (nextBlockClientId && blockName === 'maxi-blocks/text-maxi') {
			const nextBlockAttributes = getBlockAttributes(nextBlockClientId);
			const {
				content: nextBlockContent,
				isList: nextBlockIsList,
				'custom-formats': nextBlockCustomFormats,
			} = nextBlockAttributes;

			const nextBlockContentNeedsTransform = isList !== nextBlockIsList;
			const newNextBlockContent = nextBlockContentNeedsTransform
				? nextBlockIsList
					? fromListToText(nextBlockContent)
					: fromTextToList(nextBlockContent)
				: nextBlockContent;

			setAttributes({
				content: content.concat(newNextBlockContent),
				...(!isEmpty(nextBlockCustomFormats) && {
					'custom-formats': merge(
						customFormats,
						nextBlockCustomFormats
					),
				}),
			});

			removeBlock(nextBlockClientId);
		}
	} else {
		const previousBlockClientId = getPreviousBlockClientId(clientId);
		const blockName = getBlock(previousBlockClientId)?.name;

		if (!previousBlockClientId || blockName !== 'maxi-blocks/text-maxi') {
			removeBlock(clientId);
		} else {
			const previousBlockAttributes = getBlockAttributes(
				previousBlockClientId
			);
			const {
				content: previousBlockContent,
				'custom-formats': previousBlockCustomFormats,
			} = previousBlockAttributes;

			updateBlockAttributes(previousBlockClientId, {
				content: previousBlockContent.concat(
					attributes.isList ? fromListToText(content) : content
				),
				...(!isEmpty(attributes['custom-formats']) && {
					'custom-formats': merge(
						attributes['custom-formats'],
						previousBlockCustomFormats
					),
				}),
			});

			removeBlock(clientId);
		}
	}
};

export const onSplit = (attributes, value) =>
	createBlock(name, {
		...attributes,
		content: value,
	});
