/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker, Icon } = wp.components;
const { useSelect } = wp.data;
const {
    applyFormat,
    create,
    toHTMLString,
    getActiveFormat,
    registerFormatType
} = wp.richText;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isObject, isNil } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * Register format
 */
const formatName = 'maxi-blocks/text-color';

registerFormatType(formatName, {
    title: __('Text color', 'maxi-blocks'),
    tagName: 'span',
    className: 'maxi-text-block--has-text-color',
    attributes: {
        color: 'color',
        style: 'style'
    },
});

/**
 * TextColor
 */
const TextColor = (props) => {
    const {
        blockName,
        typography,
        onChange,
        node,
        content,
        breakpoint,
        isList,
        typeOfList
    } = props;

    if (blockName != 'maxi-blocks/text-maxi') return null;

    const formatElement = {
        element: node,
        html: content,
        multilineTag: isList ? 'li' : undefined,
        multilineWrapperTags: isList ? typeOfList : undefined,
        __unstableIsEditableTree: true
    }

    const { formatValue, isActive, currentColor } = useSelect(
        (select) => {
            const { getSelectionStart, getSelectionEnd } = select(
                'core/block-editor'
            );
            const formatValue = create(formatElement);
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const activeFormat = getActiveFormat(formatValue, formatName);
            const isActive =
                !isNil(activeFormat) && activeFormat.type === formatName || false;

            const currentColor =
                isActive && activeFormat.attributes.color || '';

            return {
                formatValue,
                isActive,
                currentColor
            };
        },
        [getActiveFormat, formatElement]
    );

    const onClick = (val) => {
        if (formatValue.start === formatValue.end) {
            updateTypography(val);
            return;
        }

        const newFormat = applyFormat(formatValue, {
            type: formatName,
            isActive: isActive,
            attributes: {
                style: `color: ${val.hex}`,
                color: val.hex
            }
        });

        const newContent = toHTMLString({
            value: newFormat,
            multilineTag: isList ? 'li' : null,
        });

        onChange({ typography: JSON.stringify(value), content: newContent });
    };

    const updateTypography = (val) => {
        value[breakpoint].color = returnColor(val);

        onChange({ typography: JSON.stringify(value), content: content });
    };

    const returnColor = (val) => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    };

    const value =
        (!isObject(typography) && JSON.parse(typography)) || typography;

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            tooltip={__('Text options', 'maxi-blocks')}
            icon={
                <div
                    className='toolbar-item__text-options__icon'
                    style={
                        isActive && {
                            background: currentColor
                        } || {
                            background: getLastBreakpointValue(
                                value,
                                'color',
                                breakpoint
                            ),
                        }
                    }
                >
                    <Icon
                        className='toolbar-item__text-options__inner-icon'
                        icon={toolbarType}
                    />
                </div>
            }
            content={
                <ColorPicker
                    color={isActive && currentColor || getLastBreakpointValue(value, 'color', breakpoint)}
                    onChangeComplete={(val) => onClick(val)}
                />
            }
        />
    );
};

export default TextColor;
