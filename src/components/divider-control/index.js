/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Fragment,
    useState,
    useEffect
} = wp.element;
const {
    RangeControl,
    SelectControl,
    Icon
} = wp.components;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../extensions/styles/utils';
import {
    ColorControl,
    DefaultStylesControl,
} from '../../components';
import {
    dividerSolidHorizontal,
    dividerDottedHorizontal,
    dividerDashedHorizontal,
    dividerSolidVertical,
    dividerDottedVertical,
    dividerDashedVertical,
} from './defaults';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import {
    styleNone,
    dashed,
    dotted,
    solid
} from '../../icons';

/**
 * Component
 */
const DividerControl = props => {
    const {
        dividerOptions,
        onChange,
        lineOrientation
    } = props;

    const [orientation, changeOrientation] = useState(
        lineOrientation
    )

    const [value, changeValue] = useState(
        typeof dividerOptions != 'object' ?
            JSON.parse(dividerOptions) :
            dividerOptions
    )

    useEffect(
        () => {
            if (lineOrientation != orientation) {
                changeOrientation(lineOrientation);
                console.log(!isNil(value.general['border-top-width']))
                if (lineOrientation === 'vertical') {
                    if (!isNil(value.general.width)) {
                        value.general.height = value.general.width;
                        value.general.width = '';
                    }
                    if (!isNil(value.general['border-top-width'])) {
                        value.general['border-right-width'] = value.general['border-top-width'];
                        value.general['border-top-width'] = '';
                    }
                }
                else {
                    if (!isNil(value.general.height)) {
                        value.general.width = value.general.height;
                        value.general.height = '';
                    }
                    if (!isNil(value.general['border-top-width'])) {
                        value.general['border-top-width'] = value.general['border-right-width'];
                        value.general['border-right-width'] = '';
                    }
                }

                changeValue(value);
                onChange(JSON.stringify(value));
            }
        },
        [lineOrientation, orientation, value, onChange]
    );

    return (
        <Fragment>
            <DefaultStylesControl
                items={[
                    {
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChange(getDefaultProp(null, 'divider2'))
                    },
                    {
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={solid}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal') {
                                onChange(JSON.stringify(dividerSolidHorizontal));
                                changeValue(dividerSolidHorizontal);
                            }
                            else {
                                onChange(JSON.stringify(dividerSolidVertical));
                                changeValue(dividerSolidVertical);
                            }
                        }
                    },
                    {
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dashed}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal') {
                                onChange(JSON.stringify(dividerDashedHorizontal));
                                changeValue(dividerDashedHorizontal);
                            }
                            else {
                                onChange(JSON.stringify(dividerDashedVertical));
                                changeValue(dividerDashedVertical);
                            }
                        }
                    },
                    {
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dotted}
                            />
                        ),
                        onChange: () => {
                            if (lineOrientation === 'horizontal') {
                                onChange(JSON.stringify(dividerDottedHorizontal));
                                changeValue(dividerDottedHorizontal);
                            }
                            else {
                                onChange(JSON.stringify(dividerDottedVertical));
                                changeValue(dividerDottedVertical);
                            }
                        }
                    },
                ]}
            />
            <ColorControl
                label={__('Color', 'maxi-blocks')}
                color={value.general['border-color']}
                // defaultColor={dividerColorDefault}
                onColorChange={val => {
                    value.general['border-color'] = val;
                    onChange(JSON.stringify(value))
                }}
                disableGradient
            />
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
                    if (val === 'none')
                        value.general.width = 0;
                    onChange(JSON.stringify(value))
                }}
            />
            {
                value.general['border-style'] === 'solid' &&
                <SelectControl
                    label={__('Border Radius', 'maxi-blocks')}
                    options={[
                        { label: __('No', 'maxi-blocks'), value: '' },
                        { label: __('Yes', 'maxi-blocks'), value: '20px' }
                    ]}
                    value={value.general['border-radius']}
                    onChange={val => {
                            value.general['border-radius'] = val;
                        onChange(JSON.stringify(value));
                    }}
                />
            }
            {
                orientation === 'horizontal' &&
                <Fragment>
                    <RangeControl
                        label={__('Size', 'maxi-blocks')}
                        value={Number(value.general.width)}
                        onChange={val => {
                            if (!!val)
                                value.general.width = Number(val);
                            else
                                value.general.width = '';
                            onChange(JSON.stringify(value));
                        }}
                        allowReset
                    />
                    <RangeControl
                        label={__('Weight', 'maxi-blocks')}
                        value={Number(value.general['border-top-width'])}
                        onChange={val => {
                            if (!!val)
                                value.general['border-top-width'] = Number(val);
                            else
                                value.general['border-top-width'] = '';
                            onChange(JSON.stringify(value));
                        }}
                        allowReset
                    />
                </Fragment>
            }
            {
                orientation === 'vertical' &&
                <Fragment>
                    <RangeControl
                        label={__('Size', 'maxi-blocks')}
                        value={Number(value.general.height)}
                        onChange={val => {
                            if (!!val)
                                value.general.height = Number(val);
                            else
                                value.general.height = '';
                            onChange(JSON.stringify(value));
                        }}
                        max={999}
                        allowReset
                    />
                    <RangeControl
                        label={__('Weight', 'maxi-blocks')}
                        value={Number(value.general['border-right-width'])}
                        onChange={val => {
                            if (!!val)
                                value.general['border-right-width'] = Number(val);
                            else
                                value.general['border-right-width'] = '';
                            onChange(JSON.stringify(value));
                        }}
                        max={999}
                        allowReset
                    />
                </Fragment>
            }
            <RangeControl
                label={__("Opacity", "maxi-blocks")}
                className={"maxi-opacity-control"}
                value={value.general.opacity * 100}
                onChange={val => {
                    if (!!val)
                        value.general.opacity = Number(val) / 100;
                    else
                        value.general.opacity = '';
                    onChange(JSON.stringify(value))
                }}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
        </Fragment>
    )
}

export default DividerControl;