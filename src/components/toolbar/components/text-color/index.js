/**
 * WordPress dependencies
 */
const {
    ColorPicker,
    Icon,
} = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

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
        onChange
    } = props;


    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const updateTypography = val => {
        value.general.color = returnColor(val)

        onChange(JSON.stringify(value))
    }

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    }

    let value = typeof typography != 'object' ?
        JSON.parse(typography) :
        typography;

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            icon={(
                <div
                    className='toolbar-item__text-options__icon'
                    style={{
                        background: value.general.color,
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
                    color={value.general.color}
                    onChangeComplete={val => updateTypography(val)}
                />
            )}
        />
    )
}

export default TextColor;