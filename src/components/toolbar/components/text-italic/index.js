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
    getActiveFormat,
    toggleFormat,
    create,
    toHTMLString
} = wp.richText;

/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = props => {
    const {
        blockName,
        content,
        onChange,
        node
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const { formatValue, isActive } = useSelect(
        select => {
            const {
                getSelectionStart,
                getSelectionEnd
            } = select('core/block-editor');
            const formatValue = create({
                element: node,
                html: content,
            });
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const isActive = find(getActiveFormat(formatValue, 'core/italic')) === 'core/italic';
            return {
                formatValue,
                isActive
            }
        },
        [getActiveFormat, node, content]
    )

    const onClick = () => {
        const newFormat = toggleFormat(formatValue, { type: 'core/italic' });

        const newContent = toHTMLString({
            value: newFormat
        })

        onChange(newContent)
    }

    return (
        <Tooltip
            text={__('Italic', 'maxi-blocks')}
            position='bottom center'
        >
            <Button
                className='toolbar-item toolbar-item__italic'
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

export default TextItalic;