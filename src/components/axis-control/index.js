/**
 * WordPress dependencies
 */
const {
    __,
    sprintf
} = wp.i18n;
const {
    BaseControl,
    SelectControl,
    Button,
    Tooltip,
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { 
    isObject,
    trim
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    reset,
    sync
} from '../../icons';

/**
 * Component
 */
const AxisControl = props => {
    const {
        values,
        className,
        onChange,
        breakpoint
    } = props;

    const value = !isObject(values) ?
        JSON.parse(values) :
        values;
    
    const classes = classnames(
        'maxi-axis-control',
        className
    );

    const getKey = (obj, target) => {
        return Object.keys(obj)[target];
    }

    const onChangeValue = (e, target) => {
        const newValue = e.target.value;

        if (value[breakpoint].sync === true) {
            for (let key of Object.keys(value[breakpoint])) {
                key != 'sync' ?
                    value[breakpoint][key] = !!Number(newValue) || newValue === '0' ?
                        Number(newValue) :
                        newValue :
                    null;
            }
        }
        else {
            value[breakpoint][getKey(value[breakpoint], target)] = !!Number(newValue) || newValue === '0' ?
                Number(newValue) :
                newValue;
        }

        onChange(JSON.stringify(value));
    }

    const onReset = () => {
        for (let key of Object.keys(value[breakpoint])) {
            key != 'sync' ?
                value[breakpoint][key] = '' :
                value[breakpoint][sync] = true;
        }

        onChange(JSON.stringify(value));
    }

    const onChangeSync = () => {
        value[breakpoint].sync = !value[breakpoint].sync;
        onChange(JSON.stringify(value))
    }

    return (
        <BaseControl>
            <div className={classes}>
                <div className="maxi-axis-control__header components-base-control">
                    <p className='maxi-axis-control__label'>
                        {value.label}
                    </p>
                    <div className="maxi-axis-control__actions">
                        <SelectControl
                            className="maxi-axis-control__units"
                            options={[
                                { label: 'PX', value: 'px' },
                                { label: 'EM', value: 'em' },
                                { label: 'VW', value: 'vw' },
                                { label: '%', value: '%' },
                            ]}
                            value={value.unit}
                            onChange={val => {
                                value.unit = val;
                                onChange(JSON.stringify(value))
                            }}
                        />
                        <Button
                            className="components-maxi-control__reset-button"
                            onClick={onReset}
                            aria-label={sprintf(
                                __('Reset %s settings', 'maxi-blocks'),
                                value.label.toLowerCase()
                            )}
                            action="reset"
                            type="reset"
                        >
                            {reset}
                        </Button>
                    </div>
                </div>
                <div
                    className="maxi-axis-control__mobile-controls"
                >
                    <div className="maxi-axis-control__inputs">
                        <input
                            className="maxi-axis-control__number"
                            type="number"
                            placeholder='auto'
                            value={trim(value[breakpoint][getKey(value[breakpoint], 0)])}
                            onChange={e => onChangeValue(e, 0)}
                            aria-label={sprintf(
                                __('%s Top', 'maxi-blocks'),
                                value.label
                            )}
                            min={value.min ? value.min : 0}
                            max={value.max ? value.max : 'none'}
                        />
                        <input
                            className="maxi-axis-control__number"
                            type="number"
                            placeholder='auto'
                            value={trim(value[breakpoint][getKey(value[breakpoint], 1)])}
                            onChange={e => onChangeValue(e, 1)}
                            aria-label={sprintf(
                                __('%s Right', 'maxi-blocks'),
                                value.label
                            )}
                            min={value.min ? value.min : 0}
                            max={value.max ? value.max : 'none'}
                        />
                        <input
                            className="maxi-axis-control__number"
                            type="number"
                            placeholder='auto'
                            value={trim(value[breakpoint][getKey(value[breakpoint], 2)])}
                            onChange={e => onChangeValue(e, 2)}
                            aria-label={sprintf(
                                __('%s Bottom', 'maxi-blocks'),
                                value.label
                            )}
                            min={value.min ? value.min : 0}
                            max={value.max ? value.max : 'none'}
                        />
                        <input
                            className="maxi-axis-control__number"
                            type="number"
                            placeholder='auto'
                            value={trim(value[breakpoint][getKey(value[breakpoint], 3)])}
                            onChange={e => onChangeValue(e, 3)}
                            aria-label={sprintf(
                                __('%s Left', 'maxi-blocks'),
                                value.label
                            )}
                            min={value.min ? value.min : 0}
                            max={value.max ? value.max : 'none'}
                        />
                        <Tooltip
                            text={
                                !!value[breakpoint].sync ?
                                    __('Unsync', 'maxi-blocks') :
                                    __('Sync', 'maximaxi-blocks')}
                        >
                            <Button
                                className="maxi-axis-control_sync"
                                aria-label={__('Sync Units', 'maxi-blocks')}
                                isPrimary={value[breakpoint].sync}
                                aria-pressed={value[breakpoint].sync}
                                onClick={onChangeSync}
                                isSmall
                            >
                                {sync}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="maxi-axis-control__input-labels">
                    <span className="maxi-axis-control__number-label">{__('Top', 'maxi-blocks')}</span>
                    <span className="maxi-axis-control__number-label">{__('Right', 'maxi-blocks')}</span>
                    <span className="maxi-axis-control__number-label">{__('Bottom', 'maxi-blocks')}</span>
                    <span className="maxi-axis-control__number-label">{__('Left', 'maxi-blocks')}</span>
                    <span className="maxi-axis-control__number-label-blank"></span>
                </div>
            </div>
        </BaseControl>
    );
}

export default AxisControl;