const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelColorSettings } = wp.blockEditor;
const { SelectControl } = wp.components;
import DimensionsControl from '../dimensions-control/index';

export const borderAttributes = {
    borderColor: {
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
        borderColor = props.attributes.borderColor,
        onChangeBorderColor = undefined,
        colorLabel = __('Border Colour', 'gutenberg-extra'),
        borderTypeLabel = __("Border Type", 'gutenberg-extra'),
        borderTypeClassName = "gx-border-type",
        borderType = props.attributes.borderType,
        onChangeBorderType = undefined,
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
        onChangeBorderRadius = undefined,
        borderWidth = props.attributes.borderWidth,
        onChangeBorderWidth = undefined,
        borderRadiusTarget = '',
        borderWidthTarget = '',
        setAttributes,
    } = props;

    const onBorderColorChange = value => {
        if (typeof onChangeBorderColor != 'undefined' ) {
            onChangeBorderColor(value);
        }
        else {
            setAttributes({borderColor: value})
        }
    }

    const onBorderTypeChange = value => {
        if (typeof onChangeBorderType != 'undefined' ) {
            onChangeBorderType(value);
        }
        else {
            setAttributes({borderType: value})
        }
    }

    const onBorderRadiusChange = value => {
        if (typeof onChangeBorderRadius != 'undefined' ) {
            onChangeBorderRadius(value);
        }
        else {
            setAttributes({borderRadius: value})
        }
    }

    const onBorderWidthChange = value => {
        if (typeof onChangeBorderWidth != 'undefined' ) {
            onChangeBorderWidth(value);
        }
        else {
            setAttributes({borderWidth: value})
        }
    }

    return (
        <Fragment>
            <PanelColorSettings
                title={colorTitle}
                colorSettings={[
                    {
                        value: borderColor,
                        onChange: value => onBorderColorChange(value),
                        label: colorLabel,
                    },
                ]}
            />
            <SelectControl
                label={borderTypeLabel}
                className={borderTypeClassName}
                value={borderType}
                options={borderTypeOptions}
                onChange={value => onBorderTypeChange(value)}
            />
            <DimensionsControl
                value={borderRadius}
                onChange={value => onBorderRadiusChange(value)}
                target={borderRadiusTarget}
            />
            <DimensionsControl
                value={borderWidth}
                onChange={value => onBorderWidthChange(value)}
                target={borderWidthTarget}
            />
        </Fragment>
    )
}