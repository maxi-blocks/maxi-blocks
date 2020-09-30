/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { IconButton } = wp.components;
const {
	__unstableIndentListItems,
	__unstableCanIndentListItems,
	__unstableOutdentListItems,
	__unstableCanOutdentListItems,
	toHTMLString,
} = wp.richText;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import {
	__experimentalFromListToText,
	__experimentalFromTextToList,
} from '../../../../extensions/text/formats';

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
		formatValue,
		isList,
		typeOfList,
		content,
		onChange,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const getContent = content => {
		if (!isList) return __experimentalFromTextToList(content);
		return __experimentalFromListToText(content);
	};

	const onChangeIndent = type => {
		let newFormat = '';

		if (type === 'indent')
			newFormat = __unstableIndentListItems(formatValue, {
				type: typeOfList,
			});

		if (type === 'outdent')
			newFormat = __unstableOutdentListItems(formatValue, {
				type: typeOfList,
			});

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: 'li',
		});

		onChange({ isList: true, typeOfList, content: newContent });
	};

	const onChangeList = type => {
		if (typeOfList === type)
			onChange({
				isList: !isList,
				typeOfList: type,
				content: getContent(content),
			});
		else
			onChange({
				isList,
				typeOfList: type,
				content,
			});
	};

	return (
		<ToolbarPopover
			className='toolbar-item__list-options'
			tooltip={__('List options', 'maxi-blocks')}
			icon={toolbarUnorderedList}
			advancedOptions='list options'
			content={
				<div className='toolbar-item__popover__list-options'>
					<IconButton
						className='toolbar-item__popover__list-options__button'
						icon={toolbarOrderedList}
						onClick={() => onChangeList('ol')}
						aria-pressed={isList && typeOfList === 'ol'}
					/>
					<IconButton
						className='toolbar-item__popover__list-options__button'
						icon={toolbarUnorderedList}
						onClick={() => onChangeList('ul')}
						aria-pressed={isList && typeOfList === 'ul'}
					/>
					{__unstableCanOutdentListItems(formatValue) && (
						<IconButton
							className='toolbar-item__popover__list-options__button'
							icon={toolbarOutdentList}
							onClick={() => onChangeIndent('outdent')}
						/>
					)}
					{__unstableCanIndentListItems(formatValue) && (
						<IconButton
							className='toolbar-item__popover__list-options__button'
							icon={toolbarIndentList}
							onClick={() => onChangeIndent('indent')}
						/>
					)}
				</div>
			}
		/>
	);
};

export default TextListOptions;
