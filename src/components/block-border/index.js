const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelColorSettings } = wp.blockEditor;
const { SelectControl } = wp.components;
import DimensionsControl from '../dimensions-control/index';

export const blockBorderAttributes = {
    blockBorderColor: {
        type: 'string',
        default: "",
    },
    borderHoverColor: {
        type: 'string',
        default: "",
    },
    borderType: {
        type: 'string',
        default: 'none',
    },
	borderRadius: {
        type: 'string',
        default: '{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}}'
    },
    borderWidth: {
        type: 'string',
        default: '{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}'
    }
}

export const BlockBorder = (props) => {
    const {
        attributes: {
            blockBorderColor,
            borderType,
            borderRadius,
            borderWidth
        },
        setAttributes
    } = props;

    return (
        <Fragment>
            <PanelColorSettings
                title={__('Color Settings', 'gutenberg-extra')}
                colorSettings={[
                    {
                        value: blockBorderColor,
                        onChange: (value) => setAttributes({ blockBorderColor: value }),
                        label: __('Border Colour', 'gutenberg-extra'),
                    },
                ]}
            />
            <SelectControl
                label="Border Type"
                className="gx-border-type"
                value={borderType}
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
                onChange={(value) => setAttributes({ borderType: value })}
            />
            <DimensionsControl
                value={borderRadius}
                onChange={value => setAttributes({borderRadius: value})}
            />
            <DimensionsControl
                value={borderWidth}
                onChange={value => setAttributes({borderWidth: value})}
            />
        </Fragment>
    )
}