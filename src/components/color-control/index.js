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

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
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
        label='',
        className,
        disableColor = false,
        disableImage = false,
        disableVideo = false,
        disableGradient = false,
        color,
        defaultColor = '',
        onColorChange,
        gradient,
        defaultGradient = '',
        onGradientChange,
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

    const getOptions = () => {
        let options = [];
        if(!disableColor)
            options.push({ label: <Icon icon={backgroundColor} />, value: 'color' });
        if(!disableImage)
            options.push({ label: <Icon icon={backgroundImage} />, value: 'image' });
        if(!disableVideo)
            options.push({ label: <Icon icon={backgroundVideo} />, value: 'video' });
        if(!disableGradient)
            options.push({ label: <Icon icon={backgroundGradient()} />, value: 'gradient' })

        return options;
    }

    const [backgroundItems, changeBackgroundItems] = useState('color');

    return (
        <div className={classes}>
            {
                ( getOptions().length > 1 ) &&
                <div className='maxi-colorcontrol__items'>
                    <span>{__('Background', 'maxi-blocks')}</span>
                    <RadioControl
                        label=''
                        className=''
                        selected={backgroundItems}
                        options={getOptions()}
                        onChange={value => changeBackgroundItems(value)}
                    />
                </div>
            }
            <div className='maxi-colorcontrol__display'>
                <span className='maxi-colorcontrol__display__title'>
                    { ( label === '' ) ? __('Background Color', 'maxi-blocks') : label }
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
                ( disableColor === false ) &&
                ( backgroundItems === 'color' ) &&
                <div className="maxi-colorcontrol__color">
                    <ColorPicker
                        color={color}
                        onChangeComplete={val => onColorChange(returnColor(val))}
                    />
                </div>
            }
            {
                ( disableGradient === false ) &&
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
                ( disableImage === false ) &&
                ( backgroundItems === 'image' ) &&
                <p>Image settings goes here soon</p>
            }
            {
                ( disableVideo === false ) &&
                ( backgroundItems === 'video' ) &&
                <p>Video settings goes here soon</p>
            }
        </div>
    )
}

export default ColorControl;