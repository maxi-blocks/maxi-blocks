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
        onChange,
        className,
        breakpoint,
        disableAdvanced = false
    } = props;

    let value = !isObject(boxShadow) ?
        JSON.parse(boxShadow) :
        boxShadow;

    const classes = classnames(
        'maxi-shadow-control',
        className
    )

    const onChangeValue = (target, val) => {
        value[breakpoint][target] = val;
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
                        activeItem: (value[breakpoint].shadowType === 'none'),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChangeDefault(boxShadowNone)
                    },
                    {
                        activeItem: (value[breakpoint].shadowType === 'total'),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__total'
                            ></div>
                        ),
                        onChange: () => onChangeDefault(boxShadowTotal)

                    },
                    {
                        activeItem: (value[breakpoint].shadowType === 'bottom'),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__bottom'
                            ></div>
                        ),
                        onChange: () => onChangeDefault(boxShadowBottom)
                    },
                    {
                        activeItem: (value[breakpoint].shadowType === 'solid'),
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
                color={value[breakpoint].shadowColor}
                defaultColor={value[breakpoint].defaultShadowColor}
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
                        value={trim(value[breakpoint].shadowHorizontal)}
                        onChange={val => onChangeValue('shadowHorizontal', val)}
                        min={-100}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                    <RangeControl
                        label={__('Vertical', 'maxi-blocks')}
                        className={'maxi-shadow-control__vertical'}
                        value={trim(value[breakpoint].shadowVertical)}
                        onChange={val => onChangeValue('shadowVertical', val)}
                        min={-100}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                    <RangeControl
                        label={__('Blur', 'maxi-blocks')}
                        className={'maxi-shadow-control__blur'}
                        value={trim(value[breakpoint].shadowBlur)}
                        onChange={val => onChangeValue('shadowBlur', val)}
                        min={0}
                        max={100}
                        allowReset={true}
                        initialPosition={0}
                    />
                    <RangeControl
                        label={__('Spread', 'maxi-blocks')}
                        className={'maxi-shadow-control__spread-control'}
                        value={trim(value[breakpoint].shadowSpread)}
                        onChange={val => onChangeValue('shadowSpread', val)}
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