/**
 * WordPress dependencies
 */
import { createBlock, getBlockAttributes } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import { insert } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import {
	generateFormatValue,
	getFormattedString,
	setCustomFormatsWhenPaste,
} from '../../extensions/text/formats';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty } from 'lodash';

const name = 'maxi-blocks/text-maxi';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/paragraph'],
			transform: ({ content }) => {
				return createBlock(name, {
					content,
				});
			},
		},
		{
			type: 'block',
			blocks: ['core/heading'],
			transform: ({ content, level }) => {
				return createBlock(name, {
					content,
					textLevel: `h${level}`,
				});
			},
		},
		{
			type: 'raw',
			selectors: 'p,h1,h2,h3,h4,h5,h6,ul,ol',
			isMatch: node => {
				const { getSelectedBlockClientId, getBlockName } =
					select('core/block-editor');

				const currentBlockName = getBlockName(
					getSelectedBlockClientId()
				);

				if (currentBlockName === 'maxi-blocks/text-maxi')
					return [
						'p',
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6',
						'ul',
						'ol',
					].includes(node.nodeName.toLowerCase());

				return false;
			},
			schema: ({ phrasingContentSchema, isPaste }) => {
				const schema = {
					children: phrasingContentSchema,
					attributes: isPaste ? [] : ['style', 'id'],
				};
				return {
					p: schema,
					h1: schema,
					h2: schema,
					h3: schema,
					h4: schema,
					h5: schema,
					h6: schema,
					ul: schema,
					ol: schema,
				};
			},
			transform: node => {
				const nodeName = node.nodeName.toLowerCase();
				const attributes = {
					...getBlockAttributes(name),
				};
				const isList = ['ul', 'ol'].includes(nodeName);
				attributes.content = node.innerHTML;

				if (isList) {
					attributes.isList = true;
					attributes.typeOfList = nodeName;
				} else attributes.textLevel = nodeName;

				const { textAlign } = node.style || {};

				if (
					textAlign === 'left' ||
					textAlign === 'center' ||
					textAlign === 'right'
				) {
					attributes['text-alignment-general'] = textAlign;
				}

				const formatElement = {
					multilineTag: isList ? 'li' : undefined,
					multilineWrapperTags: isList ? nodeName : undefined,
				};

				const formatValue = generateFormatValue(formatElement, node);

				const { typeOfList, content, textLevel } = attributes;

				const cleanCustomProps = setCustomFormatsWhenPaste({
					formatValue,
					typography: getGroupAttributes(attributes, 'typography'),
					isList,
					typeOfList,
					content,
					textLevel,
				});

				const newAttributes = {
					...attributes,
					...cleanCustomProps,
				};

				return createBlock(name, newAttributes);
			},
			priority: 1,
		},
		{
			type: 'enter',
			regExp: /[\s\S]*/,
			transform: () => {
				const {
					getSelectedBlockClientId,
					getBlock,
					getSelectionStart,
					getSelectionEnd,
				} = select('core/block-editor');

				const clientId = getSelectedBlockClientId();
				const block = getBlock(clientId);

				if (block.name !== 'maxi-blocks/text-maxi') return [{}];

				const { attributes } = block;
				const newAttributes = cloneDeep(attributes);

				const { updateBlockAttributes, selectionChange } =
					dispatch('core/block-editor');
				const { getFormatValue } = select('maxiBlocks/text');
				const { sendFormatValue } = dispatch('maxiBlocks/text');

				const formatValue = getFormatValue();

				let newFormatValue;
				let newContent;

				if (!isEmpty(formatValue)) {
					newFormatValue = insert(formatValue, '\n');
					newContent = getFormattedString({
						formatValue: newFormatValue,
						isList: newAttributes.isList,
					});
				} else {
					const end = getSelectionEnd().offset;
					const { content } = newAttributes;

					const splitContent = content.slice(end);
					const lastIndex = content.lastIndexOf(splitContent);

					if (lastIndex === -1) {
						newContent = content;
					} else {
						const beginString = content.substring(0, lastIndex);
						const endString = content.substring(
							lastIndex + splitContent.length
						);

						newContent = `${beginString}\n${splitContent}${endString}`;
					}
				}

				updateBlockAttributes(clientId, { content: newContent });
				if (newFormatValue && !isEmpty(newFormatValue))
					sendFormatValue(newFormatValue, clientId);

				// Ensures caret ends on correct place
				const { start, end } = newFormatValue || {
					start: getSelectionStart().offset,
					end: getSelectionEnd().offset,
				};
				const needPlus =
					newFormatValue?.text.length ?? newContent.length === end
						? 1
						: 0;

				selectionChange(clientId, 'content', start + needPlus, end);

				return [{}];
			},
		},
	],
};

export default transforms;
