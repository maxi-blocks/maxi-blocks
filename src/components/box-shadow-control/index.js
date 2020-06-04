/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl } = wp.components;
const { useSelect } = wp.data;

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
 * Component
 */
const BoxShadowControl = props => {
    const { 
        boxShadowOptions,
        onChange,
        className
    } = props;

    const { clientId } = useSelect(
        select => {
            const { getSelectedBlockClientId } = select(
                'core/block-editor'
            );
            return {
                clientId: getSelectedBlockClientId()
            }
        },
        []
    )

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
                onChangeDefault={() => onChange(getDefaultProp(clientId, 'boxShadow'))}
                items={[
                    {
                        content: (
                            <div
                                style={{
                                    width: '2rem',
                                    height: '1rem',
                                    boxShadow: '0px 0px 10px 0px #A2A2A2',
                                    background: '#fff'
                                }}
                            >
                                </div>
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowTotal))

                    },
                    {
                        content: (
                            <hr
                                style={{
                                    width: '2rem',
                                    height: '1rem',
                                    boxShadow: '0px 7px 15px -2px #A2A2A2',
                                    background: '#fff'
                                }}
                            />
                        ),
                        onChange: () => onChange(JSON.stringify(boxShadowBottom))
                    },
                    {
                        content: (
                            <hr
                                style={{
                                    width: '2rem',
                                    height: '1rem',
                                    boxShadow: '2.5px 5px 0px 0px #A2A2A2',
                                    background: '#fff'
                                }}
                            />
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