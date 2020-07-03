/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    SelectControl,
    Icon,
} = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DimensionsControl from '../dimensions-control';
import DefaultStylesControl from '../default-styles-control';
import __experimentalAxisControl from '../axis-control';
import { getDefaultProp } from '../../extensions/styles/utils';
import {
    borderSolid,
    borderDasehd,
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
        breakpoint = 'general'
    } = props;

    let value = !isObject(border) ?
        JSON.parse(border) :
        border;

    const classes = classnames(
        'maxi-border-control',
        className
    );

    return (
        <div className={classes}>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: (value.general['border-style'] === 'none'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChange(getDefaultProp(null, 'border'))
                    },
                    {
                        activeItem: (value.general['border-style'] === 'solid'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={solid}
                            />
                        ),
                        onChange: () => onChange(JSON.stringify(borderSolid))
                    },
                    {
                        activeItem: (value.general['border-style'] === 'dashed'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dashed}
                            />
                        ),
                        onChange: () => onChange(JSON.stringify(borderDasehd))
                    },
                    {
                        activeItem: (value.general['border-style'] === 'dotted'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={dotted}
                            />
                        ),
                        onChange: () => onChange(JSON.stringify(borderDotted))
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
            />
            <__experimentalAxisControl
                values={value.borderRadius}
                onChange={val => {
                    console.log('axiscontrol', val)
                    value.borderRadius = JSON.parse(val);
                    onChange(JSON.stringify(value));
                }}
                breakpoint={breakpoint}
            />
        </div>
    )
}

export default BorderControl;