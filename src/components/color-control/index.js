/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    ColorPicker,
    __experimentalGradientPicker
} = wp.components;

/**
 * External dependencies
 */
import { PopoverControl } from '../popover/';
import CheckBox from '../checkbox/';
import iconsSettings from '../icons/icons-settings.js';

/**
 * Styles
 */
import './editor.scss';

/**
 * Block
 */
const ColorControl = props => {
    const {
        label,
        disableColor = false,
        color,
        className,
        classes = className ? className + ' ' + 'gx-colorcontrol-control' : 'gx-colorcontrol-control',
        onColorChange,
        colorIcon = iconsSettings.colorWheel,
        disableGradient = false,
        gradient,
        onGradientChange,
        gradientIcon = iconsSettings.gradient,
        disableGradientAboveBackground = false,
        gradientAboveBackground,
        onGradientAboveBackgroundChange,
    } = props;

    const returnColor = val => {
        return `rgba(${val.rgb.r}, ${val.rgb.g}, ${val.rgb.b}, ${val.rgb.a})`;
    }

    const getPopovers = () => {
        let response = [];
        if (!disableColor) {
            response.push(
                {
                    content: (
                        <ColorPicker
                            color={color}
                            onChangeComplete={val => onColorChange(returnColor(val))}
                        />
                    ),
                    classNamePopover: "gx-colorcontrol-color-popover gx-popover",
                    icon: colorIcon
                },
            )
        }
        if (!disableGradient) {
            response.push(
                {
                    content: (
                        <Fragment>
                            <__experimentalGradientPicker
                                value={gradient}
                                onChange={val => onGradientChange(val)}
                            />
                            {disableGradientAboveBackground &&
                                <CheckBox
                                    label={__('Above Background Image', 'gutenberg-extra')}
                                    checked={gradientAboveBackground}
                                    onChange={val => onGradientAboveBackgroundChange(val)}
                                />
                            }
                        </Fragment>
                    ),
                    classNamePopover: "gx-colorcontrol-gradient-popover gx-popover",
                    icon: gradientIcon
                }
            )
        }

        return response;
    }

    return (
        <div className={classes}>
            <div className="gx-colorcontrol-color-display">
                <span
                    style={{
                        background: gradient ? gradient : color,
                    }}
                ></span>
            </div>
            <PopoverControl
                label={label}
                showReset
                onReset={() => {
                    onColorChange('');
                    onGradientChange('');
                    onGradientAboveBackgroundChange(false);
                }}
                popovers={getPopovers()}
            />
        </div>
    )
}

export default ColorControl;