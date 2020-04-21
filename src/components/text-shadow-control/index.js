/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import SizeControl from '../size-control';
import PopoverControl from '../popover-control';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Block
 */
const TextShadow = props => {
    const {
        value,
        onChange,
        defaultColor
    } = props;

    const minMaxSettings = {
        'px': {
            min: -100,
            max: 100
        },
        'em': {
            min: -10,
            max: 10
        },
        'vw': {
            min: -10,
            max: 10
        },
        '%': {
            min: -10,
            max: 10
        }
    };

    const valueDecomposed = value != 'none' ? value.split(' ') : `0px 0px 0px ${defaultColor}`.split(' ');
    const yDecomposed = valueDecomposed[0].match(/[-?0-9\d*]+|\D+/g);
    const y = Number(yDecomposed[0]);
    const yUnit = yDecomposed[1];
    const xDecomposed = valueDecomposed[1].match(/[-?0-9\d*]+|\D+/g);
    const x = Number(xDecomposed[0]);
    const xUnit = xDecomposed[1];
    const blurDecomposed = valueDecomposed[2].match(/[-?0-9\d*]+|\D+/g);
    const blur = Number(blurDecomposed[0]);
    const blurUnit = blurDecomposed[1];
    const color = valueDecomposed[3];

    const onChangeValue = (i, val, unit = '') => {
        if(isNil(val))
            valueDecomposed[i] = 0 + unit;    
        else
            valueDecomposed[i] = val + unit;
        if(
            valueDecomposed[0] === '0px' &&
            valueDecomposed[1] === '0px' &&
            valueDecomposed[2] === '0px'
        )
            onChange('none');
        else
            onChange(valueDecomposed.join(' '));
    }

    return (
        <Fragment>
            <ColorControl
                label={__('Color', 'gutenberg-extra')}
                color={color}
                onColorChange={val => onChangeValue(3, val)}
                onReset={() => onChangeValue(3, defaultColor)}
                disableGradient
                disableGradientAboveBackground
            />
            <SizeControl
                label={__('Y-axis', 'gutenberg-extra')}
                unit={yUnit}
                onChangeUnit={val => onChangeValue(0, y, val)}
                value={y}
                onChangeValue={val => onChangeValue(0, val, yUnit)}
                minMaxSettings={minMaxSettings}

            />
            <SizeControl
                label={__('X-axis', 'gutenberg-extra')}
                unit={xUnit}
                onChangeUnit={val => onChangeValue(0, x, val)}
                value={x}
                onChangeValue={val => onChangeValue(0, val, xUnit)}
                minMaxSettings={minMaxSettings}
            />
            <RangeControl
                label={__('Blur', 'gutenberg-extra')}
                value={blur}
                onChange={val => onChangeValue(2, val, blurUnit)}
                min={0}
                max={100}
            />
        </Fragment>
    )
}

/**
 * Control
 */
const TextShadowControl = props => {
    const {
        value,
        onChange,
        defaultColor
    } = props;

    return (
        <PopoverControl
            label={__('Text Shadow', 'gutenberg-extra')}
            showReset
            onReset={() => onChange('none')}
            popovers={[
                {
                    content: (
                        <TextShadow
                            value={value}
                            onChange={val => onChange(val)}
                            defaultColor={defaultColor}
                        />
                    )
                }
            ]}
        />
    )
}

export default TextShadowControl;