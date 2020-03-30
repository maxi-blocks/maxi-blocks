/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Component } = wp.element;
const {
    RadioControl,
    SelectControl
} = wp.components;

/**
 * External dependencies
 */
import { BlockBorder } from '../../block-border/';
import DimensionsControl from '../../dimensions-control/index';
import ColorControl from '../../color-control/';
import { PopoverControl } from '../../popover/';
import { BoxShadow } from '../../box-shadow/index';

/**
 * Styles
 */
import './editor.scss';

/**
 * Attributes
 */
export const buttonStyleAttributesTest = {
    buttonStylesTest: {
        type: 'string',
        default: '{"label":"Button Styles","alignment":"","borderSettings":{"borderColor":"","borderType":"","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}},"normal":{"color":"","opacity":"","backgroundColor":"","padding":"","margin":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"}},"hover":{"color":"","opacity":"","backgroundColor":"","padding":"","margin":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"}}}'
    }
}

/**
 * Block
 */
export class ButtonStyles extends Component {

    state = {
        selector: 'normal',
    }

    render() {
        const {
            buttonSettings,
            onChange,
            target = ''
        } = this.props;

        const {
            selector
        } = this.state;

        const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

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
        const getTarget = (adition = '') => {
            let styleTarget = select('core/block-editor').getBlockAttributes(select('core/block-editor').getSelectedBlockClientId()).uniqueID;
            styleTarget = `${styleTarget}${target.length > 0 || adition.length > 0 ? `__$${target}${adition}` : ''}`;
            return styleTarget;
        }

        /**
         * Creates a new object for being joined with the rest of the values on meta
         */
        const getNormalStylesObject = () => {
            const response = {
                label: value.label,
                general: {}
            }
            if (!isNil(value.alignment)) {
                switch (value.alignment) {
                    case 'left':
                        response.general['margin-right'] = 'auto';
                        break;
                    case 'center':
                    case 'justify':
                        response.general['margin-right'] = 'auto';
                        response.general['margin-left'] = 'auto';
                        break;
                    case 'right':
                        response.general['margin-left'] = 'auto';
                        break;
                }
            }
            if (isNumber(value.sizeSettings.maxWidth)) {
                response.general['max-width'] = value.sizeSettings.maxWidth + value.sizeSettings.maxWidthUnit;
            }
            if (isNumber(value.sizeSettings.width)) {
                response.general['width'] = value.sizeSettings.width + value.sizeSettings.widthUnit;
            }
            if (isNumber(value.normal.opacity)) {
                response.general['opacity'] = value.normal.opacity;
            }
            if (!isEmpty(value.normal.backgroundColor)) {
                response.general['background-color'] = value.normal.backgroundColor;
            }
            if (!isEmpty(value.normal.borderSettings.borderColor)) {
                response.general['border-color'] = value.normal.borderSettings.borderColor;
            }
            if (!isEmpty(value.normal.borderSettings.borderType)) {
                response.general['border-style'] = value.normal.borderSettings.borderType;
            }
            return response;
        }

        /**
         * Creates a new object for being joined with the rest of the values on meta
         */
        const getHoverStylesObject = () => {
            const response = {
                label: value.label,
                general: {}
            }
            if (isNumber(value.hover.opacity)) {
                response.general['opacity'] = value.hover.opacity;
            }
            if (!isEmpty(value.hover.backgroundColor)) {
                response.general['background-color'] = value.hover.backgroundColor;
            }
            if (!isEmpty(value.hover.borderSettings.borderColor)) {
                response.general['border-color'] = value.hover.borderSettings.borderColor;
            }
            if (!isEmpty(value.hover.borderSettings.borderType)) {
                response.general['border-style'] = value.hover.borderSettings.borderType;
            }
            return response;
        }

		/**
		* Creates a new object that
		*
		* @param {string} target	Block attribute: uniqueID
		* @param {obj} meta		Old and saved metadate
		* @param {obj} value	New values to add
		*/
        const metaValue = (type) => {
            const meta = getMeta();
            let styleTarget = '';
            switch (type) {
                case 'normal':
                    styleTarget = getTarget();
                    break;
                case 'hover':
                    styleTarget = getTarget(':hover');
                    break;
            }
            let obj = {};
            switch (type) {
                case 'normal':
                    obj = getNormalStylesObject();
                    break;
                case 'hover':
                    obj = getHoverStylesObject();
                    break;
            }
            const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, obj);
            const response = JSON.stringify(responsiveStyle.getNewValue);
            return response;
        }

		/**
		* Saves and send the data. Also refresh the styles on Editor
		*/
        const saveAndSend = () => {
            save();
            // saveMeta('normal');
            // saveMeta('hover');
            // new BackEndResponsiveStyles(getMeta());
        }

        const save = () => {
            onChange(JSON.stringify(value));
        }

        const saveMeta = (type) => {
            dispatch('core/editor').editPost({
                meta: {
                    _gutenberg_extra_responsive_styles: metaValue(type),
                },
            });
        }

        return (
            <div className="gx-buttonstyles-control">
                <RadioControl
                    className="gx-buttonstyles-selector-control"
                    selected={selector}
                    options={[
                        { label: 'Normal', value: 'normal' },
                        { label: 'Hover', value: 'hover' },
                    ]}
                    onChange={selector => {
                        this.setState({ selector });
                    }}
                />
                <ColorControl
                    label={__('Text Colour', 'gutenberg-extra')}
                    color={value[selector].color}
                    onChange={val => {
                        value[selector].color = val;
                        saveAndSend();
                    }}
                />
                <ColorControl
                    label={__('Background Colour', 'gutenberg-extra')}
                    color={value[selector].backgroundColor}
                    onChange={val => {
                        value[selector].backgroundColor = val;
                        saveAndSend();
                    }}
                />
                <PopoverControl
                    label={__('Box shadow', 'gutenberg-extra')}
                    content={
                        <BoxShadow
                            boxShadowOptions={value[selector].boxShadow}
                            onChange={val => {
                                value[selector].boxShadow = JSON.parse(val);
                                saveAndSend()
                            }}
                            target={
                                selector != 'hover' ?
                                    `${target} img` :
                                    `${target} img:hover`
                            }
                        />
                    }
                />
                <hr style={{ borderTop: '1px solid #ddd' }} />
                <BlockBorder
                    borderColor={value.borderSettings.borderColor}
                    onChangeBorderColor={val => {
                        value.borderSettings.borderColor = val;
                        saveAndSend();
                    }}
                    borderType={value.borderSettings.borderType}
                    onChangeBorderType={val => {
                        value.borderSettings.borderType = val;
                        saveAndSend();
                    }}
                    borderRadius={value.borderSettings.borderRadius}
                    onChangeBorderRadius={val => {
                        value.borderSettings.borderRadius = val;
                        saveAndSend();
                    }}
                    borderWidth={value.borderSettings.borderWidth}
                    onChangeBorderWidth={val => {
                        value.borderSettings.borderWidth = val;
                        saveAndSend();
                    }}
                    borderRadiusTarget={target}
                    borderWidthTarget={target}
                />
            </div>
        )
    }
}