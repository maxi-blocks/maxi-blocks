/**
 * WordPress dependencies
 */
import { createBlock, getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	generateFormatValue,
	setCustomFormatsWhenPaste,
} from '@extensions/text/formats';
import { getGroupAttributes } from '@extensions/styles';

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

				if (!isList) {
					const formatValue = generateFormatValue(node);

					const { typeOfList, content, textLevel } = attributes;

					const cleanCustomProps = setCustomFormatsWhenPaste({
						formatValue,
						typography: getGroupAttributes(
							attributes,
							'typography'
						),
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
				}
				const listItemBlocks = Array.from(node.children).map(li =>
					createBlock('maxi-blocks/list-item-maxi', {
						content: li.textContent,
					})
				);

				return createBlock(
					'maxi-blocks/text-maxi',
					{
						...attributes,
						isList: true,
						typeOfList: nodeName,
						content: '',
					},
					listItemBlocks
				);
			},
			priority: 1,
		},
	],
};

export default transforms;
