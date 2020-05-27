/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useInstanceId } = wp.compose;
const {
    RangeControl,
    SelectControl,
    BaseControl,
    Button
} = wp.components;
const {
    Fragment,
} = wp.element;

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
        showRangeControl,
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
        <Fragment>
            <BaseControl
                label={label}
                className={classes}
            >
                <input
                    type='number'
                    className='maxi-sizecontrol-value'
                    value={value}
                    onChange={e => onChangeValue(e.target.value)}
                    min={minMaxSettings[unit].min}
                    max={minMaxSettings[unit].max}
                />
                <SelectControl
                    className="components-maxi-dimensions-control__units"
                    options={options}
                    value={unit}
                    onChange={(val) => onChangeUnit(val)}
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
                {
                    showRangeControl &&
                    <RangeControl
                        value={ value }
                        onChange={val => onChangeValue(val)}
                        min={minMaxSettings[unit].min}
                        max={minMaxSettings[unit].max}
                        allowReset={false}
                        withInputField={false}
                        initialPosition={0}
                    />
                }
            </BaseControl>
        </Fragment>
    )
}

export default SizeControl;