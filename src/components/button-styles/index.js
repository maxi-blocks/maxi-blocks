/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { 
    Component,
    Fragment
} = wp.element;
const {
    RadioControl,
    Button
} = wp.components;
const {
    dispatch,
    select
} = wp.data;

/**
 * External dependencies
 */
import AlignmentControl from '../alignment-control/';
import SizeControlTest from '../size-control/test/';
import ColorControl from '../color-control/';
import { PopoverControl } from '../popover/';
import { BoxShadow } from '../box-shadow/index';
import Typography from '../typography/';
import { BlockBorder } from '../block-border/';
import DimensionsControl from '../dimensions-control/index';
import LinkedButton from '../linked-button';
import {
    isEmpty,
    isNil,
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Attributes
 */
export const buttonStyleAttributes = {
    buttonStyles: {
        type: 'string',
        default: '{"label":"Button Styles","buttonText": "","linkOptions":{},"alignment":"","size":{"label":"Size","general":{"max-widthUnit":"px","max-width":"","widthUnit":"px","width":"","min-widthUnit":"px","min-width":"","max-heightUnit":"px","max-height":"","heightUnit":"px","height":"","minHeightUnit":"px","minHeight":""}},"normal":{"color":"","backgroundColor":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"typography":{"label":"Typography","font":"Default","options":{},"general":{"color":""},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}},"borderSettings":{"borderColor":"","borderType":"","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}},"padding":{"label":"Padding","unit":"px","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}},"margin":{"label":"Margin","min":"none","unit":"px","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}},"opacity":""},"hover":{"color":"","backgroundColor":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"typography":{"label":"Typography","font":"Default","options":{},"general":{"color":""},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}},"borderSettings":{"borderColor":"","borderType":"","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}},"padding":{"label":"Padding","unit":"px","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}},"margin":{"label":"Margin","min":"none","unit":"px","desktop":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"tablet":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true},"mobile":{"margin-top":0,"margin-right":0,"margin-bottom":0,"margin-left":0,"sync":true}},"opacity":""}}'
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
            className = 'gx-buttonstyles-control',
            buttonSettings,
            onChange,
            target = 'gx-buttoneditor-button'
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
            if (!isEmpty(value.normal.color)) {
                response.general['color'] = value.normal.color;
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
            if (!isEmpty(value.hover.color)) {
                response.general['color'] = value.hover.color;
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
            saveMeta('normal');
            saveMeta('hover');
            new BackEndResponsiveStyles(getMeta());
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
            <div className={className}>
                <AlignmentControl
                    value={value.alignment}
                    onChange={val => {
                        value.alignment = val;
                        saveAndSend()
                    }}
                    disableJustify
                />
                <SizeControlTest
                    sizeSettings={value.size}
                    onChange={val => {
                        value.size = val;
                        saveAndSend();
                    }}
                    target={target}
                />
                <hr style={{ borderTop: '1px solid #ddd' }} />
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
                    onColorChange={val => {
                        value[selector].color = val;
                        saveAndSend();
                    }}
                    disableGradient
                />
                <ColorControl
                    label={__('Background Colour', 'gutenberg-extra')}
                    color={value[selector].backgroundColor}
                    onColorChange={val => {
                        value[selector].backgroundColor = val;
                        saveAndSend();
                    }}
                    disableGradient
                />
                <PopoverControl
                    label={__('Box shadow', 'gutenberg-extra')}
                    popovers={[
                        {
                            content: (
                                <BoxShadow
                                    boxShadowOptions={value[selector].boxShadow}
                                    onChange={val => {
                                        value[selector].boxShadow = JSON.parse(val);
                                        saveAndSend()
                                    }}
                                    target={
                                        selector != 'hover' ?
                                            `${target}` :
                                            `${target}:hover`
                                    }
                                />
                            )
                        }
                    ]}
                />
                <Typography
                    fontOptions={value[selector].typography}
                    onChange={val => {
                        value[selector].typography = val;
                        saveAndSend();
                    }}
                    target={target}
                />
                <BlockBorder
                    borderColor={value[selector].borderSettings.borderColor}
                    onChangeBorderColor={val => {
                        value[selector].borderSettings.borderColor = val;
                        saveAndSend();
                    }}
                    borderType={value[selector].borderSettings.borderType}
                    onChangeBorderType={val => {
                        value[selector].borderSettings.borderType = val;
                        saveAndSend();
                    }}
                    borderRadius={value[selector].borderSettings.borderRadius}
                    onChangeBorderRadius={val => {
                        value[selector].borderSettings.borderRadius = val;
                        saveAndSend();
                    }}
                    borderWidth={value[selector].borderSettings.borderWidth}
                    onChangeBorderWidth={val => {
                        value[selector].borderSettings.borderWidth = val;
                        saveAndSend();
                    }}
                    borderRadiusTarget={target}
                    borderWidthTarget={target}
                />
                <DimensionsControl
                    value={value[selector].padding}
                    onChange={val => {
                        value[selector].padding = val;
                        saveAndSend()
                    }}
                    target={target}
                />
                <DimensionsControl
                    value={value[selector].margin}
                    onChange={val => {
                        value[selector].margin = val;
                        saveAndSend()
                    }}
                    target={target}
                />
            </div>
        )
    }
}

/**
 * Backend editor
 */
export const ButtonEditor = props => {
    const {
        className = 'gx-buttoneditor-button',
        buttonSettings,
        onChange,
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

    return (
        <LinkedButton
            className={className}
            placeholder={__('Read more text...', 'gutenberg-extra')}
            buttonText={value.buttonText}
            onTextChange={val => {
                value.buttonText = val;
                onChange(JSON.stringify(value));
            }}
            externalLink={value.linkOptions}
            onLinkChange={val => {
                value.linkOptions = val;
                onChange(JSON.stringify(value));
            }}
        />
    )
}

/**
 * FrontEnd
 */
export const ButtonSaver = props => {
    const {
        className = 'gx-buttoneditor-button',
        buttonSettings,
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

    return (
        <Fragment>
            {value.buttonText &&
                <Button
                    className={className}
                    href={value.linkOptions.url}
                >
                    {value.buttonText}
                </Button>
            }
        </Fragment>
    )
}