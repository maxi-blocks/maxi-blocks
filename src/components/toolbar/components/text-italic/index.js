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

    /**
     * Gets the all format objects at the start of the selection.
     * 
     * @param {Object} value                Value to inspect.
     * @param {Array}  EMPTY_ACTIVE_FORMATS Array to return if there are no active
     *                                      formats.
     *
     * @return {?Object} Active format objects.
     * 
     * @package Gutenberg
     * @see packages/rich-text/src/get-active-formats.js
     */
    const getActiveFormats = (
        { formats, start, end, activeFormats },
        EMPTY_ACTIVE_FORMATS = []
    ) => {
        if (start === undefined) {
            return EMPTY_ACTIVE_FORMATS;
        }

        if (start === end) {
            // For a collapsed caret, it is possible to override the active formats.
            if (activeFormats) {
                return activeFormats;
            }

            const formatsBefore = formats[start - 1] || EMPTY_ACTIVE_FORMATS;
            const formatsAfter = formats[start] || EMPTY_ACTIVE_FORMATS;

            // By default, select the lowest amount of formats possible (which means
            // the caret is positioned outside the format boundary). The user can
            // then use arrow keys to define `activeFormats`.
            if (formatsBefore.length < formatsAfter.length) {
                return formatsBefore;
            }

            return formatsAfter;
        }

        return formats[start] || EMPTY_ACTIVE_FORMATS;
    }

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

            const isActive = !!find(getActiveFormats(formatValue), { type: 'core/italic' });
            return {
                formatValue,
                isActive
            }
        },
        [getActiveFormats, node, content]
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
            text={__('Bold', 'maxi-blocks')}
            position='bottom center'
        >            <Button
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