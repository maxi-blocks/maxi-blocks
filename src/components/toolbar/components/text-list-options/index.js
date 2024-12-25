/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { TextContext } from '@extensions/text/formats';
import {
	canIndentListItems,
	canOutdentListItems,
	indentListItems,
	outdentListItems,
	toHTMLString,
} from '@extensions/text/lists';

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
} from '@maxi-icons';

/**
 * TextListOptions
 */
const TextListOptions = props => {
	const { blockName, isList, typeOfList, onChange, content, clientId } =
		props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const { formatValue } = useContext(TextContext);

	const onChangeIndent = type => {
		let newFormat = '';

		if (type === 'indent')
			newFormat = indentListItems(formatValue, {
				type: typeOfList,
			});

		if (type === 'outdent') newFormat = outdentListItems(formatValue);

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: 'li',
		});

		onChange({ isList: true, typeOfList, content: newContent });
	};

	const onChangeList = type => {
		if (isList && type === typeOfList) return;

		const changeObject = {
			isList: true,
			typeOfList: type,
			content,
		};

		if (!isList) {
			const contentArray = content.split('\n');
			const listItemBlocks = contentArray.map(liContent =>
				createBlock('maxi-blocks/list-item-maxi', {
					content: liContent,
				})
			);

			const {
				replaceInnerBlocks,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = dispatch('core/block-editor');

			markNextChangeAsNotPersistent();
			replaceInnerBlocks(clientId, listItemBlocks);

			onChange(changeObject);
		} else {
			onChange(changeObject);
		}
	};

	const onChangeP = () => {
		if (!isList) return;

		const { getBlock } = select('core/block-editor');
		const content = getBlock(clientId).innerBlocks.reduce(
			(acc, block) =>
				acc
					? `${acc}\n${block.attributes.content}`
					: block.attributes.content,
			''
		);
		onChange({
			isList: false,
			content,
		});

		const {
			replaceInnerBlocks,
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		replaceInnerBlocks(clientId, []);
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
