/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const {
    Icon,
    Button,
    Tooltip
} = wp.components;
const {
    toggleFormat,
    create,
    toHTMLString,
    getActiveFormat,
} = wp.richText;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarItalic } from '../../../../icons';

/**
 * TextFormatUnderline
 */
const TextFormatUnderline = props => {
    const {
        content,
        onChange,
        node,
        isList,
        typeOfList
    } = props;

    const formatName = 'core/underline';

    const formatElement = {
        element: node,
        html: content,
        multilineTag: isList ? 'li' : undefined,
        multilineWrapperTags: isList ? typeOfList : undefined,
        __unstableIsEditableTree: true
    }

    const { formatValue, isActive } = useSelect(
        select => {
            const {
                getSelectionStart,
                getSelectionEnd
            } = select('core/block-editor');

            const formatValue = create(formatElement);
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const activeFormat = getActiveFormat(formatValue, formatName);
            const isActive =
                !isNil(activeFormat) && activeFormat.type === formatName || false;

            return {
                formatValue,
                isActive
            }
        },
        [getActiveFormat, formatElement]
    )

    const onClick = () => {
        const newFormat = toggleFormat(formatValue, {
            type: formatName,
            isActive: isActive,
            attributes: {
                style: 'text-decoration: underline;',
            }
        });

        const newContent = toHTMLString({
            value: newFormat,
            multilineTag: isList ? 'li' : null,
        })

        onChange(newContent)
    }

    return (
        <Tooltip
            text={__('Underline', 'maxi-blocks')}
            position='bottom center'
        >
            <Button
                className='toolbar-item toolbar-item__underline'
                onClick={onClick}
                aria-pressed={isActive}
            >
                <Icon
                    className='toolbar-item__icon'
                    icon={toolbarItalic}
                />
            </Button>
        </Tooltip>
    )
}

export default TextFormatUnderline;