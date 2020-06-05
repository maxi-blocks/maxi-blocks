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
 * Internal dependencies
 */
import { CheckBoxControl } from '../index';
import PopoverControl from '../popover-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    colorWheel,
    gradient as iconGradient
} from '../../icons';

/**
 * Component
 */
const ColorControl = props => {
    const {
        label,
        className,
        disableColor = false,
        color,
        defaultColor = '',
        onColorChange,
        colorIcon = colorWheel,
        disableGradient = false,
        gradient,
        defaultGradient = '',
        onGradientChange,
        gradientIcon = iconGradient,
        disableGradientAboveBackground = false,
        gradientAboveBackground,
        onGradientAboveBackgroundChange,
    } = props;

    const classes = classnames(
        'maxi-colorcontrol',
        className
    );

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
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
                    classNamePopover: 'maxi-colorcontrol__popover',
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
                                <CheckBoxControl
                                    label={__('Above Background Image', 'maxi-blocks')}
                                    checked={gradientAboveBackground}
                                    onChange={val => onGradientAboveBackgroundChange(val)}
                                />
                            }
                        </Fragment>
                    ),
                    classNamePopover: 'maxi-colorcontrol__gradient-popover maxi-popover',
                    icon: gradientIcon
                }
            )
        }

        return response;
    }

    const onReset = () => {
            if (!disableColor)
                onColorChange(defaultColor);
            if (!disableGradient)
                onGradientChange(defaultGradient);
            if (!disableGradient && !disableGradientAboveBackground)
                onGradientAboveBackgroundChange(false);
    }

    return (
        <div className={classes}>
            <div className='maxi-colorcontrol__display'>
                <span
                    style={{
                        background: gradient ? gradient : color,
                    }}
                ></span>
            </div>
            <PopoverControl
                label={label}
                showReset
                onReset={onReset}
                popovers={getPopovers()}
            />
        </div>
    )
}

export default ColorControl;