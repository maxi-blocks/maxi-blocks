/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
    const {
        opacity,
        className,
        onChange,
        breakpoint = 'general'
    } = props;

    const value = !isObject(opacity) ?
        JSON.parse(opacity) : 
        opacity;

    const classes = classnames(
        'maxi-opacity-control',
        className
    );

    return (
        <RangeControl
            label={__('Opacity', 'maxi-blocks')}
            className={classes}
            value={value[breakpoint].opacity * 100}
            onChange={val => {
                value[breakpoint].opacity = val / 100;
                onChange(JSON.stringify(value))
            }}
            min={0}
            max={100}
            allowReset={true}
        />
    )
}

export default OpacityControl;