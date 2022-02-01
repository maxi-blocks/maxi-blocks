/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	fromListToText,
	fromTextToList,
	getFormatsOnMerge,
} from '../../extensions/text/formats';

/**
 * External dependencies
 */
import { compact, findIndex, isNil, isEmpty } from 'lodash';

const {
	getNextBlockClientId,
	getPreviousBlockClientId,
	getBlockAttributes,
	getBlock,
} = select('core/block-editor');

const { removeBlock, updateBlockAttributes } = dispatch('core/block-editor');

const onMerge = (props, forward) => {
	const { attributes, clientId, handleSetAttributes } = props;
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

			const { content: newContent, 'custom-formats': newCustomFormats } =
				getFormatsOnMerge(
					{ content, 'custom-formats': customFormats },
					{
						content: newNextBlockContent,
						'custom-formats': nextBlockCustomFormats,
					}
				);

			handleSetAttributes({
				content: newContent,
				'custom-formats': newCustomFormats,
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

			const { content: newContent, 'custom-formats': newCustomFormats } =
				getFormatsOnMerge(
					{
						content: previousBlockContent,
						'custom-formats': previousBlockCustomFormats,
					},
					{
						content: attributes.isList
							? fromListToText(content)
							: content,
						'custom-formats': customFormats,
					}
				);

			updateBlockAttributes(previousBlockClientId, {
				content: newContent,
				'custom-formats': newCustomFormats,
			});

			removeBlock(clientId);
		}
	}
};

export const onReplaceBlocks = (blocks, clientId) => {
	const currentBlockIndex = findIndex(blocks, { clientId });
	const currentBlockExists = currentBlockIndex >= 0;
	const currentBlock = getBlock(clientId);

	const rawBlocks = compact([
		...(!currentBlockExists && [currentBlock]),
		...blocks,
	]);

	if (rawBlocks.length === 0) return false;

	const firstBlockContent = rawBlocks[0].attributes.content;
	const firstBlockEmpty =
		isNil(firstBlockContent) || isEmpty(firstBlockContent);

	// Ensures no empty value on first block
	if (firstBlockEmpty) rawBlocks.shift();

	const cleanBlocks = [];
	if (rawBlocks.length > 1)
		rawBlocks.reduce((currentBlock, nextBlock, i) => {
			const {
				textLevel: currentTextLevel,
				isList: currentIsList,
				typeOfList: currentTypeOfList,
			} = currentBlock.attributes;
			const { content, textLevel, isList, typeOfList } =
				nextBlock.attributes;

			if (
				textLevel === currentTextLevel ||
				(currentIsList && isList && currentTypeOfList === typeOfList)
			) {
				currentBlock.attributes.content += content;

				if (rawBlocks.length === i + 1)
					cleanBlocks.push(currentBlock, nextBlock);

				return currentBlock;
			}

			cleanBlocks.push(currentBlock);

			if (rawBlocks.length === i + 1) cleanBlocks.push(nextBlock);

			return nextBlock;
		});
	else cleanBlocks.push(rawBlocks[0]);

	return { blocks: cleanBlocks };
};

export default onMerge;

export const getSVGListStyle = svg => {
	if (!svg) return '';

	let cleanedSVG = svg
		.replace(/"/g, "'")
		.replace(/>\s{1,}</g, '><')
		.replace(/\s{2,}/g, ' ');

	if (cleanedSVG.indexOf('http://www.w3.org/2000/svg') < 0) {
		cleanedSVG = cleanedSVG.replace(
			/<svg/g,
			"<svg xmlns='http://www.w3.org/2000/svg'"
		);
	}

	return cleanedSVG.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
};
