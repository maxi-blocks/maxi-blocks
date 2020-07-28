/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const GroupInputControl = props => {

    const {
        label,
        options,
        onChange,
    } = props;

    let value = !isObject(options) ?
        JSON.parse(options) :
        options;

    return (
        <div className='maxi-group-input-control'>
            <div className='maxi-group-input-control__input'>
                <input
                    type="number"
                    min={0}
                    max={999}
                    step={0.1}
                    value={value.startValue}
                    onChange={e => {
                        value.startValue = e.target.value;
                        onChange(JSON.stringify(value));
                    }}
                />
                <label>{__(`Starting ${label}`, 'maxi-blocks')}</label>
            </div>
            <div className='maxi-group-input-control__input'>
                <input
                    type="number"
                    min={0}
                    max={999}
                    step={0.1}
                    value={value.midValue}
                    onChange={e => {
                        value.midValue = e.target.value;
                        onChange(JSON.stringify(value));
                    }}
                />
                <label>{__(`Mid ${label}`, 'maxi-blocks')}</label>
            </div>
            <div className='maxi-group-input-control__input'>
                <input
                    type="number"
                    min={0}
                    max={999}
                    step={0.1}
                    value={value.endValue}
                    onChange={e => {
                        value.endValue = e.target.value;
                        onChange(JSON.stringify(value));
                    }}
                />
                <label>{__(`End ${label}`, 'maxi-blocks')}</label>
            </div>
        </div>
    )

}

export default GroupInputControl;