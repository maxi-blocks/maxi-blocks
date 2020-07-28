/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../extensions/styles/utils';
import SettingTabsControl from '../setting-tabs-control';
import SquareControl from './square-control';
import RotateControl from './rotate-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isObject,
    isNumber,
    isString
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const TransformControl = props => {
    const {
        transform,
        className,
        onChange,
        breakpoint = 'general',
        uniqueID
    } = props;

    let value = !isObject(transform) ?
        JSON.parse(transform) :
        transform;

    const classes = classnames(
        'maxi-transform-control',
        className
    );

    const forceStyles = () => {
        let transformStr = '';
        let originStr = '';

        if (isNumber(getLastBreakpointValue(value, 'scaleX', breakpoint)))
            transformStr += `scaleX(${getLastBreakpointValue(value, 'scaleX', breakpoint) / 100}) `;
        if (isNumber(getLastBreakpointValue(value, 'scaleY', breakpoint)))
            transformStr += `scaleY(${getLastBreakpointValue(value, 'scaleY', breakpoint) / 100}) `;
        if (isNumber(getLastBreakpointValue(value, 'translateX', breakpoint)))
            transformStr += `translateX(${getLastBreakpointValue(value, 'translateX', breakpoint)}${getLastBreakpointValue(value, 'translateXUnit', breakpoint)}) `;
        if (isNumber(getLastBreakpointValue(value, 'translateY', breakpoint)))
            transformStr += `translateY(${getLastBreakpointValue(value, 'translateY', breakpoint)}${getLastBreakpointValue(value, 'translateYUnit', breakpoint)}) `;
        if (isNumber(getLastBreakpointValue(value, 'rotateX', breakpoint)))
            transformStr += `rotateX(${getLastBreakpointValue(value, 'rotateX', breakpoint)}deg) `;
        if (isNumber(getLastBreakpointValue(value, 'rotateY', breakpoint)))
            transformStr += `rotateY(${getLastBreakpointValue(value, 'rotateY', breakpoint)}deg) `;
        if (isNumber(getLastBreakpointValue(value, 'rotateZ', breakpoint)))
            transformStr += `rotateZ(${getLastBreakpointValue(value, 'rotateZ', breakpoint)}deg) `;
        if (isNumber(getLastBreakpointValue(value, 'originX', breakpoint)))
            originStr += `${getLastBreakpointValue(value, 'originX', breakpoint)}% `;
        if (isNumber(getLastBreakpointValue(value, 'originY', breakpoint)))
            originStr += `${getLastBreakpointValue(value, 'originY', breakpoint)}% `;
        if (isString(getLastBreakpointValue(value, 'originX', breakpoint)))
            originStr += `${getLastBreakpointValue(value, 'originX', breakpoint)} `;
        if (isString(getLastBreakpointValue(value, 'originY', breakpoint)))
            originStr += `${getLastBreakpointValue(value, 'originY', breakpoint)} `;

        const node = document.querySelector(`.maxi-block[uniqueid="${uniqueID}"]`);
        if (node) {
            node.style.transform = transformStr;
            node.style.transformOrigin = originStr;
        }
    }

    useEffect(forceStyles)

    return (
        <div
            className={classes}
        >
            <SettingTabsControl
                disablePadding
                items={[
                    {
                        label: __('Scale', 'maxi-blocks'),
                        content: (
                            <SquareControl
                                x={getLastBreakpointValue(value, 'scaleX', breakpoint)}
                                y={getLastBreakpointValue(value, 'scaleY', breakpoint)}
                                onChange={(x, y) => {
                                    value[breakpoint].scaleX = x;
                                    value[breakpoint].scaleY = y;
                                    forceStyles();
                                }}
                                onSave={(x, y) => {
                                    value[breakpoint].scaleX = x;
                                    value[breakpoint].scaleY = y;
                                    onChange(JSON.stringify(value));
                                    forceStyles();
                                }}
                            />
                        )
                    },
                    {
                        label: __('Translate', 'maxi-blocks'),
                        content: (
                            <SquareControl
                                type='drag'
                                x={getLastBreakpointValue(value, 'translateX', breakpoint)}
                                y={getLastBreakpointValue(value, 'translateY', breakpoint)}
                                xUnit={getLastBreakpointValue(value, 'translateXUnit', breakpoint)}
                                yUnit={getLastBreakpointValue(value, 'translateYUnit', breakpoint)}
                                onChange={(x, y, xUnit, yUnit) => {
                                    value[breakpoint].translateX = x;
                                    value[breakpoint].translateY = y;
                                    value[breakpoint].translateXUnit = xUnit;
                                    value[breakpoint].translateYUnit = yUnit;
                                    forceStyles();
                                }}
                                onSave={(x, y, xUnit, yUnit) => {
                                    value[breakpoint].translateX = x;
                                    value[breakpoint].translateY = y;
                                    value[breakpoint].translateXUnit = xUnit;
                                    value[breakpoint].translateYUnit = yUnit;
                                    onChange(JSON.stringify(value));
                                    forceStyles();
                                }}
                            />
                        )
                    },
                    {
                        label: __('Rotate', 'maxi-blocks'),
                        content: (
                            <RotateControl
                                x={getLastBreakpointValue(value, 'rotateX', breakpoint)}
                                y={getLastBreakpointValue(value, 'rotateY', breakpoint)}
                                z={getLastBreakpointValue(value, 'rotateZ', breakpoint)}
                                onChange={(x, y, z) => {
                                    value[breakpoint].rotateX = x;
                                    value[breakpoint].rotateY = y;
                                    value[breakpoint].rotateZ = z;
                                    onChange(JSON.stringify(value));
                                    forceStyles();
                                }}
                            />
                        )
                    },
                    {
                        label: __('Origin', 'maxi-blocks'),
                        content: (
                            <SquareControl
                                type='origin'
                                x={getLastBreakpointValue(value, 'originX', breakpoint)}
                                y={getLastBreakpointValue(value, 'originY', breakpoint)}
                                onChange={(x, y) => {
                                    value[breakpoint].originX = x;
                                    value[breakpoint].originY = y;
                                    onChange(JSON.stringify(value));
                                    forceStyles();
                                }}
                            />
                        )
                    }
                ]}
            />
        </div>
    )
}

export default TransformControl;