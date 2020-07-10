/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl, RadioControl, TextareaControl, RangeControl } = wp.components;
import {
    BackgroundControl
} from '../background-control';
import {
    BorderControl
} from '../border-control';
import {
    TypographyControl
} from '../typography-control';

/**
 * Component
 */
const HoverAnimationControl = props => {
    const {
        hoverAnimation,
        onChangeHoverAnimation,
        hoverAnimationOptions = [
            { label: __('None', 'maxi-blocks'), value: 'none' },
            { label: __('Basic', 'maxi-blocks'), value: 'basic' },
            { label: __('Text', 'maxi-blocks'), value: 'text' },
        ],
        hoverAnimationType,
        onChangeHoverAnimationType,
        hoverAnimationOptionsType = [
            { label: __('Tilt', 'maxi-blocks'), value: 'tilt' },
            { label: __('Zoom In', 'maxi-blocks'), value: 'zoom-in' },
            { label: __('Zoom Out', 'maxi-blocks'), value: 'zoom-out' },
            { label: __('Slide', 'maxi-blocks'), value: 'slide' },
            { label: __('Rotate', 'maxi-blocks'), value: 'rotate' },
            { label: __('Blur', 'maxi-blocks'), value: 'blur' },
            { label: __('Clear Blur', 'maxi-blocks'), value: 'clear-blur' },
            { label: __('Gray Scale', 'maxi-blocks'), value: 'gray-scale' },
            { label: __('Clear Gray Scale ', 'maxi-blocks'), value: 'clear-gray-scale' },
            { label: __('Opacity', 'maxi-blocks'), value: 'opacity' },
            { label: __('Opacity  with Colour', 'maxi-blocks'), value: 'opacity-with-colour' },
            { label: __('Shine', 'maxi-blocks'), value: 'shine' },
            { label: __('Circle', 'maxi-blocks'), value: 'circle' },
        ],
        hoverAnimationTypeText,
        onChangeHoverAnimationTypeText,
        hoverAnimationOptionsTypeText = [
            { label: __('Fade', 'maxi-blocks'), value: 'fade' },
            { label: __('Push Up', 'maxi-blocks'), value: 'push-up' },
            { label: __('Push Down', 'maxi-blocks'), value: 'push-down' },
            { label: __('Push Left', 'maxi-blocks'), value: 'push-left' },
            { label: __('Push Right', 'maxi-blocks'), value: 'push-right' },
            { label: __('Slide Up', 'maxi-blocks'), value: 'slide-up' },
            { label: __('Slide Down', 'maxi-blocks'), value: 'slide-down' },
            { label: __('Slide Left', 'maxi-blocks'), value: 'slide-left' },
            { label: __('Slide Right', 'maxi-blocks'), value: 'slide-right' },
            { label: __('Reveal Up', 'maxi-blocks'), value: 'reveal-up' },
            { label: __('Reveal Down', 'maxi-blocks'), value: 'reveal-down' },
            { label: __('Reveal Left', 'maxi-blocks'), value: 'reveal-left' },
            { label: __('Reveal Right', 'maxi-blocks'), value: 'reveal-right' },
            { label: __('Hinge Up', 'maxi-blocks'), value: 'hinge-up' },
            { label: __('Hinge Down', 'maxi-blocks'), value: 'hinge-down' },
            { label: __('Hinge Left', 'maxi-blocks'), value: 'hinge-left' },
            { label: __('Hinge Right', 'maxi-blocks'), value: 'hinge-right' },
            { label: __('Flip Horizontal', 'maxi-blocks'), value: 'flip-horizontal' },
            { label: __('Flip Vertical', 'maxi-blocks'), value: 'flip-vertical' },
            { label: __('Flip Diagonal', 'maxi-blocks'), value: 'flip-diagonal' },
            { label: __('Shutter Out Horizontal', 'maxi-blocks'), value: 'shutter-out-horizontal' },
            { label: __('Shutter Out Diagonal', 'maxi-blocks'), value: 'shutter-out-diagonal' },
            { label: __('Shutter In Horizontal', 'maxi-blocks'), value: 'shutter-in-horizontal' },
            { label: __('Shutter In Vertical', 'maxi-blocks'), value: 'shutter-in-vertical' },
        ],
        hoverAnimationDuration,
        onChangeHoverAnimationDuration,
        animationDurationOptions = [
            { label: __('Shorter', 'maxi-blocks'), value: 'shorter' },
            { label: __('Short', 'maxi-blocks'), value: 'short' },
            { label: __('Normal', 'maxi-blocks'), value: 'normal' },
            { label: __('Long', 'maxi-blocks'), value: 'long' },
            { label: __('Longer', 'maxi-blocks'), value: 'longer' },
        ],
        onChangeHoverBackground,
        onChangeHoverOpacity,
        onChangeHoverAnimationContent,
        onChangeHoverAnimationTitle,
        hoverAnimationCustomOptions = [
            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
            { label: __('No', 'maxi-blocks'), value: 'no' },
        ],
        hoverCustomTextOptions = [
            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
            { label: __('No', 'maxi-blocks'), value: 'no' },
        ],
        hoverCustomTextTitle,
        hoverCustomTextContent,
        onChangeHoverAnimationCustomContent,
        onChangeHoverAnimationCustomTitle,
        hoverAnimationCustomBorder,
        onChangeHoverAnimationCustomBorder,
        onChangeHoverAnimationChangeBorder,
        hoverAnimationTitle,
        hoverAnimationContent,
        hoverAnimationContentTypography,
        hoverAnimationTitleTypography,
        hoverAnimationTypeOpacity,
        onChangeHoverAnimationTypeOpacity,
        hoverAnimationTypeOpacityColor,
        onChangeHoverAnimationTypeOpacityColor,
    } = props;

    return (
        <div className="maxi-hover-animation">
            <RadioControl
                label={__('Hover Animation', 'maxi-blocks')}
                className={'maxi-hover-animation'}
                selected={hoverAnimation}
                options={hoverAnimationOptions}
                onChange={value => onChangeHoverAnimation(value)}
            />
            { hoverAnimation === 'basic' &&
            <SelectControl
                label={__('Hover Animation Type', 'maxi-blocks')}
                className={'maxi-hover-animation__type'}
                value={hoverAnimationType}
                options={hoverAnimationOptionsType}
                onChange={value => onChangeHoverAnimationType( value )}
            />
            }
            { hoverAnimation === 'text' &&
            <SelectControl
                label={__('Hover Animation Type', 'maxi-blocks')}
                className={'maxi-hover-animation__type-text'}
                value={hoverAnimationTypeText}
                options={hoverAnimationOptionsTypeText}
                onChange={value => onChangeHoverAnimationTypeText( value )}
            />
            }
            <SelectControl
                label={__('Animation Duration', 'maxi-blocks')}
                className={'maxi-hover-animation__duration'}
                value={hoverAnimationDuration}
                options={animationDurationOptions}
                onChange={value => onChangeHoverAnimationDuration( value )}
            />
            { hoverAnimation === 'text' &&
            <Fragment>
            <TextareaControl
                className='maxi-hover-animation-text__custom-title'
                placeHolder={__('Add your Hover Title here', 'maxi-blocks')}
                value={hoverAnimationTitle}
                onChange={value => onChangeHoverAnimationTitle( value )}
            />
            <RadioControl
                label={__('Custom Styles for Title', 'maxi-blocks')}
                className={'maxi-hover-animation--custom-styles__for-title'}
                selected={ hoverCustomTextTitle}
                options={ hoverCustomTextOptions}
                onChange={value => onChangeHoverAnimationCustomTitle(value)}
            />
            <TextareaControl
                className='maxi-hover-animation-text__custom-content'
                placeHolder={__('Add your Hover Content here', 'maxi-blocks')}
                value={hoverAnimationContent}
                onChange={value => onChangeHoverAnimationContent( value )}
            />
            <RadioControl
                label={__('Custom Styles for Content', 'maxi-blocks')}
                className={'maxi-hover-animation--custom-styles__for-content'}
                selected={ hoverCustomTextContent}
                options={ hoverCustomTextOptions}
                onChange={value => onChangeHoverAnimationCustomContent(value)}
            />
            </Fragment>
            }
            { hoverAnimationType === 'opacity' &&
            <RangeControl
                label={__('Opacity', 'maxi-blocks')}
                className='maxi-opacity-control'
                value={hoverAnimationTypeOpacity * 100}
                onChange={value => onChangeHoverAnimationTypeOpacity(value / 100)}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            }
            { hoverAnimationType === 'opacity-with-colour' &&
            <RangeControl
                label={__('Opacity', 'maxi-blocks')}
                className='maxi-opacity-control'
                value={hoverAnimationTypeOpacityColor * 100}
                onChange={value => onChangeHoverAnimationTypeOpacityColor(value / 100)}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            }
        </div>
    )
}

export default HoverAnimationControl;