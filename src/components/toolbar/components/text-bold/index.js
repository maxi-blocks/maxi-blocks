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
    getActiveFormat
} = wp.richText;

/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '../../../../icons';

/**
 * TextBold
 */
const TextBold = props => {
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
                element: node.querySelector('p'),
                html: content,
            });
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const isActive = find(getActiveFormat(formatValue, 'core/bold')) === 'core/bold';
            return {
                formatValue,
                isActive
            }
        },
        [getActiveFormat, node, content]
    )

    const onClick = () => {
        const newFormat = toggleFormat(formatValue, { type: 'core/bold' });

        const newContent = toHTMLString({
            value: newFormat
        })

        onChange(newContent)
    }

    return (
        <Tooltip
            text={__('Bold', 'maxi-blocks')}
            position='bottom center'
        >
            <Button
                className='toolbar-item toolbar-item__bold'
                onClick={onClick}
                aria-pressed={isActive}
            >
                <Icon
                    className='toolbar-item__icon'
                    icon={toolbarBold}
                />
            </Button>
        </Tooltip>
    )
}

export default TextBold;