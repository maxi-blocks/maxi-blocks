/**
 * WordPress dependencies
 */
const {
    ColorPicker,
    __experimentalGradientPicker
} = wp.components;

/**
 * External dependencies
 */
import { PopoverControl } from '../../popover/';
import GradientPickerPopover from '../../gradient-picker';
import { isNil } from 'lodash';

/**
 * Attributes
 */
export const colorControlAttributesTest = {
    colorTest: {
        type: 'string',
    },
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
export const ColorControlTest1 = props => {
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
                        <__experimentalGradientPicker
                            value={gradient}
                            onChange={val => onGradientChange(val)}
                        />
                    )
                }
            )
        }

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

export const ColorControlTest2 = props => {
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
        return response;
    }

    return (
        <div className="gx-color-control-2">
            <PopoverControl
                label={label}
                showReset
                popovers={getPopovers()}
            />
            {!isNil(showGradient) && 
	            <GradientPickerPopover
                    palette={gradient}
                    onPaletteChange={value => {
                        onGradientChange(value);
                    }}
                />
            }
        </div>
    )
}