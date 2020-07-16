/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
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

/**
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';
import { Fragment } from 'react';

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
                        value={value}
                        onChange={e => onChangeValue(Number(e.target.value))}
                        min={min}
                        max={max}
                        placeholder='auto'
                    />
                :
                    <Fragment>
                        <input
                            type='number'
                            className='maxi-size-control__value'
                            value={value}
                            onChange={e => onChangeValue(Number(e.target.value))}
                            min={minMaxSettings[unit].min}
                            max={minMaxSettings[unit].max}
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
                        allowReset={false}
                        withInputField={false}
                        initialPosition={initial}
                    />
                :
                    <RangeControl
                        value={Number(value)}
                        onChange={val => onChangeValue(Number(val))}
                        min={minMaxSettings[unit].min}
                        max={minMaxSettings[unit].max}
                        allowReset={false}
                        withInputField={false}
                        initialPosition={initial}
                    />
            }
        </BaseControl>
    )
}

export default SizeControl;