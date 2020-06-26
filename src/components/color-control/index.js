/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState } = wp.element;
const {
    ColorPicker,
    RadioControl,
    Button,
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
    gradient as iconGradient,
    backgroundColor,
    backgroundImage,
    backgroundVideo,
    backgroundGradient,
    reset,
} from '../../icons';
import { Icon } from '@wordpress/icons';

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

    const onReset = () => {
            if (!disableColor)
                onColorChange(defaultColor);
            if (!disableGradient)
                onGradientChange(defaultGradient);
            if (!disableGradient && !disableGradientAboveBackground)
                onGradientAboveBackgroundChange(false);
    }

    const [backgroundItems, changeBackgroundItems] = useState('color');

    return (
        <div className={classes}>
            <div className='maxi-colorcontrol__items'>
                <span>{__('Background', 'maxi-blocks')}</span>
                <RadioControl
                    label=''
                    className=''
                    selected={backgroundItems}
                    options={[
                        { label: <Icon icon={backgroundColor} />, value: 'color' },
                        { label: <Icon icon={backgroundImage} />, value: 'image' },
                        { label: <Icon icon={backgroundVideo} />, value: 'video' },
                        { label: <Icon icon={backgroundGradient()} />, value: 'gradient' },
                    ]}
                    onChange={value => changeBackgroundItems(value)}
                />
            </div>
            <div className='maxi-colorcontrol__display'>
                <span className='maxi-colorcontrol__display__title'>
                    {__('Color', 'maxi-blocks')}
                </span>
                <div className='maxi-colorcontrol__display__color'>
                    <span
                        style={{
                            background: gradient ? gradient : color,
                        }}
                    ></span>
                    <Button
                        className="components-maxi-control__units-reset"
                        onClick={() => onReset()}
                        aria-label={sprintf(
                            /* translators: %s: a texual label  */
                            __('Reset %s settings', 'maxi-blocks'),
                            'font size'
                        )}
                        type="reset"
                    >
                        {reset}
                    </Button>
                </div>

            </div>
            {
                ( backgroundItems === 'color' ) &&
                <div className="maxi-colorcontrol__color">
                    <ColorPicker
                        color={color}
                        onChangeComplete={val => onColorChange(returnColor(val))}
                    />
                </div>
            }
            {
                ( backgroundItems === 'gradient' ) &&
                <div className="maxi-colorcontrol__gradient">
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
                </div>
            }
            {
                ( backgroundItems === 'image' ) &&
                <p>Image settings goes here soon</p>
            }
            {
                ( backgroundItems === 'video' ) &&
                <p>Video settings goes here soon</p>
            }
        </div>
    )
}

export default ColorControl;