/**
 * WordPress dependencies
 */
const { ColorPicker } = wp.components;

/**
 * External dependencies
 */
import { PopoverControl } from '../popover/';
import GradientPickerPopover from '../gradient-picker/test';
import { WrappedSketchPicker } from '../gradient-picker/test';
import { isNil } from 'lodash';

/**
 * Attributes
 */

export const colorControlAttributesTest = {
    gradientTest: {
        type: 'array',
        default: [
            { offset: '0.00', color: 'rgba(238, 55, 11, 1)' },
            { offset: '1.00', color: 'rgba(126, 32, 34, 1)' }
        ]
    }
}

/**
 * Block
 */
const ColorControl = props => {
    const {
        label,
        showColor = undefined,
        color,
        onColorChange,
        showGradient = undefined,
        gradient,
        onGradientChange
    } = props;

    const returnColor = val => {
        return `rgba(${val.rgb.r}, ${val.rgb.g}, ${val.rgb.b}, ${val.rgb.a})`;
    }

    const getPopovers = () => {
        let response = [];
        if (!isNil(showColor)) {
            response.push(
                {
                    content: (
                        <ColorPicker 
                            color={color}
                            onChangeComplete={val => onColorChange(returnColor(val))}
                        />
                    )
                },
            )
        }
        if (!isNil(showGradient)) {
            response.push(
                {
                    content: (
                        <GradientPickerPopover
                            palette={gradient}
                            onPaletteChange={val => onGradientChange(val)}
                        />
                    )
                }
            )
        }

        // TESTING
        response.push(
            {
                content: (
                    <WrappedSketchPicker 
                        rest={gradient}
                    />
                )
            }
        )


        return response;
    }

    return (
        <PopoverControl
            label={label}
            showReset
            popovers={getPopovers()}
        />
    )
}

export default ColorControl;