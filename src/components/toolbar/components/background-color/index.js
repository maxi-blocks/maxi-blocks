/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { ColorPicker } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
    const {
        blockName,
        background,
        onChange
    } = props;

    if (blockName === 'maxi-blocks/divider-maxi' || blockName === 'maxi-blocks/text-maxi' || blockName === 'maxi-blocks/svg-icon-maxi')
        return null;

    let value = typeof background != 'object' ?
        JSON.parse(background) :
        background;

    const updateBackground = val => {
        value.colorOptions.color = returnColor(val)

        onChange(JSON.stringify(value))
    }

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    }

    return (
        <ToolbarPopover
            className='toolbar-item__background'
            tooltip={__('Background color', 'maxi-blocks')}
            icon={(
                <div
                    className='toolbar-item__icon'
                    style={{
                        background: value.colorOptions.color,
                        border: '1px solid #fff'
                    }}
                ></div>
            )}
            content={(
                <ColorPicker
                    color={value.colorOptions.color}
                    onChangeComplete={val => updateBackground(val)}
                />
            )}
        />
    )
}

export default BackgroundColor;