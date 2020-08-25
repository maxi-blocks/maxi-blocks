/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button } = wp.components;
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
 * Styles and icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * TextListOptions
 */
const TextListOptions = props => {
    const { blockName, content, typeOfList, isList, onChange, node } = props;

    if (blockName !== 'maxi-blocks/text-maxi' || !isList) return null;

    const { formatValue } = useSelect(
        select => {
            const { getSelectionStart, getSelectionEnd } = select(
                'core/block-editor'
            );
            const formatValue = create({
                element: node,
                html: content,
                multilineTag: 'li',
                multilineWrapperTags: typeOfList,
                // __unstableIsEditableTree: true
            });
            formatValue.start = getSelectionStart().offset;
            formatValue.end = getSelectionEnd().offset;

            return {
                formatValue,
            };
        },
        [node, content]
    );

    const onClick = type => {
        let newFormat = '';

        if (type === 'indent')
            newFormat = __unstableIndentListItems(formatValue, {
                type: typeOfList,
            });
        if (type === 'outdent')
            newFormat = __unstableOutdentListItems(formatValue);

        const newContent = toHTMLString({
            value: newFormat,
            multilineTag: 'li',
        });

        onChange(newContent);
    };

    return (
        <ToolbarPopover
            className='toolbar-item__list-options'
            tooltip={__('Text options', 'maxi-blocks')}
            icon={toolbarType}
            content={
                <Fragment>
                    <Button
                        className='toolbar-item__list-options__button'
                        onClick={() => onClick('indent')}
                    >
                        Right
                    </Button>
                    <Button
                        className='toolbar-item__list-options__button'
                        onClick={() => onClick('outdent')}
                    >
                        Left
                    </Button>
                </Fragment>
            }
        />
    );
};

export default TextListOptions;
