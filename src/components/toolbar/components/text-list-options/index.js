/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import {
	__unstableIndentListItems,
	__unstableCanIndentListItems,
	__unstableOutdentListItems,
	__unstableCanOutdentListItems,
	toHTMLString,
} from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import {
	fromListToText,
	fromTextToList,
	getFormattedString,
	withFormatValue,
} from '../../../../extensions/text/formats';

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
const TextListOptions = withFormatValue(props => {
	const { blockName, formatValue, isList, typeOfList, onChange } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const getContent = content => {
		if (!isList) return fromTextToList(content);
		return fromListToText(content);
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
		const content = getFormattedString({ formatValue, isList });

		if (!isList || typeOfList === type)
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
					{!isEmpty(formatValue) &&
						__unstableCanOutdentListItems(formatValue) && (
							<Button
								className='toolbar-item__popover__list-options__button'
								icon={toolbarOutdentList}
								onClick={() => onChangeIndent('outdent')}
							/>
						)}
					{!isEmpty(formatValue) &&
						__unstableCanIndentListItems(formatValue) && (
							<Button
								className='toolbar-item__popover__list-options__button'
								icon={toolbarIndentList}
								onClick={() => onChangeIndent('indent')}
							/>
						)}
				</div>
			}
		/>
	);
});

export default TextListOptions;
