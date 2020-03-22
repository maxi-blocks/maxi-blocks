/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { PanelColorSettings } = wp.blockEditor;
const { Component } = wp.element;
const {
    SelectControl,
    RadioControl,
    RangeControl
} = wp.components;

/**
 * External dependencies
 */
import { BlockBorder } from '../block-border/index';
import AlignmentControl from '../alignment-control/index';
import MiniSizeControl from '../mini-size-control';
import { Popover } from '../popover';
import { BoxShadowOptions } from '../box-shadow';

/**
 * Styles
 */
import './editor.scss';

/**
 * Default attributes
 */
export const imageSettingsAttributes = {
    imageSize: {
        type: 'string',
        default: 'full'
    },
    imageAlignment: {
        type: 'string'
    },
    imageCaption: {
        type: 'string',
        default: 'none'
    },
    imageMaxWidthUnit: {
        type: 'string',
        default: 'px'
    },
    imageMaxWidth: {
        type: 'number'
    },
    imageWidthUnit: {
        type: 'string',
        default: 'px'
    },
    imageWidth: {
        type: 'number'
    },
    imageOpacity: {
        type: 'number'
    },
    imageBackgroundColor: {
        type: 'string',
        default: ''
    },
    imageBoxShadow: {
        type: 'string',
        default: '{"label": "Box shadow","shadowColor": "", "shadowHorizontal": "0", "shadowVertical": "0", "shadowBlur": "0", "shadowSpread": "0"}',
    },
    imageBorderColor: {
        type: 'string',
        default: ''
    },
    imageBorderType: {
        type: 'string',
        default: 'none'
    },
    imageBorderRadius: {
        type: 'string',
        default: '{"label":"Padding","unit":"px","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}}'
    },
    imageBorderWidth: {
        type: 'string',
        default: '{"label":"Margin","min":"none","unit":"px","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}}'
    },
    imageOpacityHover: {
        type: 'number'
    },
    imageBackgroundColorHover: {
        type: 'string',
        default: ''
    },
    imageBoxShadowHover: {
        type: 'string',
        default: '{"label": "Box shadow","shadowColor": "", "shadowHorizontal": "0", "shadowVertical": "0", "shadowBlur": "0", "shadowSpread": "0"}',
    },
    imageBorderColorHover: {
        type: 'string',
        default: ''
    },
    imageBorderTypeHover: {
        type: 'string',
        default: 'none'
    },
    imageBorderRadiusHover: {
        type: 'string',
        default: '{"label":"Padding","unit":"px","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}}'
    },
    imageBorderWidthHover: {
        type: 'string',
        default: '{"label":"Margin","min":"none","unit":"px","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}}'
    },
    imageSettings: {
        type: 'string',
        default: '{"label":"Image Settings","isize":"full","alignment":"","caption":"none","maxWidth":"","width":"","sizeSettings":{"maxWidthUnit":"px","maxWidth":"","widthUnit":"px","width":""},"normal":{"opacity":"","backgroundColor":"","boxShadow":"","borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}},"hover":{"opacity":"","backgroundColor":"","boxShadow":"","borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}}}',
    }
}

/**
 * Block
 */
export default class ImageSettings extends Component {

    state = {
        selector: 'normal',
    }

    render() {
        const {
            imageSize = this.props.attributes.imageSize,
            onChangeImageSize = undefined,
            imageAlignment = this.props.attributes.imageAlignment,
            onChangeImageAlignment = undefined,
            imageCaption = this.props.attributes.imageCaption,
            onChangeImageCaption = undefined,
            imageMaxWidthUnit = this.props.attributes.imageMaxWidthUnit,
            onChangeImageMaxWidthUnit = undefined,
            imageMaxWidth = this.props.attributes.imageMaxWidth,
            onChangeImageMaxWidth = undefined,
            imageWidthUnit = this.props.attributes.imageWidthUnit,
            onChangeImageWidthUnit = undefined,
            imageWidth = this.props.attributes.imageWidth,
            onChangeImageWidth = undefined,
            imageOpacity = this.props.attributes.imageOpacity,
            onChangeImageOpacity = undefined,
            imageBackgroundColor = this.props.attributes.imageBackgroundColor,
            onChangeImageBackgroundColor = undefined,
            imageBoxShadow = this.props.attributes.imageBoxShadow,
            onChangeImageBoxShadow = undefined,
            imageBorderColor = this.props.attributes.imageBorderColor,
            onChangeImageBorderColor = undefined,
            imageBorderType = this.props.attributes.imageBorderType,
            onChangeImageBorderType = undefined,
            imageBorderRadius = this.props.attributes.imageBorderRadius,
            onChangeImageBorderRadius = undefined,
            imageBorderWidth = this.props.attributes.imageBorderWidth,
            onChangeImageBorderWidth = undefined,
            imageOpacityHover = this.props.attributes.imageOpacityHover,
            onChangeImageOpacityHover = undefined,
            imageBackgroundColorHover = this.props.attributes.imageBackgroundColorHover,
            onChangeImageBackgroundColorHover = undefined,
            imageBoxShadowHover = this.props.attributes.imageBoxShadowHover,
            onChangeImageBoxShadowHover = undefined,
            imageBorderColorHover = this.props.attributes.imageBorderColorHover,
            onChangeImageBorderColorHover = undefined,
            imageBorderTypeHover = this.props.attributes.imageBorderTypeHover,
            onChangeImageBorderTypeHover = undefined,
            imageBorderRadiusHover = this.props.attributes.imageBorderRadiusHover,
            onChangeImageBorderRadiusHover = undefined,
            imageBorderWidthHover = this.props.attributes.imageBorderWidthHover,
            onChangeImageBorderWidthHover = undefined,
            target = '',
            setAttributes = props.setAttributes,
        } = this.props;

        const {
            selector,
        } = this.state;

        const onChangeValue = (target, value, callback) => {
            if (typeof callback != 'undefined' ) {
                callback(value);
            }
            else {
                setAttributes({[target]: value})
            }
        }

        return (
            <div className="gx-imagesettings-control">
                <SelectControl
                    label={__('Image Size', 'gutenberg-extra')}
                    value={imageSize}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Medium', value: '50%' },
                        { label: 'Small', value: '25%' },
                    ]}
                    onChange={value => onChangeValue('imageSize', value, onChangeImageSize)}
                />
                <AlignmentControl
                    value={imageAlignment}
                    onChange={value => onChangeValue('imageAlignment', value, onChangeImageAlignment)}
                />
                <SelectControl
                    label={__('Caption', 'gutenberg-extra')}
                    value={imageCaption}
                    options={[
                        { label: 'Big', value: '100%' },
                        { label: 'Medium', value: '50%' },
                        { label: 'Small', value: '25%' },
                    ]}
                    onChange={value => onChangeValue('imageCaption', value, onChangeImageCaption)}
                />
                <MiniSizeControl
                    label={__('Max Width', 'gutenberg-extra')}
                    unit={imageMaxWidthUnit}
                    onChangeUnit={value => onChangeValue('imageMaxWidthUnit', value, onChangeImageMaxWidthUnit)}
                    value={imageMaxWidth}
                    onChangeValue={value => onChangeValue('imageMaxWidth', value, onChangeImageMaxWidth)}
                />
                <MiniSizeControl
                    label={__('Width', 'gutenberg-extra')}
                    unit={imageWidthUnit}
                    onChangeUnit={value => onChangeValue('imageWidthUnit', value, onChangeImageWidthUnit)}
                    value={imageWidth}
                    onChangeValue={value => onChangeValue('imageWidth', value, onChangeImageWidth)}
                />
                <RadioControl
                    className="gx-imagesettings-selector-control"
                    selected={selector}
                    options={[
                        { label: 'Normal', value: 'normal' },
                        { label: 'Hover', value: 'hover' },
                    ]}
                    onChange={(selector) => { 
                        this.setState({ selector });
                    }}
                />
                <RangeControl
                    label={__('Opacity', 'gutenberg-extra')}
                    value={
                        selector != 'hover' ?
                            imageOpacity :
                            imageOpacityHover
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={
                        selector != 'hover' ?
                            value => onChangeValue('imageOpacity', value, onChangeImageOpacity) :
                            value => onChangeValue('imageOpacityHover', value, onChangeImageOpacityHover)
                    }
                />
                <PanelColorSettings
                    title={__('Background Colour Settings', 'gutenberg-extra')}
                    colorSettings={[
                        {
                            value: 
                                selector != 'hover' ?
                                    imageBackgroundColor :
                                    imageBackgroundColorHover,
                            onChange: 
                                selector != 'hover' ?
                                    value => onChangeValue('imageBackgroundColor', value, onChangeImageBackgroundColor) :
                                    value => onChangeValue('imageBackgroundColorHover', value, onChangeImageBackgroundColorHover),
                            label: __('Background Colour', 'gutenberg-extra'),
                        },
                    ]}
                />
                <Popover 
                    label={__('Box shadow', 'gutenberg-extra')}
                    content={
                        <BoxShadowOptions 
                            boxShadowOptions={
                                selector != 'hover' ?
                                    imageBoxShadow :
                                    imageBoxShadowHover
                            }
                            onChange={
                                selector != 'hover' ?
                                    value => onChangeValue('imageBoxShadow', value, onChangeImageBoxShadow):
                                    value => onChangeValue('imageBoxShadowHover', value, onChangeImageBoxShadowHover)
                                }
                            target={
                                selector != 'hover' ?
                                    target : 
                                    `${target}:hover`
                            }
                        />
                    }
                />
                <BlockBorder
                    borderColor={
                        selector != 'hover' ?
                            imageBorderColor :
                            imageBorderColorHover
                    }
                    onChangeBorderColor={
                        selector != 'hover' ?
                            value => onChangeValue('imageBorderColor', value, onChangeImageBorderColor) :
                            value => onChangeValue('imageBorderColorHover', value, onChangeImageBorderColorHover)
                    }
                    borderType={
                        selector != 'hover' ?
                            imageBorderType :
                            imageBorderTypeHover
                    }
                    onChangeBorderType={
                        selector != 'hover' ?
                            value => onChangeValue('imageBorderType', value, onChangeImageBorderType) :
                            value => onChangeValue('imageBorderTypeHover', value, onChangeImageBorderTypeHover)
                    }
                    borderRadius={
                        selector != 'hover' ?
                            imageBorderRadius :
                            imageBorderRadiusHover
                    }
                    onChangeBorderRadius={
                        selector != 'hover' ?
                            value => onChangeValue('imageBorderRadius', value, onChangeImageBorderRadius) :
                            value => onChangeValue('imageBorderRadiusHover', value, onChangeImageBorderRadiusHover)
                    }
                    borderWidth={
                        selector != 'hover' ?
                            imageBorderWidth :
                            imageBorderWidthHover
                    }
                    onChangeBorderWidth={
                        selector != 'hover' ?
                            value => onChangeValue('imageBorderWidth', value, onChangeImageBorderWidth) :
                            value => onChangeValue('imageBorderWidthHover', value, onChangeImageBorderWidthHover)
                    }
                    borderRadiusTarget={
                        selector != 'hover' ?
                            target : 
                            `${target}:hover`
                    }
                    borderWidthTarget={
                        selector != 'hover' ?
                            target : 
                            `${target}:hover`
                    }
                />
            </div>
        )
    }
}
