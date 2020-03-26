/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { 
    withSelect,
    dispatch,
    select
} = wp.data;
const {
    SelectControl,
    RadioControl,
    RangeControl,
    TextControl,
    IconButton,
} = wp.components;
const {
    PanelColorSettings,
    MediaUpload,
} = wp.blockEditor;

/**
 * External dependencies
 */
import { BlockBorder } from '../../block-border/index';
import AlignmentControl from '../../alignment-control/index';
import MiniSizeControl from '../../mini-size-control';
import { PopoverControl } from '../../popover';
import { BoxShadow } from '../../box-shadow';
import Typography from '../../../components/typography/';
import iconsSettings from '../../../components/icons/icons-settings.js';
import {
    capitalize,
    isEmpty,
} from 'lodash';


/**
 * Styles
 */
import '../editor.scss';

/**
 * Default attributes
 */
export const imageSettingsAttributesTest = {
    imageSettingsTest: {
        type: 'string',
        default: '{"label":"Image Settings","size":"","alignment":"","captionType":"none","caption":"none","captionTypography":{"label":"Caption","font":"Default","options":{},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}},"sizeSettings":{"maxWidthUnit":"px","maxWidth":"","widthUnit":"px","width":""},"normal":{"opacity":"","backgroundColor":"","boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}},"hover":{"opacity":"","backgroundColor":"","boxShadow":"","borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}}}'
    }
}

/**
 * Block
 */
class ImageSettingsOptions extends Component {

    state = {
        selector: 'normal',
    }

    render() {
        const {
            imageData,
            imageSettings = this.props.attributes.imageSettings,
            onChange,
            target = '',
            setAttributes = this.props.setAttributes,
        } = this.props;

        const {
            selector,
        } = this.state;

        let value = typeof imageSettings === 'object' ? imageSettings : JSON.parse(imageSettings);

        const getSizeOptions = () => {
            let response = [];
            if (imageData) {
                let sizes = imageData.media_details.sizes;
                sizes = Object.entries(sizes).sort((a, b) => {
                    return a[1].width - b[1].width;
                })
                sizes.map(size => {
                    const name = capitalize(size[0]);
                    const val = size[1];
                    response.push({
                        label: `${name} - ${val.width}x${val.height}`,
                        value: val.source_url
                    })
                })
            }
            return response;
        }

        const getCaptionOptions = () => {
            let response = [
                { label: 'None', value: 'none' },
                { label: 'Custom Caption', value: 'custom' },
            ];
            if (imageData && !isEmpty(imageData.caption.rendered)) {
                const newCaption = { label: 'Attachment Caption', value: 'attachment' };
                response.splice(1, 0, newCaption)
            }
            return response;
        }

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
            styleTarget = `${styleTarget}${target.length > 0 ? `__$${target}${adition}` : ''} img`;
            return styleTarget;
        }

        /**
         * Creates a new object for being joined with the rest of the values on meta
         */
        const getNormalStylesObject = () => {
            const response = {
                label: value.label,
                general: {
                    'text-align': value.alignment ? value.alignment : '',
                    'max-width': value.sizeSettings.maxWidth ? value.sizeSettings.maxWidth + value.sizeSettings.maxWidthUnit : '',
                    'width': value.sizeSettings.width ? value.sizeSettings.width + value.sizeSettings.widthUnit : '',
                    'opacity': value.normal.opacity ? value.normal.opacity : '',
                    'background-color': value.normal.backgroundColor ? value.normal.backgroundColor : ''
                }
            }

            return response;
        }

        /**
         * Creates a new object for being joined with the rest of the values on meta
         */
        const getHoverStylesObject = () => {
            const response = {
                label: value.label,
                general: {
                    'opacity': value.hover.opacity ? value.hover.opacity : '',
                    'background-color': value.hover.backgroundColor ? value.hover.backgroundColor : ''
                }
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
        const metaValue = (type, target) => {
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
            onChange(JSON.stringify(value))
            saveMeta('normal');
            saveMeta('hover');
            new BackEndResponsiveStyles(getMeta());
        }

        const saveMeta = (type, target = '') => {
            dispatch('core/editor').editPost({
                meta: {
                    _gutenberg_extra_responsive_styles: metaValue(type, target),
                },
            });
        }

        return (
            <div className="gx-imagesettings-control">
                <SelectControl
                    label={__('Image Size', 'gutenberg-extra')}
                    value={value.size}
                    options={getSizeOptions()}
                    onChange={val => {
                        value.size = val;
                        saveAndSend()
                    }}
                />
                <AlignmentControl
                    value={value.alignment}
                    onChange={val => {
                        value.alignment = val;
                        saveAndSend()
                    }}
                />
                <SelectControl
                    label={__('Caption', 'gutenberg-extra')}
                    value={value.captionType}
                    options={getCaptionOptions()}
                    onChange={val => {
                        value.captionType = val;
                        val === 'attachment' ?
                            value.caption = imageData :
                            value.caption = '';
                        saveAndSend();
                    }}
                />
                {value.captionType === 'custom' &&
                    <TextControl
                        label={__('Custom Caption', 'gutenberg-extra')}
                        className="gx-custom-caption"
                        value={value.caption}
                        onChange={val => {
                            value.caption = val;
                            saveAndSend();
                        }}
                    />
                }
                {value.captionType != 'none' &&
                    <Typography
                        fontOptions={JSON.stringify(value.captionTypography)}
                        onChange={value => { onChangeValue('imageCaptionTypography', value, onChangeImageCaptionTypography) }}
                        target={target + ' figcaption'}   //!!!!!
                    />
                }
                <MiniSizeControl
                    label={__('Max Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.maxWidthUnit}
                    onChangeUnit={val => {
                        value.sizeSettings.maxWidthUnit = val;
                        saveAndSend();
                    }}
                    value={value.sizeSettings.maxWidth}
                    onChangeValue={val => {
                        value.sizeSettings.maxWidth = val;
                        saveAndSend();
                    }}
                />
                <MiniSizeControl
                    label={__('Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.widthUnit}
                    onChangeUnit={val => {
                        value.sizeSettings.widthUnit = val;
                        saveAndSend();
                    }}
                    value={value.sizeSettings.width}
                    onChangeValue={val => {
                        value.sizeSettings.width = val;
                        saveAndSend();
                    }}
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
                {console.log(value[selector].opacity)}
                <RangeControl
                    label={__('Opacity', 'gutenberg-extra')}
                    value={value[selector].opacity}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={val => {
                        value[selector].opacity = val;
                        saveAndSend()
                    }}
                />
                <PanelColorSettings
                    title={__('Background Colour Settings', 'gutenberg-extra')}
                    colorSettings={[
                        {
                            value: value[selector].backgroundColor,
                            onChange: (val => {
                                value[selector].backgroundColor = val;
                                saveAndSend()
                            }),
                            label: __('Background Colour', 'gutenberg-extra'),
                        },
                    ]}
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

export const ImageSettings = withSelect((select, ownProps) => {
    const {
        mediaID = ownProps.mediaID
    } = ownProps;
    const imageData = select('core').getMedia(mediaID);
    return {
        imageData
    }
})(ImageSettingsOptions)

const ImageUploadEditor = props => {
    const {
        imageData,
        mediaID,
        onSelect,
        imageSettings
    } = props;

    const value = JSON.parse(imageSettings);

    return (
        <MediaUpload
            onSelect={onSelect}
            allowedTypes="image"
            value={mediaID}
            render={({ open }) => (
                <IconButton
                    className={mediaID + ' gx-upload-button'}
                    showTooltip="true"
                    onClick={open}>
                    {!mediaID ?
                        iconsSettings.placeholderImage :
                        <figure>
                            <img 
                                src={value.size ? value.size : imageData.source_url}
                                alt={__('Upload Image', 'gutenberg-extra')}
                            />
                            {value.captionType !== 'none' &&
                                <figcaption>
                                    {value.caption}
                                </figcaption>
                            }
                        </figure>
                    }
                </IconButton>
            )}
        />
    )
}

export const ImageUpload = withSelect((select, ownProps) => {
    const {
        mediaID = ownProps.mediaID
    } = ownProps;
    const imageData = select('core').getMedia(mediaID);
    return {
        imageData
    }
})(ImageUploadEditor)