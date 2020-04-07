/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    dispatch,
    select
} = wp.data;
import { RangeControl } from '@wordpress/components';


/**
 * External dependencies
 */
import ColorControl from '../color-control';

/**
 * Attributes
 */
export const boxShadowOptionsAttributes = {
    boxShadowOptions: {
        type: 'string',
        default: '{"label":"Box Shadow","shadowColor":"","shadowGradient":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"}',
    }
}

/**
 * Block
 */
export const BoxShadow = (props) => {

    const {
        boxShadowOptions = props.attributes.boxShadowOptions,
        onChange,
        target = ''
    } = props;

    let value = typeof boxShadowOptions === 'object' ? boxShadowOptions : JSON.parse(boxShadowOptions);

    const onChangeValue = (target, val) => {
        value[target] = val;
        saveAndSend();
    }

    /**
    * Retrieves the old meta data
    */
    const getMeta = () => {
        let meta = select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles;
        return meta ? JSON.parse(meta) : {};
    }

    /**
     * Retrieve the target for responsive CSS
     */
    const getTarget = () => {
        let styleTarget = select('core/block-editor').getBlockAttributes(select('core/block-editor').getSelectedBlockClientId()).uniqueID;
        styleTarget = `${styleTarget}${target.length > 0 ? `__$${target}` : ''}`;
        return styleTarget;
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    const getObject = () => {
        const response = {
            label: value.label,
            general: {
                "box-shadow": getShadow()
            }
        }

        return response;
    }

    const getShadow = () => {
        let response = '';
        value.shadowHorizontal ? response += (value.shadowHorizontal + 'px ') : null;
        value.shadowVertical ? response += (value.shadowVertical + 'px ') : null;
        value.shadowBlur ? response += (value.shadowBlur + 'px ') : null;
        value.shadowSpread ? response += (value.shadowSpread + 'px ') : null;
        value.shadowColor ? response += (value.shadowColor) : null;

        return response.trim();
    }

    /**
    * Creates a new object ready to be saved as meta value on the post
    *
    * @param {string} target	Block attribute: uniqueID
    * @param {obj} meta		Old and saved metadate
    * @param {obj} value	New values to add
    */
    const metaValue = () => {
        const meta = getMeta();
        const styleTarget = getTarget();
        const obj = getObject();
        const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, obj);
        const response = JSON.stringify(responsiveStyle.getNewValue);
        return response;
    }

    const saveAndSend = () => {
        onChange(JSON.stringify(value))
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: metaValue(),
            },
        });
        new BackEndResponsiveStyles(getMeta());
    }

    return (
        <Fragment>
            <ColorControl 
                label={__('Color', 'gutenberg-extra')}
                color={value.shadowColor}
                onColorChange={value => onChangeValue('shadowColor', value)}
                gradient={value.shadowGradient}
                onGradientChange={value => onChangeValue('shadowGradient', value)}
                disableGradientAboveBackground
            />
            <RangeControl
                label={__('Horizontal', 'gutenberg-extra')}
                className={'gx-shadow-horizontal-control'}
                value={value.shadowHorizontal}
                onChange={value => onChangeValue('shadowHorizontal', value)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Vertical', 'gutenberg-extra')}
                className={'gx-shadow-vertical-control'}
                value={value.shadowVertical}
                onChange={value => onChangeValue('shadowVertical', value)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Blur', 'gutenberg-extra')}
                className={'gx-shadow-blur-control'}
                value={value.shadowBlur}
                onChange={value => onChangeValue('shadowBlur', value)}
                min={0}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
            <RangeControl
                label={__('Spread', 'gutenberg-extra')}
                className={'gx-shadow-spread-control'}
                value={value.shadowSpread}
                onChange={value => onChangeValue('shadowSpread', value)}
                min={-100}
                max={100}
                allowReset={true}
                initialPosition={0}
            />
        </Fragment>
    )
}