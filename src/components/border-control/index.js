/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    SelectControl,
    Icon,
} = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import __experimentalAxisControl from '../axis-control';
import {
    borderNone,
    borderSolid,
    borderDashed,
    borderDotted
} from './defaults'

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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
const BorderControl = props => {
    const {
        border,
        className,
        onChange,
        breakpoint = 'general',
        disableAdvanced = false
    } = props;

    let value = !isObject(border) ?
        JSON.parse(border) :
        border;

    const classes = classnames(
        'maxi-border-control',
        className
    );

    const onChangeDefault = defaultProp => {
        value[breakpoint] = defaultProp.border;
        value.borderWidth.unit = defaultProp.borderWidth.unit;
        value.borderWidth[breakpoint] = defaultProp.borderWidth.width;

        onChange(JSON.stringify(value))
    }

    return (
        <div className={classes}>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: (value[breakpoint]['border-style'] === 'none'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChangeDefault(borderNone)
                    },
                    {
                        activeItem: (value[breakpoint]['border-style'] === 'solid'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={solid}
                            />
                        ),
                        onChange: () => onChangeDefault(borderSolid)
                    },
                    {
                        activeItem: (value[breakpoint]['border-style'] === 'dashed'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dashed}
                            />
                        ),
                        onChange: () => onChangeDefault(borderDashed)
                    },
                    {
                        activeItem: (value[breakpoint]['border-style'] === 'dotted'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dotted}
                            />
                        ),
                        onChange: () => onChangeDefault(borderDotted)
                    },
                ]}
            />
            <ColorControl
                label={__('Border', 'maxi-blocks')}
                color={value[breakpoint]['border-color']}
                defaultColor={value['defaultBorderColor']}
                onColorChange={val => {
                    value[breakpoint]['border-color'] = val;
                    onChange(JSON.stringify(value));
                }}
                disableImage
                disableVideo
                disableGradient
                disableGradientAboveBackground
            />
            {
                !disableAdvanced &&
                <Fragment>
                    <SelectControl
                        label={__('Border Type', 'maxi-blocks')}
                        className='maxi-border-control__type'
                        value={value[breakpoint]['border-style']}
                        options={[
                            { label: 'None', value: 'none' },
                            { label: 'Dotted', value: 'dotted' },
                            { label: 'Dashed', value: 'dashed' },
                            { label: 'Solid', value: 'solid' },
                            { label: 'Double', value: 'double' },
                            { label: 'Groove', value: 'groove' },
                            { label: 'Ridge', value: 'ridge' },
                            { label: 'Inset', value: 'inset' },
                            { label: 'Outset', value: 'outset' },
                        ]}
                        onChange={val => {
                            value[breakpoint]['border-style'] = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <__experimentalAxisControl
                        values={value.borderWidth}
                        onChange={val => {
                            console.log('axiscontrol', val)
                            value.borderWidth = JSON.parse(val);
                            onChange(JSON.stringify(value));
                        }}
                        breakpoint={breakpoint}
                        disableAuto
                    />
                    <__experimentalAxisControl
                        values={value.borderRadius}
                        onChange={val => {
                            console.log('axiscontrol', val)
                            value.borderRadius = JSON.parse(val);
                            onChange(JSON.stringify(value));
                        }}
                        breakpoint={breakpoint}
                        disableAuto
                    />
                </Fragment>
            }
        </div>
    )
}

export default BorderControl;