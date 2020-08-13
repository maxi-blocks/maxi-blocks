/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl } = wp.components;

/**
 * External dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import classnames from 'classnames';
import {
    isObject,
    isNil,
} from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
    const {
        opacity,
        defaultOpacity,
        className,
        onChange,
        breakpoint = 'general'
    } = props;

    const value = !isObject(opacity) ?
        JSON.parse(opacity) :
        opacity;

    const defaultValue = !isObject(defaultOpacity) ?
        JSON.parse(defaultOpacity) :
        defaultOpacity;

    const classes = classnames(
        'maxi-opacity-control',
        className
    );

    return (
        <RangeControl
            label={__('Opacity', 'maxi-blocks')}
            className={classes}
            value={Number(getLastBreakpointValue(value, 'opacity', breakpoint) * 100)}
            onChange={val => {
                isNil(val) ?
                    value[breakpoint].opacity = Number(defaultValue[breakpoint].opacity) :
                    value[breakpoint].opacity = Number(val / 100);

                onChange(JSON.stringify(value))
            }}
            min={0}
            max={100}
            allowReset={true}
        />
    )
}

export default OpacityControl;