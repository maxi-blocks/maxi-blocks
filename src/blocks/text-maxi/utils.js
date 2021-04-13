/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { defaultTypography } from '../../extensions/text';
import {
	fromListToText,
	fromTextToList,
	generateFormatValue,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';
import { getGroupAttributes } from '../../extensions/styles';
/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const name = 'maxi-blocks/text-maxi';

const {
	getBlockIndex,
	getBlockRootClientId,
	getNextBlockClientId,
	getPreviousBlockClientId,
	getBlockAttributes,
} = select('core/block-editor');

const {
	insertBlock,
	removeBlock,
	selectBlock,
	updateBlockAttributes,
} = dispatch('core/block-editor');

export const onReplace = (props, blocks) => {
	const { attributes, clientId } = props;
	const { textLevel } = attributes;

	const currentBlocks = blocks.filter(item => !!item);

	if (isEmpty(currentBlocks)) {
		insertBlock(createBlock(name, getBlockAttributes(name)));
		return;
	}

	currentBlocks.forEach((block, i) => {
		let newBlock = {};

		switch (block.name) {
			case 'core/list': {
				const textTypography = {
					...getGroupAttributes(attributes, 'typography'),
					...defaultTypography.p,
				};

				newBlock = createBlock(name, {
					...attributes,
					textLevel: block.attributes.ordered ? 'ol' : 'ul',
					typeOfList: block.attributes.ordered ? 'ol' : 'ul',
					content: block.attributes.values,
					isList: true,
					...textTypography,
				});
				break;
			}
			case 'core/image':
				newBlock = createBlock('maxi-blocks/image-maxi', {
					...getBlockAttributes('maxi-blocks/image-maxi'),
					mediaURL: block.attributes.url,
					altSelector: 'custom',
					mediaALT: block.attributes.alt,
					captionType:
						(!isEmpty(block.attributes.caption) && 'custom') ||
						'none',
					captionContent: block.attributes.caption,
				});
				break;
			case 'core/heading': {
				const headingLevel = block.attributes.level;
				const headingTypography = {
					...getGroupAttributes(attributes, 'typography'),
					...defaultTypography[`h${headingLevel}`],
				};

				newBlock = createBlock(name, {
					...attributes,
					textLevel: `h${headingLevel}`,
					content: block.attributes.content,
					...headingTypography,
					isList: false,
				});
				break;
			}
			case 'core/paragraph': {
				const textTypography = {
					...getGroupAttributes(attributes, 'typography'),
					...defaultTypography.p,
				};

				newBlock = createBlock(name, {
					...attributes,
					content: block.attributes.content,
					textLevel: 'p',
					...textTypography,
				});
				break;
			}
			case 'maxi-blocks/text-maxi':
				if (block.attributes.isList) {
					newBlock = createBlock(name, {
						...block.attributes,
					});
				} else {
					newBlock = createBlock(name, {
						...attributes,
						content: block.attributes.content,
						isList: false,
					});
				}
				break;
			default:
				newBlock = block;
				break;
		}

		insertBlock(
			newBlock,
			getBlockIndex(clientId),
			getBlockRootClientId(clientId)
		).then(block => {
			const { attributes, clientId } = block.blocks[0];
			const { content, isList, typeOfList } = attributes;

			const formatElement = {
				multilineTag: isList ? 'li' : undefined,
				multilineWrapperTags: isList ? typeOfList : undefined,
				html: content,
			};
			const node = document.getElementById(clientId);
			const formatValue = generateFormatValue(formatElement, node);

			/**
			 * As Gutenberg doesn't allow to modify pasted content, let's do some cheats
			 * and add some coding manually
			 * This next script will check if there is any format directly related with
			 * native format 'core/link' and if it's so, will format it in Maxi Blocks way
			 */
			const cleanCustomProps = setCustomFormatsWhenPaste({
				formatValue,
				typography: getGroupAttributes(attributes, 'typography'),
				isList,
				typeOfList,
				content,
				textLevel,
			});

			if (cleanCustomProps)
				updateBlockAttributes(clientId, cleanCustomProps);
		});

		i === currentBlocks.length - 1 && selectBlock(block.clientId);
	});

	removeBlock(clientId);
};

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
