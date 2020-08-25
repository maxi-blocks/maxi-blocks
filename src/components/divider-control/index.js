/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState, useEffect } = wp.element;
const { RangeControl, SelectControl, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import __experimentalOpacityControl from '../opacity-control';
import {
    dividerSolidHorizontal,
    dividerDottedHorizontal,
    dividerDashedHorizontal,
    dividerSolidVertical,
    dividerDottedVertical,
    dividerDashedVertical,
    dividerNone,
} from './defaults';

/**
 * External dependencies
 */
import { isNil, isObject } from 'lodash';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

/**
 * Component
 */
const DividerControl = props => {
    const {
        divider,
        defaultDivider,
        onChange,
        lineOrientation,
        disableColor = false,
        disableLineStyle = false,
        disableBorderRadius = false,
    } = props;

    const [orientation, changeOrientation] = useState(lineOrientation);

    const value = !isObject(divider) ? JSON.parse(divider) : divider;

    const defaultValue = !isObject(defaultDivider)
        ? JSON.parse(defaultDivider)
        : defaultDivider;

    useEffect(() => {
        if (lineOrientation !== orientation) {
            changeOrientation(lineOrientation);
            if (lineOrientation === 'vertical') {
                if (!isNil(value.general.width)) {
                    value.general.height = value.general.width;
                    value.general.width = '';
                }
                if (!isNil(value.general['border-top-width'])) {
                    value.general['border-right-width'] =
                        value.general['border-top-width'];
                    value.general['border-top-width'] = '';
                }
            } else {
                if (!isNil(value.general.height)) {
                    value.general.width = value.general.height;
                    value.general.height = '';
                }
                if (!isNil(value.general['border-top-width'])) {
                    value.general['border-top-width'] =
                        value.general['border-right-width'];
                    value.general['border-right-width'] = '';
                }
            }

            onChange(JSON.stringify(value));
        }
    }, [lineOrientation, orientation, value, onChange]);

    return (
        <Fragment>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: value.general['border-style'] === 'none',
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChange(JSON.stringify(dividerNone)),
                    },
                    {
                        activeItem: value.general['border-style'] === 'solid',
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={solid}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal')
                                onChange(
                                    JSON.stringify(dividerSolidHorizontal)
                                );
                            else onChange(JSON.stringify(dividerSolidVertical));
                        },
                    },
                    {
                        activeItem: value.general['border-style'] === 'dashed',
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dashed}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal')
                                onChange(
                                    JSON.stringify(dividerDashedHorizontal)
                                );
                            else
                                onChange(JSON.stringify(dividerDashedVertical));
                        },
                    },
                    {
                        activeItem: value.general['border-style'] === 'dotted',
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dotted}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal')
                                onChange(
                                    JSON.stringify(dividerDottedHorizontal)
                                );
                            else
                                onChange(JSON.stringify(dividerDottedVertical));
                        },
                    },
                ]}
            />
            {!disableColor && (
                <ColorControl
                    label={__('Color', 'maxi-blocks')}
                    color={value.general['border-color']}
                    defaultColor={defaultValue.general['border-color']}
                    onChange={val => {
                        value.general['border-color'] = val;
                        onChange(JSON.stringify(value));
                    }}
                    disableGradient
                />
            )}
            {!disableLineStyle && (
                <SelectControl
                    label={__('Line Style', 'maxi-blocks')}
                    options={[
                        { label: __('None', 'maxi-blocks'), value: 'none' },
                        { label: __('Dotted', 'maxi-blocks'), value: 'dotted' },
                        { label: __('Dashed', 'maxi-blocks'), value: 'dashed' },
                        { label: __('Solid', 'maxi-blocks'), value: 'solid' },
                        { label: __('Double', 'maxi-blocks'), value: 'double' },
                    ]}
                    value={value.general['border-style']}
                    onChange={val => {
                        value.general['border-style'] = val;
                        if (val === 'none') value.general.width = 0;
                        onChange(JSON.stringify(value));
                    }}
                />
            )}
            {!disableBorderRadius && value.general['border-style'] === 'solid' && (
                <SelectControl
                    label={__('Border Radius', 'maxi-blocks')}
                    options={[
                        { label: __('No', 'maxi-blocks'), value: '' },
                        { label: __('Yes', 'maxi-blocks'), value: '20px' },
                    ]}
                    value={value.general['border-radius']}
                    onChange={val => {
                        value.general['border-radius'] = val;
                        onChange(JSON.stringify(value));
                    }}
                />
            )}
            {orientation === 'horizontal' && (
                <Fragment>
                    <RangeControl
                        label={__('Size', 'maxi-blocks')}
                        value={Number(value.general.width)}
                        onChange={val => {
                            isNil(val)
                                ? (value.general.width =
                                      defaultValue.general.width)
                                : (value.general.width = Number(val));

                            onChange(JSON.stringify(value));
                        }}
                        allowReset
                        initialPosition={defaultValue.general.width}
                    />
                    <RangeControl
                        label={__('Weight', 'maxi-blocks')}
                        value={Number(value.general['border-top-width'])}
                        onChange={val => {
                            isNil(val)
                                ? (value.general['border-top-width'] =
                                      defaultValue.general['border-top-width'])
                                : (value.general['border-top-width'] = Number(
                                      val
                                  ));

                            onChange(JSON.stringify(value));
                        }}
                        allowReset
                        initialPosition={
                            defaultValue.general['border-top-width']
                        }
                    />
                </Fragment>
            )}
            {orientation === 'vertical' && (
                <Fragment>
                    <RangeControl
                        label={__('Size', 'maxi-blocks')}
                        value={Number(value.general.height)}
                        onChange={val => {
                            isNil(val)
                                ? (value.general.height =
                                      defaultValue.general.height)
                                : (value.general.height = Number(val));

                            onChange(JSON.stringify(value));
                        }}
                        max={100}
                        allowReset
                        initialPosition={defaultValue.general.height}
                    />
                    <RangeControl
                        label={__('Weight', 'maxi-blocks')}
                        value={Number(value.general['border-right-width'])}
                        onChange={val => {
                            isNil(val)
                                ? (value.general['border-right-width'] =
                                      defaultValue.general[
                                          'border-right-width'
                                      ])
                                : (value.general['border-right-width'] = Number(
                                      val
                                  ));

                            onChange(JSON.stringify(value));
                        }}
                        max={100}
                        allowReset
                        initialPosition={
                            defaultValue.general['border-right-width']
                        }
                    />
                </Fragment>
            )}
            <__experimentalOpacityControl
                opacity={value.opacity}
                defaultOpacity={defaultValue.opacity}
                onChange={val => {
                    value.opacity = val;
                    onChange(JSON.stringify(value));
                }}
            />
        </Fragment>
    );
};

export default DividerControl;
