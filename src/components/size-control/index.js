/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RangeControl,
    SelectControl,
    BaseControl,
    Button
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';

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
        disableUnit = false,
        onChangeUnit,
        min = 0,
        max = 999,
        initial = 0,
        step = 1,
        value,
        onChangeValue,
        allowedUnits = ['px', 'em', 'vw', '%'],
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
        'maxi-size-control',
        className
    );

    const getOptions = () => {
        let options = [];
            allowedUnits.includes('px') && options.push({label: 'PX', value: 'px'});
            allowedUnits.includes('em') && options.push({label: 'EM', value: 'em'});
            allowedUnits.includes('vw') && options.push({label: 'VW', value: 'vw'});
            allowedUnits.includes('%') && options.push({label: '%', value: '%'});
        return options;
    };

    return (
        <BaseControl
            label={label}
            className={classes}
        >
            {
                (disableUnit) ?
                    <input
                        type='number'
                        className='maxi-size-control__value'
                        value={trim(value)}
                        onChange={e => onChangeValue(Number(e.target.value))}
                        min={min}
                        max={max}
                        step={step}
                        placeholder='auto'
                    />
                :
                    <Fragment>
                        <input
                            type='number'
                            className='maxi-size-control__value'
                            value={trim(value)}
                            onChange={e => onChangeValue(Number(e.target.value))}
                            min={unit ? minMaxSettings[unit].min : null}
                            max={unit ? minMaxSettings[unit].max : null}
                            step={step}
                            placeholder='auto'
                        />
                        <SelectControl
                            className='components-maxi-dimensions-control__units'
                            options={getOptions()}
                            value={unit}
                            onChange={(val) => onChangeUnit(val)}
                        />
                    </Fragment>
            }
            <Button
                className='components-maxi-control__reset-button'
                onClick={() => onChangeValue('')}
                isSmall
                aria-label={sprintf(
                    /* translators: %s: a texual label  */
                    __('Reset %s settings', 'maxi-blocks'),
                    label.toLowerCase()
                )}
                type='reset'
            >
                {reset}
            </Button>
            {
                (disableUnit) ?
                    <RangeControl
                        value={Number(value)}
                        onChange={val => onChangeValue(Number(val))}
                        min={min}
                        max={max}
                        step={step}
                        allowReset={false}
                        withInputField={false}
                        initialPosition={initial}
                    />
                :
                    <RangeControl
                        value={Number(value)}
                        onChange={val => onChangeValue(Number(val))}
                        min={unit ? minMaxSettings[unit].min : null}
                        max={unit ? minMaxSettings[unit].max : null}
                        step={step}
                        allowReset={false}
                        withInputField={false}
                        initialPosition={initial}
                    />
            }
        </BaseControl>
    )
}

export default SizeControl;