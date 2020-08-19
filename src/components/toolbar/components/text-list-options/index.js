/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { IconButton } = wp.components;
const { useSelect } = wp.data;
const {
    __unstableIndentListItems,
    __unstableOutdentListItems,
    create,
    toHTMLString,
} = wp.richText;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

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
        content,
        typeOfList,
        isList,
        onChange,
        node
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const { formatValue } = useSelect(
        select => {
            const {
                getSelectionStart,
                getSelectionEnd
            } = select('core/block-editor');
            const formatValue = create({
                element: node,
                html: content,
                multilineTag: 'li',
                multilineWrapperTags: typeOfList,
                // __unstableIsEditableTree: true
            });
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            return {
                formatValue,
            }
        },
        [node, content]
    )

    const getContent = content => {

        let newContent = content;

        // if (isList) {
        //     newContent = content
        //         .replace(/<li>/gi, '')
        //         .replace(/<\/li>(?=.*<\/li>)/gi, '<br>')
        //         .replace(/<\/li>/gi, '');
        // }

        if (!isList) {
            newContent = '';
            newContent = `<li>${content.replace(/<br>/gi, '</li><li>')}</li>`;
        }

        return newContent;
    }

    const onChangeIndent = type => {
        let newFormat = '';

        if (type === 'indent')
            newFormat = __unstableIndentListItems(formatValue, { type: typeOfList });

        if (type === 'outdent')
            newFormat = __unstableOutdentListItems(formatValue, { type: typeOfList });

        const newContent = toHTMLString({
            value: newFormat,
            multilineTag: 'li',
        })

        onChange(true, typeOfList, newContent)
    }

    return (
        <ToolbarPopover
            className='toolbar-item__list-options'
            tooltip={__('List options', 'maxi-blocks')}
            icon={toolbarUnorderedList}
            advancedOptions='list options'
            content={(
                <div className='toolbar-item__popover__list-options'>
                    <IconButton
                        className='toolbar-item__popover__list-options__button'
                        icon={toolbarOrderedList}
                        onClick={() => onChange(true, 'ol', getContent(content))}
                        aria-pressed={isList && typeOfList === 'ol'}
                    />
                    <IconButton
                        className='toolbar-item__popover__list-options__button'
                        icon={toolbarUnorderedList}
                        onClick={() => onChange(true, 'ul', getContent(content))}
                        aria-pressed={isList && typeOfList === 'ul'}
                    />
                    <IconButton
                        className='toolbar-item__popover__list-options__button'
                        icon={toolbarOutdentList}
                        onClick={() => onChangeIndent('outdent')}
                    />
                    <IconButton
                        className='toolbar-item__popover__list-options__button'
                        icon={toolbarIndentList}
                        onClick={() => onChangeIndent('indent')}
                    />
                </div>
            )}
        />
    )
}

export default TextListOptions;