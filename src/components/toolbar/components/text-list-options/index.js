/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import ToolbarPopover from '../toolbar-popover';
import {
	fromListToText,
	fromTextToList,
	getFormattedString,
	TextContext,
} from '../../../../extensions/text/formats';
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

/**
 * TextListOptions
 */
const TextListOptions = props => {
	const {
		blockName,
		isList,
		typeOfList,
		onChange,
		content: listContent,
		wpVersion,
		clientId,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const { formatValue } = useContext(TextContext);

	const getContent = (content, wpVersion) => {
		if (!isList) return fromTextToList(content, wpVersion);
		return fromListToText(content);
	};

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
		const content =
			wpVersion < 6.4
				? getFormattedString({ formatValue, isList })
				: listContent;

		const changeObject1 = {
			isList: !isList,
			typeOfList: type,
			content: getContent(content, wpVersion),
		};

		const changeObject2 = {
			isList,
			typeOfList: type,
			content,
		};

		if (wpVersion >= 6.4) {
			changeObject1.listStyle = type === 'ol' ? 'decimal' : 'disc';
			changeObject2.listStyle = type === 'ol' ? 'decimal' : 'disc';
		}

		if (!isList || typeOfList === type) {
			const block = createBlock('maxi-blocks/list-item-maxi', {
				content,
			});

			const {
				replaceInnerBlocks,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = dispatch('core/block-editor');

			markNextChangeAsNotPersistent();
			replaceInnerBlocks(clientId, [block]);

			onChange(changeObject1);
		} else {
			onChange(changeObject2);
		}
	};

	const onChangeP = () => {
		const content =
			wpVersion < 6.4
				? getFormattedString({ formatValue, isList })
				: listContent;

		if (isList) {
			onChange({
				isList: false,
				content: getContent(content, wpVersion),
			});

			const {
				replaceInnerBlocks,
				__unstableMarkNextChangeAsNotPersistent:
					markNextChangeAsNotPersistent,
			} = dispatch('core/block-editor');

			markNextChangeAsNotPersistent();
			replaceInnerBlocks(clientId, []);
		}
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
