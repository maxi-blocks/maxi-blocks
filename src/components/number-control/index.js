/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    BaseControl,
    Button
} = wp.components;

/**
 * Internal dependencies
 */
import { reset } from '../../icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const NumberControl = props => {
    const {
        label,
        className,
        value,
        min = -999,
        max = 999,
        onChange
    } = props;

    const classes = classnames(
        'maxi-number-control',
        className
    )

    return (
        <BaseControl
            label={label}
            className={classes}
        >
            <input
                type='number'
                value={!!value ? value : ''}
                onChange={e => onChange(Number(e.target.value))}
                min={min}
                max={max}
            />
            <Button
                className="components-maxi-control__reset-button"
                onClick={() => onChange(undefined)}
                action="reset"
                type="reset"
            >
                {reset}
            </Button>
        </BaseControl>
    )
}

export default NumberControl;