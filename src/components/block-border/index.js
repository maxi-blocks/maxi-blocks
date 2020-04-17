/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl,BaseControl } = wp.components;

/**
 * External dependencies
 */
import DimensionsControl from '../dimensions-control/index';
import ColorControl from '../color-control';

/**
 * Attributes
 */
export const borderAttributes = {
    borderColor: {
        type: 'string',
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

/**
 * Block
 */
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

    const onChangeValue = (target, value, callback) => {
        const newValue = typeof value != 'undefined' ? value : '';
        if (typeof callback != 'undefined') {
            callback(newValue);
        }
        else {
            setAttributes({ [target]: newValue })
        }
    }

    return (
        <Fragment>
            <BaseControl className={"gx-settings-button background-image"}>
            <ColorControl 
                label={colorTitle}
                color={borderColor}
                onColorChange={value => onChangeValue('borderColor', value, onChangeBorderColor)}
                disableGradient
                disableGradientAboveBackground
            />
            </BaseControl>
            <BaseControl className={"gx-settings-button background-image"}>
            <SelectControl
                label={borderTypeLabel}
                className={borderTypeClassName}
                value={borderType}
                options={borderTypeOptions}
                onChange={value => onChangeValue('borderType', value, onChangeBorderType)}
            />
            </BaseControl>
            <BaseControl className={"gx-settings-button background-image"}>
            <DimensionsControl
                value={borderWidth}
                onChange={value => onChangeValue('borderWidth', value, onChangeBorderWidth)}
                target={borderWidthTarget}
            />
            </BaseControl>
            <BaseControl className={"gx-settings-button background-image"}>
            <DimensionsControl
                value={borderRadius}
                onChange={value => onChangeValue('borderRadius', value, onChangeBorderRadius)}
                target={borderRadiusTarget}
            />
            </BaseControl>
        </Fragment>
    )
}