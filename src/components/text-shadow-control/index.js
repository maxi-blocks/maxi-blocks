/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Fragment,
    useState
} = wp.element;
const {
    RangeControl,
    SelectControl,
    Icon
} = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil,
    isEmpty
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleNone } from '../../icons';

/**
 * Component
 */
const TextShadow = props => {
    const {
        value,
        onChange,
        defaultColor,
    } = props;

    const valueDecomposed = !isEmpty(value) && value != 'none' ?
        value.split(' ') :
        `0px 0px 0px ${defaultColor}`.split(' ');
    const x = Number(valueDecomposed[0].match(/[-?0-9\d*]+|\D+/g)[0]);
    const y = Number(valueDecomposed[1].match(/[-?0-9\d*]+|\D+/g)[0]);
    const blur = Number(valueDecomposed[2].match(/[-?0-9\d*]+|\D+/g)[0]);
    const color = valueDecomposed[3];

    const onChangeValue = (i, val) => {
        if (isNil(val))
            valueDecomposed[i] = 0 + 'px';
        else
            valueDecomposed[i] = val + 'px';

        if (
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
            <DefaultStylesControl
                items={[
                    {
                        content: (
                            <Icon
                                className='maxi-defaultstyles-control__button__icon'
                                icon={styleNone}
                            />
                        ),
                        onChange: () => onChange('')
                    },
                    {
                        content: (
                            <span
                                className='maxi-textshadow-control__default maxi-textshadow-control__default__total'
                            >
                                Maxi
                            </span>
                        ),
                        onChange: () => onChange('0px 0px 5px #A2A2A2')
                    },
                    {
                        content: (
                            <span
                                className='maxi-textshadow-control__default maxi-textshadow-control__default__bottom'
                            >
                                Maxi
                            </span>
                        ),
                        onChange: () => onChange('5px 0px 3px #A2A2A2')
                    },
                    {
                        content: (
                            <span
                                className='maxi-textshadow-control__default maxi-textshadow-control__default__solid'
                            >
                                Maxi
                            </span>
                        ),
                        onChange: () => onChange('2px 4px 0px #A2A2A2')
                    },
                ]}
            />
            <ColorControl
                label={__('Color', 'maxi-blocks')}
                color={color}
                onColorChange={val => onChangeValue(3, val)}
                onReset={() => onChangeValue(3, defaultColor)}
                disableGradient
                disableGradientAboveBackground
            />
            <RangeControl
                label={__('X-axis', 'maxi-blocks')}
                value={x}
                onChange={val => onChangeValue(0, val)}
                min={0}
                max={100}
                allowReset
            />
            <RangeControl
                label={__('Y-axis', 'maxi-blocks')}
                value={y}
                onChange={val => onChangeValue(1, val)}
                min={0}
                max={100}
                allowReset
            />
            <RangeControl
                label={__('Blur', 'maxi-blocks')}
                value={blur}
                onChange={val => onChangeValue(2, val)}
                min={0}
                max={100}
                allowReset
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
        defaultColor,
        className
    } = props;

    const [showOptions, changeShowOptions] = useState(
        !isEmpty(value) ? true : false
    );
    const [lastValue, changeLastValue] = useState(value);

    const classes = classnames(
        'maxi-textshadow-control',
        className
    )

    return (
        <div className={classes}>
            <SelectControl
                label={__('Text Shadow', 'maxi-blocks')}
                value={showOptions}
                options={[
                    { label: __('No', 'maxi-blocks'), value: false },
                    { label: __('Yes', 'maxi-blocks'), value: true }
                ]}
                onChange={val => {
                    changeShowOptions(!showOptions);
                    if (showOptions) {
                        changeLastValue(value);
                        onChange('');
                    }
                    else
                        onChange(lastValue)
                }}
            />
            {
                showOptions &&
                <TextShadow
                    value={lastValue}
                    onChange={val => {
                        changeLastValue(val);
                        onChange(val)
                    }}
                    defaultColor={defaultColor}
                />
            }
        </div>
    )
}

export default TextShadowControl;