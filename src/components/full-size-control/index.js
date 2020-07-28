/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isObject,
    isNil
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FullSizeControl = props => {
    const {
        size,
        onChange,
        className,
        breakpoint,
        hideWidth
    } = props;

    let value = isObject(size) ?
        size :
        JSON.parse(size);

    const classes = classnames(
        'maxi-fullsize-control',
        className
    )

    const onChangeValue = (target, val) => {
        if (isNil(val))
            val = '';
        value[breakpoint][target] = val;
        onChange(JSON.stringify(value));
    }

    return (
        <div className={classes}>
            <SizeControl
                label={__('Max Width', 'maxi-blocks')}
                unit={getLastBreakpointValue(value, 'max-widthUnit', breakpoint)}
                onChangeUnit={val => onChangeValue('max-widthUnit', val)}
                value={getLastBreakpointValue(value, 'max-width', breakpoint)}
                onChangeValue={val => onChangeValue('max-width', val)}
            />
            {
                !hideWidth &&
                <SizeControl
                    label={__('Width', 'maxi-blocks')}
                    unit={getLastBreakpointValue(value, 'widthUnit', breakpoint)}
                    onChangeUnit={val => onChangeValue('widthUnit', val)}
                    value={getLastBreakpointValue(value, 'width', breakpoint)}
                    onChangeValue={val => onChangeValue('width', val)}
                />
            }
            <SizeControl
                label={__('Min Width', 'maxi-blocks')}
                unit={getLastBreakpointValue(value, 'min-widthUnit', breakpoint)}
                onChangeUnit={val => onChangeValue('min-widthUnit', val)}
                value={getLastBreakpointValue(value, 'min-width', breakpoint)}
                onChangeValue={val => onChangeValue('min-width', val)}
            />
            <SizeControl
                label={__('Max Height', 'maxi-blocks')}
                unit={getLastBreakpointValue(value, 'max-heightUnit', breakpoint)}
                onChangeUnit={val => onChangeValue('max-heightUnit', val)}
                value={getLastBreakpointValue(value, 'max-height', breakpoint)}
                onChangeValue={val => onChangeValue('max-height', val)}
            />
            <SizeControl
                label={__('Height', 'maxi-blocks')}
                unit={getLastBreakpointValue(value, 'heightUnit', breakpoint)}
                onChangeUnit={val => onChangeValue('heightUnit', val)}
                value={getLastBreakpointValue(value, 'heigh', breakpoint)}
                onChangeValue={val => onChangeValue('height', val)}
            />
            <SizeControl
                label={__('Min Height', 'maxi-blocks')}
                unit={getLastBreakpointValue(value, 'min-heightUnit', breakpoint)}
                onChangeUnit={val => onChangeValue('min-heightUnit', val)}
                value={getLastBreakpointValue(value, 'min-height', breakpoint)}
                onChangeValue={val => onChangeValue('min-height', val)}
            />
        </div>
    )
}

export default FullSizeControl;