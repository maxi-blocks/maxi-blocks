/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getFormatsOnMerge } from '@extensions/text/formats';
import { createBlock } from '@wordpress/blocks';

const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi', 'maxi-blocks/list-item-maxi'];

const onMerge = (props, forward) => {
	const { name: blockName, attributes, clientId, maxiSetAttributes } = props;
	const { content, 'custom-formats': customFormats } = attributes;

	const {
		getNextBlockClientId,
		getPreviousBlockClientId,
		getBlockAttributes,
		getBlock,
		getBlockIndex,
		getBlockOrder,
		getBlockParents,
	} = select('core/block-editor');

	const {
		removeBlock,
		insertBlock,
		updateBlockAttributes,
		__unstableMarkNextChangeAsNotPersistent: markNextChangeAsNotPersistent,
	} = dispatch('core/block-editor');

	if (forward) {
		const nextBlockClientId = getNextBlockClientId(clientId);
		const blockName = getBlock(nextBlockClientId)?.name;

		if (nextBlockClientId && blockName === 'maxi-blocks/text-maxi') {
			const nextBlockAttributes = getBlockAttributes(nextBlockClientId);
			const {
				content: nextBlockContent,
				'custom-formats': nextBlockCustomFormats,
			} = nextBlockAttributes;

			const { content: newContent, 'custom-formats': newCustomFormats } =
				getFormatsOnMerge(
					{ content, 'custom-formats': customFormats },
					{
						content: nextBlockContent,
						'custom-formats': nextBlockCustomFormats,
					}
				);

			maxiSetAttributes({
				content: newContent,
				'custom-formats': newCustomFormats,
			});

			removeBlock(nextBlockClientId);
		}
	} else {
		const previousBlockClientId = getPreviousBlockClientId(clientId);
		const previousBlockName = getBlock(previousBlockClientId)?.name;

		if (
			// Transform first `list-item-maxi` into `text-maxi` on merge
			!previousBlockClientId &&
			blockName === 'maxi-blocks/list-item-maxi'
		) {
			const blockParents = getBlockParents(
				clientId,
				'maxi-blocks/text-maxi'
			);
			const textMaxiParentClientId = blockParents.at(-1);

			if (!content) {
				const isOneListItem =
					getBlockOrder(textMaxiParentClientId).length === 1;

				removeBlock(isOneListItem ? textMaxiParentClientId : clientId);
				return;
			}

			const textMaxi = createBlock('maxi-blocks/text-maxi', {
				content,
				'custom-formats': customFormats,
			});

			const rootClientId = blockParents.at(-2);

			removeBlock(clientId);

			markNextChangeAsNotPersistent();
			insertBlock(
				textMaxi,
				getBlockIndex(textMaxiParentClientId),
				rootClientId
			);
		} else if (!ALLOWED_BLOCKS.includes(previousBlockName)) {
			// Basically removes the block when pressing backspace and there's not block before
			// Commented as is something we might want to come back in future
			// removeBlock(clientId);
		} else {
			const previousBlockAttributes = getBlockAttributes(
				previousBlockClientId
			);
			const {
				content: previousBlockContent,
				'custom-formats': previousBlockCustomFormats,
				isList,
			} = previousBlockAttributes;

			if (!isList && previousBlockName === blockName) {
				const {
					content: newContent,
					'custom-formats': newCustomFormats,
				} = getFormatsOnMerge(
					{
						content: previousBlockContent,
						'custom-formats': previousBlockCustomFormats,
					},
					{
						content,
						'custom-formats': customFormats,
					}
				);

				updateBlockAttributes(previousBlockClientId, {
					content: newContent,
					'custom-formats': newCustomFormats,
				});

				removeBlock(clientId);
			} else {
				const listItem = createBlock('maxi-blocks/list-item-maxi', {
					content,
					'custom-formats': customFormats,
				});

				const {
					insertBlock,
					__unstableMarkNextChangeAsNotPersistent:
						markNextChangeAsNotPersistent,
				} = dispatch('core/block-editor');

				removeBlock(clientId);

				markNextChangeAsNotPersistent();
				insertBlock(listItem, undefined, previousBlockClientId);
			}
		}
	}
};

export default onMerge;

export const getSVGListStyle = svg => {
	if (!svg) return '';

	let cleanedSVG = svg
		.replace(/"/g, "'")
		.replace(/>\s{1,}</g, '><')
		.replace(/\s{2,}/g, ' ')
		.replace("width='1em'", '')
		.replace("height='1em'", '');

	if (cleanedSVG.indexOf('http://www.w3.org/2000/svg') < 0) {
		cleanedSVG = cleanedSVG.replace(
			/<svg/g,
			"<svg xmlns='http://www.w3.org/2000/svg'"
		);
	}

	return cleanedSVG.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
};
