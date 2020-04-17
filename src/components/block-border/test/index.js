/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;
const {
	dispatch,
	select
} = wp.data;

/**
 * Internal dependencies
 */
import DimensionsControl from '../../dimensions-control/index';
import ColorControl from '../../color-control';

/**
 * Attributes
 */
export const borderAttributesTest = {
    borderTest: {
        type: 'string',
        default: '{"label":"Border","general":{"border-color":"","border-style":"solid"},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}},"borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}}}'
    }
}

/**
 * Block
 */
const BlockBorderTest = (props) => {
    const {
        borderOptions,
        onChange,
        target = ''
    } = props;

    let value = typeof borderOptions === 'object' ? borderOptions : JSON.parse(borderOptions);

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
        const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, value, false);
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
            <ColorControl
                label={__('Color Color', 'gutenberg-extra')}
                color={value.general['border-color']}
                onColorChange={val => {
                    value.general['border-color'] = val;
                    saveAndSend();
                }}
                disableGradient
                disableGradientAboveBackground
            />
            <SelectControl
                label={__('Border Type', 'gutenberg-extra')}
                className="gx-border-type"
                value={value.general['border-style']}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Dotted', value: 'dotted' },
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Solid', value: 'solid' },
                    { label: 'Double', value: 'double' },
                    { label: 'Groove', value: 'groove' },
                    { label: 'Ridge', value: 'ridge' },
                    { label: 'Inset', value: 'inset' },
                    { label: 'Outset', value: 'outset' },
                ]}
                onChange={val => {
                    value.general['border-style'] = val;
                    saveAndSend();
                }}
            />
            <DimensionsControl
                value={value.borderWidth}
                onChange={val => {
                    value.borderWidth = JSON.parse(val);
                    saveAndSend();
                }}
                target={target}
                avoidZero
            />
            <DimensionsControl
                value={value.borderRadius}
                onChange={val => {
                    value.borderRadius = JSON.parse(val);
                    saveAndSend();
                }}
                target={target}
                avoidZero
            />
        </Fragment>
    )
}

export default BlockBorderTest;