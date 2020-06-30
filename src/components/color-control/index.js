/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    ColorPicker,
    BaseControl,
    Button,
} = wp.components;

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
const ColorControl = props => {
    const {
        label,
        className,
        color,
        defaultColor = '',
        onColorChange,
    } = props;

    const classes = classnames(
        'maxi-colorcontrol',
        className
    );

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    }

    const onReset = () => onColorChange(defaultColor);

    return (
        <div className={classes}>
            <BaseControl
                    className='maxi-colorcontrol__display'
                    label={`${label} ${__('Color', 'maxi-blocks')}`}
                >
                    <div className='maxi-colorcontrol__display__color'>
                        <span style={{background: color}}></span>
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
            <div className="maxi-colorcontrol__color">
                <ColorPicker
                    color={color}
                    onChangeComplete={val => onColorChange(returnColor(val))}
                />
            </div>
        </div>
    )
}

export default ColorControl;