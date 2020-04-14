/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    dispatch,
    select
} = wp.data;

/**
 * External dependencies
 */
import MiniSizeControl from '../../mini-size-control';

export const sizeControlAttributesTest = {
    sizeTest: {
        type: 'string',
        default: '{"label":"Size","general":{"max-widthUnit":"px","max-width":"","widthUnit":"px","width":"","min-widthUnit":"px","min-width":"","max-heightUnit":"px","max-height":"","heightUnit":"px","height":"","min-heightUnit":"px","min-height":""}}'
    }
}

/**
 * Block
 */
const SizeControlTest = (props) => {
    const {
        sizeSettings,
        onChange,
        target = ''
    } = props;

    let value = typeof sizeSettings === 'object' ? sizeSettings : JSON.parse(sizeSettings);

    const onChangeValue = (target, val) => {
        if (typeof val === 'undefined')
            val = '';
        value.general[target] = val;
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
    * Creates a new object that 
    *
    * @param {string} target	Block attribute: uniqueID
    * @param {obj} meta		Old and saved metadate
    * @param {obj} value	New values to add
    */
    const metaValue = () => {
        const meta = getMeta();
        const styleTarget = getTarget();
        const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, value);
        const response = JSON.stringify(responsiveStyle.getNewValue);
        return response;
    }

    /**
    * Saves and send the data. Also refresh the styles on Editor
    */
    const saveAndSend = () => {
        onChange(JSON.stringify(value));
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: metaValue(),
            },
        });
        new BackEndResponsiveStyles(getMeta());
    }

    return (
        <Fragment>
            <MiniSizeControl
                label={__("Max Width", 'gutenberg-extra')}
                unit={value.general['max-widthUnit']}
                onChangeUnit={value => onChangeValue('max-widthUnit', value )}
                value={value.general['max-width']}
                onChangeValue={value => onChangeValue('max-width', value )}
            />
            <MiniSizeControl
                label={__("Width", 'gutenberg-extra')}
                unit={value.general.widthUnit}
                onChangeUnit={value => onChangeValue('widthUnit', value )}
                value={value.general.width}
                onChangeValue={value => onChangeValue('width', value )}
            />
            <MiniSizeControl
                label={__("Min Width", 'gutenberg-extra')}
                unit={value.general['min-widthUnit']}
                onChangeUnit={value => onChangeValue('min-widthUnit', value )}
                value={value.general['min-width']}
                onChangeValue={value => onChangeValue('min-width', value )}
            />
            <MiniSizeControl
                label={__("Max Height", 'gutenberg-extra')}
                unit={value.general['max-heightUnit']}
                onChangeUnit={value => onChangeValue('max-heightUnit', value )}
                value={value.general['max-height']}
                onChangeValue={value => onChangeValue('max-height', value )}
            />
            <MiniSizeControl
                label={__("Height", 'gutenberg-extra')}
                unit={value.general.heightUnit}
                onChangeUnit={value => onChangeValue('heightUnit', value )}
                value={value.general.height}
                onChangeValue={value => onChangeValue('height', value )}
            />
            <MiniSizeControl
                label={__("Min Height", 'gutenberg-extra')}
                unit={value.general['min-heightUnit']}
                onChangeUnit={value => onChangeValue('min-heightUnit', value )}
                value={value.general['min-height']}
                onChangeValue={value => onChangeValue('min-height', value )}
            />
        </Fragment>
    )
}

export default SizeControlTest;