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
import { isObject, find } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * Register format
 */
registerFormatType('maxi-blocks/text-color', {
    title: 'Text color',
    tagName: 'span',
    className: 'maxi-text-block--has-color',
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
    } = props;

    if (blockName != 'maxi-blocks/text-maxi') return null;

    const formatName = 'maxi-blocks/text-color';

    const { formatValue, isActive } = useSelect(
        (select) => {
            const { getSelectionStart, getSelectionEnd } = select(
                'core/block-editor'
            );
            const formatValue = create({
                element: node.querySelector('p'),
                html: content,
            });
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const isActive =
                find(getActiveFormat(formatValue, formatName)) === formatName;

            return {
                formatValue,
                isActive,
            };
        },
        [getActiveFormat, node, content]
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
                color: val.hex,
                style: `color: ${val.hex}`
            }
        });

        const newContent = toHTMLString({
            value: newFormat,
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

    const currentColor = isActive && formatValue.formats[formatValue.start].map(format => {
        if (format.type === 'maxi-blocks/text-color')
            return format.attributes.color;
    })[0] || '';

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
