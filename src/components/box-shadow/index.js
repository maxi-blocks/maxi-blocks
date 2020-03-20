/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

const {
    PanelColorSettings
} = wp.blockEditor;

import { RangeControl } from '@wordpress/components';

import {
    setBoxShadowStyles
} from './data';

export const boxShadowOptionsAttributes = {
    shadowColor: {
        type: 'string',
        default: 'inherit',
    },
    shadowHorizontal: {
        type: 0,
        default: 'inherit',
    },
    shadowVertical: {
        type: 'number',
        default: 0,
    },
    shadowBlur: {
        type: 'number',
        default: 0,
    },
    shadowSpread: {
        type: 'number',
        default: 0,
    },
}

export const BoxShadowOptions = (props) => {
    const {
        value,
        onChangeLink,
        shadowSpread,
        shadowColor,
        shadowBlur,
        shadowHorizontal,
        shadowVertical,
        onChangeOptions,
        setAttributes,
    } = props;


    return (
        <Fragment>
            <PanelColorSettings
                className = 'gx-shadow-color'
                colorSettings={[
                    {
                        value: shadowColor,
                        onChange: (value) => setAttributes({ shadowColor: value }),
                        label: __('Colour', 'gutenberg-extra'),
                    },
                ]}
            />
            <RangeControl
                label={__('Horizontal', 'gutenberg-extra')}
                className={'gx-shadow-horizontal-control'}
                value={shadowHorizontal}
                onChange={value => { setAttributes({ shadowHorizontal: value})}}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Vertical', 'gutenberg-extra')}
                className={'gx-shadow-vertical-control'}
                value={shadowVertical}
                onChange={value => { setAttributes({ shadowVertical: value})}}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Blur', 'gutenberg-extra')}
                className={'gx-shadow-blur-control'}
                value={shadowBlur}
                onChange={value => { setAttributes({ shadowBlur: value})}}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Spread', 'gutenberg-extra')}
                className={'gx-shadow-spread-control'}
                value={shadowSpread}
                onChange={value => { setAttributes({ shadowSpread: value})}}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
        </Fragment>
    )
}

export const BoxShadow = ({
    value,
    boxShadowOptions,
    ...props
}) => {

    const values = JSON.parse(boxShadowOptions);

    const getShadow = () => {
        let response = 'boxShadow: ';
        values.shadowColor ? response +=  (values.shadowColor + 'px') : null;
        values.shadowHorizontal ? response += (values.shadowHorizontal + 'px') : null;
        values.shadowVertical ? response += (values.shadowVertical + 'px') : null;
        values.shadowBlur ? response += (values.shadowBlur + 'px'): null;
        values.shadowSpread ? response += (values.shadowSpread + 'px'): null;

        return response.trim();
    }

    return(
        getShadow()
    )
}