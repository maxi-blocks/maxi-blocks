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
const ZIndexControl = props => {
    const {
        value,
        onChange,
        className
    } = props;

    const classes = classnames(
        'maxi-zindex-control',
        className
    )

    return (
        <BaseControl
            label={__('Z-index', 'maxi-blocks')}
            className={classes}
        >
            <input
                type='number'
                value={!!value ? value : ''}
                onChange={e => onChange(Number(e.target.value))}
                min='-999'
                max='999'
            />
            <Button
                className="components-maxi-control__units-reset"
                onClick={() => onChange(null)}
                aria-label={__('Reset z-index settings', 'maxi-blocks')}
                action="reset"
                type="reset"
            >
                {reset}
            </Button>
        </BaseControl>
    )
}

export default ZIndexControl;