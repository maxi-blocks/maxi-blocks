/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useInstanceId } = wp.compose;
const {
    BaseControl,
    ButtonGroup,
    Button
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const SizeControl = props => {

    const {
        label,
        className,
        unit,
        onChangeUnit,
        value,
        onChangeValue,
        minMaxSettings = {
            'px': {
                min: 0,
                max: 999
            },
            'em': {
                min: 0,
                max: 999
            },
            'vw': {
                min: 0,
                max: 999
            },
            '%': {
                min: 0,
                max: 999
            }
        }
    } = props;

    const classes = classnames(
        'maxi-sizecontrol-control',
        className
    );

    const options = [
        { label: 'PX', value: 'px' },
        { label: 'EM', value: 'em' },
        { label: 'VW', value: 'vw' },
        { label: '%', value: '%' },
    ];

    return (
        <BaseControl
            label={label}
            className={classes}
        >
            <ButtonGroup
                className="components-maxi-dimensions-control__units"
                aria-label={__('Select Units', 'maxi-blocks')}
            >
                {
                    options.map(option => (
                        <Button
                            key={option.value}
                            className='components-maxi-dimensions-control__units-button maxi-unit-button'
                            isSmall
                            isPrimary={option.value === unit}
                            aria-pressed={option.value === unit}
                            aria-label={sprintf(
                                /* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
                                __('%s Units', 'maxi-blocks'),
                                name
                            )}
                            onClick={() => onChangeUnit(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))
                }
            </ButtonGroup>
            <input
                type='number'
                className='maxi-sizecontrol-value'
                value={value}
                onChange={e => onChangeValue(e.target.value)}
                min={minMaxSettings[unit].min}
                max={minMaxSettings[unit].max}
            />
            <Button
                className="components-maxi-dimensions-control__units-reset"
                onClick={() => onChangeValue('')}
                isSmall
                aria-label={sprintf(
                    /* translators: %s: a texual label  */
                    __('Reset %s settings', 'maxi-blocks'),
                    label.toLowerCase()
                )}
                type="reset"
            >
                {reset}
            </Button>
        </BaseControl>
    )
}

export default SizeControl;