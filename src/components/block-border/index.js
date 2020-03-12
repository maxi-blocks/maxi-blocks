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
        colorTitle = __('Color Settings', 'gutenberg-extra'),
        blockBorderColor = props.attributes.blockBorderColor,
        colorLabel = __('Border Colour', 'gutenberg-extra'),
        borderTypeLabel = "Border Type",
        borderTypeClassName = "gx-border-type",
        borderType = props.attributes.borderType,
        borderTypeOptions = [
            { label: 'None', value: 'none' },
            { label: 'Dotted', value: 'dotted' },
            { label: 'Dashed', value: 'dashed' },
            { label: 'Solid', value: 'solid' },
            { label: 'Double', value: 'double' },
            { label: 'Groove', value: 'groove' },
            { label: 'Ridge', value: 'ridge' },
            { label: 'Inset', value: 'inset' },
            { label: 'Outset', value: 'outset' },
        ],
        borderRadius = props.attributes.borderRadius,
        borderWidth = props.attributes.borderWidth,
        borderRadiusTarget = '',
        borderWidthTarget = '',
        setAttributes
    } = props;

    return (
        <Fragment>
            <PanelColorSettings
                title={colorTitle}
                colorSettings={[
                    {
                        value: blockBorderColor,
                        onChange: (value) => setAttributes({ blockBorderColor: value }),
                        label: colorLabel,
                    },
                ]}
            />
            <SelectControl
                label={borderTypeLabel}
                className={borderTypeClassName}
                value={borderType}
                options={borderTypeOptions}
                onChange={(value) => setAttributes({ borderType: value })}
            />
            <DimensionsControl
                value={borderRadius}
                onChange={value => setAttributes({borderRadius: value})}
                target={borderRadiusTarget}
            />
            <DimensionsControl
                value={borderWidth}
                onChange={value => setAttributes({borderWidth: value})}
                target={borderWidthTarget}
            />
        </Fragment>
    )
}