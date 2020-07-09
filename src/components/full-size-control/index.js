/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FullSizeControlSing = props => {
    const {
        size,
        onChange,
        hideWidth = false
    } = props;

    const onChangeValue = (target, val) => {
        if (typeof val === 'undefined')
            val = '';
        size[target] = val;
        onChange(size);
    }

    return (
        <Fragment>
            <SizeControl
                label={__('Max Width', 'maxi-blocks')}
                unit={size['max-widthUnit']}
                onChangeUnit={value => onChangeValue('max-widthUnit', value)}
                value={size['max-width']}
                onChangeValue={value => onChangeValue('max-width', value)}
            />
            {
                !hideWidth &&
                <SizeControl
                    label={__('Width', 'maxi-blocks')}
                    unit={size.widthUnit}
                    onChangeUnit={value => onChangeValue('widthUnit', value)}
                    value={size.width}
                    onChangeValue={value => onChangeValue('width', value)}
                />
            }
            <SizeControl
                label={__('Min Width', 'maxi-blocks')}
                unit={size['min-widthUnit']}
                onChangeUnit={value => onChangeValue('min-widthUnit', value)}
                value={size['min-width']}
                onChangeValue={value => onChangeValue('min-width', value)}
            />
            <SizeControl
                label={__('Max Height', 'maxi-blocks')}
                unit={size['max-heightUnit']}
                onChangeUnit={value => onChangeValue('max-heightUnit', value)}
                value={size['max-height']}
                onChangeValue={value => onChangeValue('max-height', value)}
            />
            <SizeControl
                label={__('Height', 'maxi-blocks')}
                unit={size.heightUnit}
                onChangeUnit={value => onChangeValue('heightUnit', value)}
                value={size.height}
                onChangeValue={value => onChangeValue('height', value)}
            />
            <SizeControl
                label={__('Min Height', 'maxi-blocks')}
                unit={size['min-heightUnit']}
                onChangeUnit={value => onChangeValue('min-heightUnit', value)}
                value={size['min-height']}
                onChangeValue={value => onChangeValue('min-height', value)}
            />
        </Fragment>
    )
}

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

    return (
        <div className={classes}>
            <FullSizeControlSing
                size={value[breakpoint]}
                onChange={val => {
                    value[breakpoint] = val;
                    onChange(JSON.stringify(value))
                }}
                hideWidth={hideWidth}
            />
        </div>
    )
}

export default FullSizeControl;