/**
 * WordPress dependencies
 */
const { ColorPicker } = wp.components;

/**
 * External dependencies
 */
import { PopoverControl } from '../popover';

/**
 * Block
 */
const ColorControl = props => {
    const {
        label,
        color,
        onChange
    } = props;

    const returnColor = val => {
        return `rgba(${val.rgb.r}, ${val.rgb.g}, ${val.rgb.b}, ${val.rgb.a})`;
    }

    return (
        <PopoverControl
            label={label}
            content={
                <ColorPicker 
                    color={color}
                    onChangeComplete={val => onChange(returnColor(val))}
                />
            }
        />
    )
}

export default ColorControl;