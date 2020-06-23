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
import { toolbarDividersetting } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
    const {
        blockName,
        divider1,
        onChange
    } = props;


    if (blockName != 'maxi-blocks/divider-maxi')
        return null;

    const updateDivider = val => {
        value.general['border-color'] = returnColor(val)

        onChange(JSON.stringify(value))
    }

    const returnColor = val => {
        return val.hex;
    }

    let value = typeof divider1 != 'object' ?
        JSON.parse(divider1) :
        divider1;

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            icon={(
                <div
                    className='toolbar-item__text-options__icon'
                    style={{
                        background: value.general['border-color'],
                        borderWidth: '1px',
                        borderColor: '#fff',
                        borderStyle: 'solid',
                    }}
                >
                    <Icon
                        className='toolbar-item__text-options__inner-icon'
                        icon={toolbarDividersetting}
                    />
                </div>
            )}
            content={(
                <ColorPicker
                    color={value.general['border-color']}
                    onChangeComplete={val => updateDivider(val)}
                />
            )}
        />
    )
}

export default DividerColor;