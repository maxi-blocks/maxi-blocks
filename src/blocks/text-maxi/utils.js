/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';
import { split } from '@wordpress/rich-text';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Internal dependencies
 */
import {
	fromListToText,
	fromTextToList,
	getFormatsOnMerge,
} from '../../extensions/text/formats';
import flatFormatsWithClass from '../../extensions/text/formats/flatFormatsWithClass';
import getCurrentFormatClassName from '../../extensions/text/formats/getCurrentFormatClassName';
import getCustomFormat from '../../extensions/text/formats/getCustomFormat';
import getHasCustomFormat from '../../extensions/text/formats/getHasCustomFormat';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

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

			const { content: newContent, 'custom-formats': newCustomFormats } =
				getFormatsOnMerge(
					{ content, 'custom-formats': customFormats },
					{
						content: newNextBlockContent,
						'custom-formats': nextBlockCustomFormats,
					}
				);

			setAttributes({
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

export const onSplit = (
	attributes,
	splitContent,
	isExistentBlock,
	clientId
) => {
	const formatValue = select('maxiBlocks/text').getFormatValue(clientId);

	const hasCustomFormats = getHasCustomFormat(formatValue);

	if (!hasCustomFormats)
		return createBlock(name, {
			...attributes,
			content: splitContent,
		});

	const styleCard = select(
		'maxiBlocks/style-cards'
	).receiveMaxiSelectedStyleCard();

	const typography = cloneDeep(getGroupAttributes(attributes, 'typography'));

	const { isList, textLevel, parentBlockStyle } = attributes;

	const cleanedFormatValue = split(formatValue)[isExistentBlock ? 0 : 1];

	const formatClassName = getCurrentFormatClassName(cleanedFormatValue);
	const value = getCustomFormat(formatClassName) || {};

	const { typography: newTypography, content: newContent } =
		flatFormatsWithClass({
			formatValue: cleanedFormatValue,
			typography,
			content: splitContent,
			isList,
			textLevel,
			value,
			styleCard: styleCard[parentBlockStyle],
		});

	return createBlock(name, {
		...attributes,
		...newTypography,
		content: newContent,
	});
};
