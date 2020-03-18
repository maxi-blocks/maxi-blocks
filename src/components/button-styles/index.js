const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    PanelColorSettings
} = wp.blockEditor;

import { RadioControl } from '@wordpress/components';
import DimensionsControl from '../dimensions-control/index';
import { dimensionsControlAttributesPadding } from '../dimensions-control/attributes';
import { dimensionsControlAttributesMargin } from '../dimensions-control/attributes';

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
    }
}

export const ButtonStyles = ( props ) => {
    const {
           className,
           attributes: {
               buttonColor,
               buttonBgColor,
               normalHoverOption,
               buttonMargin,
               buttonPadding,
               buttonHoverColor,
               buttonHoverBgColor,
           },
           setAttributes,
       } = props;


    const onSelectState = (value) => setAttributes({ normalHoverOption: value })

    return (
        <Fragment>
        <RadioControl
            className = 'gx-normal-hover-setting'
            selected={ normalHoverOption }
            options={ [
                { label: __('Normal', 'gutenberg-extra' ), value: 'normal' },
                { label: __('Hover', 'gutenberg-extra' ), value: 'hover' },
            ] }
            onChange={value => setAttributes({ normalHoverOption: value })}
        />
        { normalHoverOption === 'normal' &&
            <PanelColorSettings
                title={__('Button Settings', 'gutenberg-extra' )}
                className = 'gx-normal-hover-setting-normal'
                colorSettings={[
                    {
                        value: buttonColor,
                        onChange: (value) => setAttributes({ buttonColor: value }),
                        label: __('Text Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
        }
        { normalHoverOption === 'normal' &&
            <PanelColorSettings
                title={__('Button Settings', 'gutenberg-extra' )}
                className = 'gx-normal-hover-setting-normal'
                colorSettings={[
                    {
                        value: buttonBgColor,
                        onChange: (value) => setAttributes({ buttonBgColor: value }),
                        label: __('Background Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
        }
     {/*<DimensionsControl
            value={buttonPadding}
            onChange={value => setAttributes({ buttonPadding: value })}
            target='.gx-image-box-read-more-text'
        />
        <DimensionsControl
            value={buttonMargin}
            onChange={value => setAttributes({ buttonMargin: value })}
            target='.gx-image-box-read-more-text'
        />
    */}

        { normalHoverOption === 'hover' &&
            <PanelColorSettings
                title={__('Button Hover Settings', 'gutenberg-extra' )}
                className = 'gx-normal-hover-setting-hover'
                colorSettings={[
                    {
                        value: buttonHoverColor,
                        onChange: (value) => setAttributes({ buttonHoverColor: value }),
                        label: __('Text Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
        }
        { normalHoverOption === 'hover' &&
            <PanelColorSettings
                title={__('Button Hover Settings', 'gutenberg-extra' )}
                className = 'gx-normal-hover-setting-hover'
                colorSettings={[
                    {
                        value: buttonHoverBgColor,
                        onChange: (value) => setAttributes({ buttonHoverBgColor: value }),
                        label: __('Background Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
        }
        </Fragment>

    )
}