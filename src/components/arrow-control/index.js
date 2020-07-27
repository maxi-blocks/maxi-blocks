/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    SelectControl,
    RangeControl
} = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../extensions/styles/utils';
import ColorControl from '../color-control';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const ArrowControl = props => {
    const {
        arrow,
        className,
        onChange,
        breakpoint = 'general',
        isFirstOnHierarchy
    } = props;

    let value = !isObject(arrow) ?
        JSON.parse(arrow) :
        arrow;

    const classes = classnames(
        'maxi-arrow-control',
        className
    );

    const getOptions = () => {
        let response = [
            { label: __('Top', 'maxi-blocks'), value: 'top' },
            { label: __('Bottom', 'maxi-blocks'), value: 'bottom' },
        ];

        if (!isFirstOnHierarchy)
            response = response.concat([
                { label: __('Right', 'maxi-blocks'), value: 'right' },
                { label: __('Left', 'maxi-blocks'), value: 'left' },
            ])

        return response;
    }

    return (
        <div
            className={classes}
        >
            {
                <SelectControl
                    label={__('Show arrow', 'maxi-blocks')}
                    options={[
                        { label: __('Yes', 'maxi-blocks'), value: 1 },
                        { label: __('No', 'maxi-blocks'), value: 0 }
                    ]}
                    value={value.active}
                    onChange={val => {
                        value.active = Number(val);
                        onChange(JSON.stringify(value))
                    }}
                />
            }
            {
                !!value.active &&
                <Fragment>
                    <SelectControl
                        label={__('Side', 'maxi-blocks')}
                        options={getOptions()}
                        value={getLastBreakpointValue(value, 'side', breakpoint)}
                        onChange={val => {
                            value[breakpoint].side = val;
                            onChange(JSON.stringify(value))
                        }}
                    />
                    <RangeControl
                        label={__('Position', 'maxi-blocks')}
                        value={getLastBreakpointValue(value, 'position', breakpoint)}
                        min='0'
                        max='100'
                        onChange={val => {
                            value[breakpoint].position = val;
                            onChange(JSON.stringify(value))
                        }}
                    />
                    <ColorControl
                        label={__('Arrow', 'maxi-blocks')}
                        color={getLastBreakpointValue(value, 'color', breakpoint)}
                        onColorChange={val => {
                            value[breakpoint].color = val;
                            onChange(JSON.stringify(value))
                        }}
                    />
                    <SizeControl
                        label={__('Width', 'maxi-blocks')}
                        unit={getLastBreakpointValue(value, 'widthUnit', breakpoint)}
                        onChangeUnit={val => {
                            value[breakpoint].widthUnit = val;
                            onChange(JSON.stringify(value))
                        }}
                        value={getLastBreakpointValue(value, 'width', breakpoint)}
                        onChangeValue={val => {
                            value[breakpoint].width = val;
                            onChange(JSON.stringify(value))
                        }}
                    />
                    <SizeControl
                        label={__('Height', 'maxi-blocks')}
                        unit={getLastBreakpointValue(value, 'heightUnit', breakpoint)}
                        onChangeUnit={val => {
                            value[breakpoint].heightUnit = val;
                            onChange(JSON.stringify(value))
                        }}
                        value={getLastBreakpointValue(value, 'height', breakpoint)}
                        onChangeValue={val => {
                            value[breakpoint].height = val;
                            onChange(JSON.stringify(value))
                        }}
                    />
                </Fragment>
            }
        </div>
    )
}

export default ArrowControl;