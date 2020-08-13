/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RangeControl,
    Icon
} = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import {
    boxShadowNone,
    boxShadowTotal,
    boxShadowBottom,
    boxShadowSolid
} from './defaults';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isObject,
    isNil,
    trim
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone } from '../../icons';

/**
 * Component
 */
const BoxShadowControl = props => {
    const {
        boxShadow,
        defaultBoxShadow,
        onChange,
        className,
        breakpoint,
        disableAdvanced = false
    } = props;

    const value = !isObject(boxShadow) ?
        JSON.parse(boxShadow) :
        boxShadow;

    const defaultValue = !isObject(defaultBoxShadow) ?
        JSON.parse(defaultBoxShadow) :
        defaultBoxShadow

    const classes = classnames(
        'maxi-shadow-control',
        className
    )

    const onChangeValue = (target, val) => {
        if (isNil(val))
            value[breakpoint][target] = defaultValue[breakpoint][target];
        else
            value[breakpoint][target] = val;

        value[breakpoint].shadowType = false;

        onChange(JSON.stringify(value));
    }

    const onChangeDefault = defaultBoxShadow => {
        value[breakpoint] = defaultBoxShadow;

        onChange(JSON.stringify(value));
    }

    return (
        <div className={classes}>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: getLastBreakpointValue(value, 'shadowType', breakpoint) === 'none',
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChangeDefault(boxShadowNone)
                    },
                    {
                        activeItem: getLastBreakpointValue(value, 'shadowType', breakpoint) === 'total',
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__total'
                            ></div>
                        ),
                        onChange: () => onChangeDefault(boxShadowTotal)

                    },
                    {
                        activeItem: getLastBreakpointValue(value, 'shadowType', breakpoint) === 'bottom',
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__bottom'
                            ></div>
                        ),
                        onChange: () => onChangeDefault(boxShadowBottom)
                    },
                    {
                        activeItem: getLastBreakpointValue(value, 'shadowType', breakpoint) === 'solid',
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__solid'
                            ></div>
                        ),
                        onChange: () => onChangeDefault(boxShadowSolid)
                    },
                ]}
            />
            <ColorControl
                label={__('Box Shadow', 'maxi-blocks')}
                className={'maxi-shadow-control__color'}
                color={getLastBreakpointValue(value, 'shadowColor', breakpoint)}
                defaultColor={defaultValue[breakpoint].shadowColor}
                onColorChange={val => onChangeValue('shadowColor', val)}
                disableGradient
                disableImage
                disableVideo
                disableGradientAboveBackground
            />
            {
                !disableAdvanced &&
                <Fragment>
                    <RangeControl
                        label={__('Horizontal', 'maxi-blocks')}
                        className={'maxi-shadow-control__horizontal'}
                        value={Number(getLastBreakpointValue(value, 'shadowHorizontal', breakpoint))}
                        onChange={val => onChangeValue('shadowHorizontal', Number(val))}
                        min={-100}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                    <RangeControl
                        label={__('Vertical', 'maxi-blocks')}
                        className={'maxi-shadow-control__vertical'}
                        value={Number(getLastBreakpointValue(value, 'shadowVertical', breakpoint))}
                        onChange={val => onChangeValue('shadowVertical', Number(val))}
                        min={-100}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                    <RangeControl
                        label={__('Blur', 'maxi-blocks')}
                        className={'maxi-shadow-control__blur'}
                        value={Number(getLastBreakpointValue(value, 'shadowBlur', breakpoint))}
                        onChange={val => onChangeValue('shadowBlur', Number(val))}
                        min={0}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                    <RangeControl
                        label={__('Spread', 'maxi-blocks')}
                        className={'maxi-shadow-control__spread-control'}
                        value={Number(getLastBreakpointValue(value, 'shadowSpread', breakpoint))}
                        onChange={val => onChangeValue('shadowSpread', Number(val))}
                        min={-100}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                </Fragment>
            }
        </div>
    )
}

export default BoxShadowControl;