/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    ColorPicker,
    Icon,
} = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * TextColor
 */
const TextColor = props => {
    const {
        blockName,
        typography,
        onChange,
        breakpoint
    } = props;


    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const updateTypography = val => {
        value[breakpoint].color = returnColor(val)

        onChange(JSON.stringify(value))
    }

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    }

    let value = !isObject(typography) ?
        JSON.parse(typography) :
        typography;

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            tooltip={__('Text options', 'maxi-blocks')}
            icon={(
                <div
                    className='toolbar-item__text-options__icon'
                    style={{
                        background: value[breakpoint].color,
                        borderWidth: '1px',
                        borderColor: '#fff',
                        borderStyle: 'solid',
                    }}
                >
                    <Icon
                        className='toolbar-item__text-options__inner-icon'
                        icon={toolbarType}
                    />
                </div>
            )}
            content={(
                <ColorPicker
                    color={value[breakpoint].color}
                    onChangeComplete={val => updateTypography(val)}
                />
            )}
        />
    )
}

export default TextColor;