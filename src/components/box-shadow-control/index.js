/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const {
    RangeControl,
    Icon
} = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import { getDefaultProp } from '../../extensions/styles/utils';
import {
    boxShadowTotal,
    boxShadowBottom,
    boxShadowSolid
} from './defaults';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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
        onChange,
        className,
        breakpoint
    } = props;

    let value = !isObject(boxShadow) ?
        JSON.parse(boxShadow) :
        boxShadow;

    const classes = classnames(
        'maxi-shadow-control',
        className
    )

    const onChangeValue = (target, val) => {
        console.log(target, val)
        value[breakpoint][target] = val;
        onChange(JSON.stringify(value));
    }

    return (
        <div className={classes}>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: ( value[breakpoint].shadowType === undefined ),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChange(getDefaultProp(null, 'boxShadow'))
                    },
                    {
                        activeItem: ( value[breakpoint].shadowType === 'total' ),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__total'
                            ></div>
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowTotal))

                    },
                    {
                        activeItem: ( value[breakpoint].shadowType === 'bottom' ),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__bottom'
                            ></div>
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowBottom))
                    },
                    {
                        activeItem: ( value[breakpoint].shadowType === 'solid' ),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__solid'
                            ></div>
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowSolid))
                    },
                ]}
            />
            <ColorControl
                label={__('Box Shadow', 'maxi-blocks')}
                className={'maxi-shadow-control__color'}
                color={value[breakpoint].shadowColor}
                defaultColor={value[breakpoint].defaultShadowColor}
                onColorChange={val => onChangeValue('shadowColor', val)}
                disableGradient
                disableImage
                disableVideo
                disableGradientAboveBackground
            />
            <RangeControl
                label={__('Horizontal', 'maxi-blocks')}
                className={'maxi-shadow-control__horizontal'}
                value={value[breakpoint].shadowHorizontal}
                onChange={val => onChangeValue('shadowHorizontal', val)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Vertical', 'maxi-blocks')}
                className={'maxi-shadow-control__vertical'}
                value={value[breakpoint].shadowVertical}
                onChange={val => onChangeValue('shadowVertical', val)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Blur', 'maxi-blocks')}
                className={'maxi-shadow-control__blur'}
                value={value[breakpoint].shadowBlur}
                onChange={val => onChangeValue('shadowBlur', val)}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Spread', 'maxi-blocks')}
                className={'maxi-shadow-control__spread-control'}
                value={value[breakpoint].shadowSpread}
                onChange={val => onChangeValue('shadowSpread', val)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
        </div>
    )
}

export default BoxShadowControl;