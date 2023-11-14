/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import ToolbarPopover from '../toolbar-popover';
import {
	fromListToText,
	fromTextToList,
	getFormattedString,
	textContext,
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
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const { formatValue } = useContext(textContext);

	const getContent = content => {
		if (!isList) return fromTextToList(content);
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

		if (!isList || typeOfList === type) {
			onChange({
				isList: !isList,
				typeOfList: type,
				content: getContent(content),
				listStyle: type === 'ol' ? 'decimal' : 'disc',
			});
		} else {
			onChange({
				isList,
				typeOfList: type,
				content,
				listStyle: type === 'ol' ? 'decimal' : 'disc',
			});
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
				content: getContent(content),
			});
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
