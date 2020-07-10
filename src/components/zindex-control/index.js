/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import __experimentalNumberControl from '../number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const ZIndexControl = props => {
    const {
        zindex,
        onChange,
        className,
        breakpoint
    } = props;

    const classes = classnames(
        'maxi-zindex-control',
        className
    )

    const value = !isObject(zindex) ?
        JSON.parse(zindex) :
        zindex;

    return (
        <__experimentalNumberControl 
            label={__('Z-index', 'maxi-blocks')}
            className={classes}
            value={value[breakpoint]['z-index']}
            onChange={val => {
                value[breakpoint]['z-index'] = val;
                onChange(JSON.stringify(value))
            }}
        />
    )
}

export default ZIndexControl;