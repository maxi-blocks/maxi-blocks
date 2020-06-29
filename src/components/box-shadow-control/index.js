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
        boxShadowOptions,
        onChange,
        className
    } = props;

    let value = typeof boxShadowOptions === 'object' ?
        boxShadowOptions :
        JSON.parse(boxShadowOptions);
    const classes = classnames(
        'maxi-shadow-control',
        className
    )

    const onChangeValue = (target, val) => {
        value[target] = val;
        onChange(JSON.stringify(value));
    }

    return (
        <div className={classes}>
            <DefaultStylesControl
                items={[
                    {
                        activeItem: ( value.shadowType === undefined ),
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChange(getDefaultProp(null, 'boxShadow'))
                    },
                    {
                        activeItem: ( value.shadowType === 'total' ),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__total'
                            ></div>
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowTotal))

                    },
                    {
                        activeItem: ( value.shadowType === 'bottom' ),
                        content: (
                            <div
                                className='maxi-shadow-control__default maxi-shadow-control__default__bottom'
                            ></div>
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowBottom))
                    },
                    {
                        activeItem: ( value.shadowType === 'solid' ),
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
                label={__('Color', 'maxi-blocks')}
                className={'maxi-shadow-control__color'}
                color={value.shadowColor}
                defaultColor={value.defaultShadowColor}
                onColorChange={val => onChangeValue('shadowColor', val)}
                disableGradient
                disableImage
                disableVideo
                disableGradientAboveBackground
            />
            <RangeControl
                label={__('Horizontal', 'maxi-blocks')}
                className={'maxi-shadow-control__horizontal'}
                value={value.shadowHorizontal}
                onChange={val => onChangeValue('shadowHorizontal', val)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Vertical', 'maxi-blocks')}
                className={'maxi-shadow-control__vertical'}
                value={value.shadowVertical}
                onChange={val => onChangeValue('shadowVertical', val)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Blur', 'maxi-blocks')}
                className={'maxi-shadow-control__blur'}
                value={value.shadowBlur}
                onChange={val => onChangeValue('shadowBlur', val)}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Spread', 'maxi-blocks')}
                className={'maxi-shadow-control__spread-control'}
                value={value.shadowSpread}
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