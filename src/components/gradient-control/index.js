/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    BaseControl,
    Button,
    __experimentalGradientPicker
} = wp.components;

/**
 * Internal dependencies
 */
import { CheckBoxControl } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const GradientControl = props => {
    const {
        label,
        className,
        gradient,
        defaultGradient = '',
        onGradientChange,
        disableGradientAboveBackground = false,
        gradientAboveBackground,
        onGradientAboveBackgroundChange,
    } = props;

    const classes = classnames(
        'maxi-gradientcontrol',
        className
    );

    const onReset = () => {
        if (!disableGradientAboveBackground)
            onGradientAboveBackgroundChange(false);

        onGradientChange(defaultGradient);
    }

    return (
        <div className={classes}>
            <BaseControl
                className='maxi-gradientcontrol__display'
                label={`${label} ${__('Color', 'maxi-blocks')}`}
            >
                <div className='maxi-gradientcontrol__display__color'>
                    <span style={{ background: gradient }}></span>
                    <Button
                        className="components-maxi-control__reset-button"
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
            </BaseControl>
            <div className="maxi-gradientcontrol__gradient">
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
        </div>
    )
}

export default GradientControl;