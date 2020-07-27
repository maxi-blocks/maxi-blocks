/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
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

        if (isNumber(value[breakpoint].scale.scaleX))
            transformStr += `scaleX(${value[breakpoint].scale.scaleX / 100}) `;
        if (isNumber(value[breakpoint].scale.scaleY))
            transformStr += `scaleY(${value[breakpoint].scale.scaleY / 100}) `;
        if (isNumber(value[breakpoint].translate.translateX))
            transformStr += `translateX(${value[breakpoint].translate.translateX}${value[breakpoint].translate.translateXUnit}) `;
        if (isNumber(value[breakpoint].translate.translateY))
            transformStr += `translateY(${value[breakpoint].translate.translateY}${value[breakpoint].translate.translateYUnit}) `;
        if (isNumber(value[breakpoint].rotate.rotateX))
            transformStr += `rotateX(${value[breakpoint].rotate.rotateX}deg) `;
        if (isNumber(value[breakpoint].rotate.rotateY))
            transformStr += `rotateY(${value[breakpoint].rotate.rotateY}deg) `;
        if (isNumber(value[breakpoint].rotate.rotateZ))
            transformStr += `rotateZ(${value[breakpoint].rotate.rotateZ}deg) `;
        if (isNumber(value[breakpoint].origin.originX))
            originStr += `${value[breakpoint].origin.originX}% `;
        if (isNumber(value[breakpoint].origin.originY))
            originStr += `${value[breakpoint].origin.originY}% `;
        if (isString(value[breakpoint].origin.originX))
            originStr += `${value[breakpoint].origin.originX} `;
        if (isString(value[breakpoint].origin.originY))
            originStr += `${value[breakpoint].origin.originY} `;

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
                                x={value[breakpoint].scale.scaleX}
                                y={value[breakpoint].scale.scaleY}
                                onChange={(x, y) => {
                                    value[breakpoint].scale.scaleX = x;
                                    value[breakpoint].scale.scaleY = y;
                                    forceStyles();
                                }}
                                onSave={(x, y) => {
                                    value[breakpoint].scale.scaleX = x;
                                    value[breakpoint].scale.scaleY = y;
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
                                x={value[breakpoint].translate.translateX}
                                y={value[breakpoint].translate.translateY}
                                xUnit={value[breakpoint].translate.translateXUnit}
                                yUnit={value[breakpoint].translate.translateYUnit}
                                onChange={(x, y, xUnit, yUnit) => {
                                    value[breakpoint].translate.translateX = x;
                                    value[breakpoint].translate.translateY = y;
                                    value[breakpoint].translate.translateXUnit = xUnit;
                                    value[breakpoint].translate.translateYUnit = yUnit;
                                    forceStyles();
                                }}
                                onSave={(x, y, xUnit, yUnit) => {
                                    value[breakpoint].translate.translateX = x;
                                    value[breakpoint].translate.translateY = y;
                                    value[breakpoint].translate.translateXUnit = xUnit;
                                    value[breakpoint].translate.translateYUnit = yUnit;
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
                                x={value[breakpoint].rotate.rotateX}
                                y={value[breakpoint].rotate.rotateY}
                                z={value[breakpoint].rotate.rotateZ}
                                onChange={(x, y, z) => {
                                    value[breakpoint].rotate.rotateX = x;
                                    value[breakpoint].rotate.rotateY = y;
                                    value[breakpoint].rotate.rotateZ = z;
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
                                x={value[breakpoint].origin.originX}
                                y={value[breakpoint].origin.originY}
                                onChange={(x, y) => {
                                    value[breakpoint].origin.originX = x;
                                    value[breakpoint].origin.originY = y;
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