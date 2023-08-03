/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import ToolbarPopover from '../toolbar-popover';
import { textContext } from '../../../../extensions/text/formats';
import {
	canIndentListItems,
	canOutdentListItems,
	indentListItems,
	outdentListItems,
	toHTMLString,
} from '../../../../extensions/text/lists';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	toolbarIndentList,
	toolbarOutdentList,
	toolbarOrderedList,
	toolbarUnorderedList,
} from '../../../../icons';
import { goThroughMaxiBlocks } from '../../../../extensions/maxi-block';

/**
 * TextListOptions
 */
const TextListOptions = props => {
	const { blockName, isList, typeOfList, onChange, clientId } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const { formatValue, content } = useContext(textContext);

	const onChangeIndent = type => {
		let newFormat = '';

		if (type === 'indent')
			newFormat = indentListItems(formatValue, {
				type: typeOfList,
			});

		if (type === 'outdent')
			newFormat = outdentListItems(formatValue, {
				type: typeOfList,
			});

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: 'li',
		});

		onChange({ isList: true, typeOfList, content: newContent });
	};

	const onChangeFromList = type => {
		let newContent = '';

		const { getBlocks } = select('core/block-editor');

		goThroughMaxiBlocks(block => {
			newContent += `${block.attributes.content}\n`;
		}, getBlocks(clientId));

		// Remove last \n
		newContent = newContent.slice(0, -1);

		onChange({
			isList: false,
			content: newContent,
			...(type && {
				typeOfList: type,
			}),
		});
	};

	const onChangeList = type => {
		if (!isList) {
			const splitContent = content.split('\n');

			const listItems = splitContent.map(content =>
				createBlock('maxi-blocks/text-maxi', { content })
			);

			dispatch('core/block-editor').replaceInnerBlocks(
				clientId,
				listItems,
				false
			);

			onChange({
				isList: true,
				typeOfList: type,
			});
		} else if (typeOfList === type) {
			onChangeFromList(type);
		} else
			onChange({
				isList,
				typeOfList: type,
			});
	};

	const onChangeP = () => {
		if (isList) onChangeFromList();
	};

	return (
		<ToolbarPopover
			className='toolbar-item__list-options'
			tooltip={__('List styles', 'maxi-blocks')}
			icon={toolbarUnorderedList}
		>
			<div className='toolbar-item__popover__list-options'>
				<Button
					className='toolbar-item__popover__list-options__button'
					onClick={() => onChangeP()}
					aria-pressed={!isList}
				>
					{__('P', 'maxi-blocks')}
				</Button>
				<Button
					className='toolbar-item__popover__list-options__button'
					icon={toolbarOrderedList}
					onClick={() => onChangeList('ol')}
					aria-pressed={isList && typeOfList === 'ol'}
				/>
				<Button
					className='toolbar-item__popover__list-options__button'
					icon={toolbarUnorderedList}
					onClick={() => onChangeList('ul')}
					aria-pressed={isList && typeOfList === 'ul'}
				/>
				{isList && !isEmpty(formatValue) && formatValue.formats && (
					<>
						{canOutdentListItems(formatValue) && (
							<Button
								className='toolbar-item__popover__list-options__button'
								icon={toolbarOutdentList}
								onClick={() => onChangeIndent('outdent')}
							/>
						)}
						{canIndentListItems(formatValue) && (
							<Button
								className='toolbar-item__popover__list-options__button'
								icon={toolbarIndentList}
								onClick={() => onChangeIndent('indent')}
							/>
						)}
					</>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default TextListOptions;
