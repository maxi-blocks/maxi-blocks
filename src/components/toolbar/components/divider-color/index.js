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
import { toolbarDividersetting } from '../../../../icons';

/**
 * DividerColor
 */
const DividerColor = props => {
    const {
        blockName,
        divider,
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

    const value = !isObject(divider) ?
        JSON.parse(divider) :
        divider;

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            tooltip={__('Divider color', 'maxi-blocks')}
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