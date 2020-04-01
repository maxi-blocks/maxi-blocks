const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    PanelColorSettings
} = wp.blockEditor;

import { RadioControl, SelectControl } from '@wordpress/components';
import DimensionsControl from '../../dimensions-control/index';
import { dimensionsControlAttributesPadding } from '../../dimensions-control/attributes';
import { dimensionsControlAttributesMargin } from '../../dimensions-control/attributes';
import { BoxShadowOptions, BoxShadow } from '../../box-shadow/index';

export const buttonStyleAttributes = {
    buttonColor: {
        type: 'string',
        default: "",
    },
    buttonBgColor: {
        type: 'string',
        default: "",
    },
    buttonHoverColor: {
        type: 'string',
        default: "",
    },
    buttonHoverBgColor: {
        type: 'string',
        default: "",
    },
    normalHoverOption: {
        type: 'string',
        default: 'normal',
    },
    buttonBorderColor: {
        type: 'string',
        default: "",
    },
    buttonHoverBorderColor: {
        type: 'string',
        default: "",
    },
    buttonPadding: {
        type: 'string',
        default: '{"label":"Padding","unit":"px","max":"1000","desktop":{"padding-top":10px,"padding-right":10px,"padding-bottom":10px,"padding-left":10px,"sync":true},"tablet":{"padding-top":10px,"padding-right":10px,"padding-bottom":10px,"padding-left":10px,"sync":true},"mobile":{"padding-top":10px,"padding-right":10px,"padding-bottom":10px,"padding-left":10px,"sync":true}}'
    },
    buttonMargin: {
        type: 'string',
        default: '{"label":"Margin","unit":"px","max":"1000","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}}'
    },
    buttonHoverPadding: {
        type: 'string',
        default: '{"label":"Padding","unit":"px","max":"1000","desktop":{"padding-top":10px,"padding-right":10px,"padding-bottom":10px,"padding-left":10px,"sync":true},"tablet":{"padding-top":10px,"padding-right":10px,"padding-bottom":10px,"padding-left":10px,"sync":true},"mobile":{"padding-top":10px,"padding-right":10px,"padding-bottom":10px,"padding-left":10px,"sync":true}}'
    },
    buttonHoverMargin: {
        type: 'string',
        default: '{"label":"Margin","unit":"px","max":"1000","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}}'
    },
    buttonBorderType: {
        type: 'string',
        default: 'none',
    },
    buttonBorderRadius: {
        type: 'string',
        default: '{"label":"Border radius","unit":"px","max":"1000","desktop":{"button-top-left-radius":0,"button-top-right-radius":0,"button-bottom-right-radius":0,"button-bottom-left-radius":0,"sync":true},"tablet":{"button-top-left-radius":0,"button-top-right-radius":0,"button-bottom-right-radius":0,"button-bottom-left-radius":0,"sync":true},"mobile":{"button-top-left-radius":0,"button-top-right-radius":0,"button-bottom-right-radius":0,"button-bottom-left-radius":0,"sync":true}}'
    },
    buttonBorderWidth: {
        type: 'string',
        default: '{"label":"Border width","unit":"px","max":"1000","desktop":{"button-top-width":0,"button-right-width":0,"button-bottom-width":0,"button-left-width":0,"sync":true},"tablet":{"button-top-width":0,"button-right-width":0,"button-bottom-width":0,"button-left-width":0,"sync":true},"mobile":{"button-top-width":0,"button-right-width":0,"button-bottom-width":0,"button-left-width":0,"sync":true}}'
    },
    boxShadowOptions: {
        type: 'string',
        default: '{"shadowColor": "inherit", "shadowHorizontal": "0", "shadowVertical": "0", "shadowBlur": "0", "shadowSpread": "0"}',
    }
}

export const ButtonStyles = (props) => {
    const {
        buttonTextColorLabel = __('Text Colour', 'gutenberg-extra'),
        buttonColor = props.attributes.buttonColor,
        buttonColorLabel = __('Border Colour', 'gutenberg-extra'),
        buttonBorderTypeLabel = __("Border Type", 'gutenberg-extra'),
        buttonBgColorLabel = __('Background Colour', 'gutenberg-extra'),
        buttonBorderTypeClassName = "gx-button--buttonBorder-type",
        buttonBorderType = props.attributes.buttonBorderType,
        buttonBorderTypeOptions = [
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
        buttonBorderRadius = props.attributes.buttonBorderRadius,
        buttonBorderWidth = props.attributes.buttonBorderWidth,
        buttonBorderRadiusTarget = '',
        buttonBorderWidthTarget = '',
        buttonBgColor,
        buttonMargin,
        buttonPadding,
        buttonHoverColor,
        buttonHoverBgColor,
        buttonBorderColor,
        buttonHoverBorderColor,
        setAttributes,
        attributes: {
            normalHoverOption,
        },
        boxShadowOptions
    } = props;

    const onSelectState = (value) => setAttributes({ normalHoverOption: value });

    return (
        <Fragment>
            <RadioControl
                className='gx-normal-hover-setting'
                selected={normalHoverOption}
                options={[
                    { label: __('Normal', 'gutenberg-extra'), value: 'normal' },
                    { label: __('Hover', 'gutenberg-extra'), value: 'hover' },
                ]}
                onChange={value => setAttributes({ normalHoverOption: value })}
            />
            {normalHoverOption === 'normal' &&
                <Fragment>
                    <PanelColorSettings
                        className='gx-normal-hover-setting-normal'
                        colorSettings={[
                            {
                                value: buttonColor,
                                onChange: (value) => setAttributes({ buttonColor: value }),
                                label: buttonTextColorLabel,
                            },
                        ]}
                    />
                    <PanelColorSettings
                        className='gx-normal-hover-setting-normal'
                        colorSettings={[
                            {
                                value: buttonBgColor,
                                onChange: (value) => setAttributes({ buttonBgColor: value }),
                                label: buttonBgColorLabel,
                            },
                        ]}
                    />
                    <PanelColorSettings
                        className='gx-normal-hover-setting-normal'
                        colorSettings={[
                            {
                                value: buttonBorderColor,
                                onChange: (value) => setAttributes({ buttonBorderColor: value }),
                                label: buttonColorLabel,
                            },
                        ]}
                    />
                    {/* <BoxShadowOptions
                        boxShadowOptions={boxShadowOptions}
                        onChangeOptions={value => { setAttributes({ boxShadowOptions: value }); }}
                    /> */}
                </Fragment>
            }
            {normalHoverOption === 'hover' &&
                <Fragment>
                    <PanelColorSettings
                        className='gx-normal-hover-setting-hover'
                        colorSettings={[
                            {
                                value: buttonHoverColor,
                                onChange: (value) => setAttributes({ buttonHoverColor: value }),
                                label: buttonTextColorLabel,
                            },
                        ]}
                    />
                    <PanelColorSettings
                        className='gx-normal-hover-setting-hover'
                        colorSettings={[
                            {
                                value: buttonHoverBgColor,
                                onChange: (value) => setAttributes({ buttonHoverBgColor: value }),
                                label: buttonBgColorLabel,
                            },
                        ]}
                    />
                    <PanelColorSettings
                        className='gx-normal-hover-setting-hover'
                        colorSettings={[
                            {
                                value: buttonHoverBorderColor,
                                onChange: (value) => setAttributes({ buttonHoverBorderColor: value }),
                                label: buttonColorLabel,
                            },
                        ]}
                    />
                </Fragment>
            }
            <SelectControl
                label={buttonBorderTypeLabel}
                className={buttonBorderTypeClassName}
                value={buttonBorderType}
                options={buttonBorderTypeOptions}
                onChange={(value) => setAttributes({ buttonBorderType: value })}
            />
            <DimensionsControl
                value={buttonBorderRadius}
                onChange={value => setAttributes({ buttonBorderRadius: value })}
                target={buttonBorderRadiusTarget}
            />
            <DimensionsControl
                value={buttonBorderWidth}
                onChange={value => setAttributes({ buttonBorderWidth: value })}
                target={buttonBorderWidthTarget}
            />
        </Fragment>

    )
}