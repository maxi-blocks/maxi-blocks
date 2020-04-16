/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const {
    Component,
    Fragment
} = wp.element;
const {
    withSelect,
    dispatch,
    select
} = wp.data;
const {
    SelectControl,
    RangeControl,
    TextControl,
    IconButton,
    Spinner,
} = wp.components;
const { MediaUpload } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { BlockBorder } from '../block-border';
import AlignmentControl from '../alignment-control';
import MiniSizeControl from '../mini-size-control';
import { PopoverControl } from '../popover';
import { BoxShadow } from '../box-shadow';
import Typography from '../typography';
import iconsSettings from '../icons/icons-settings.js';
import ColorControl from '../color-control';
import ImageCrop from '../image-crop';
import NormalHover from '../normal-hover';

/**
 * External dependencies
 */
import {
    capitalize,
    isEmpty,
    isNil,
    isNumber,
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Default attributes
 */
export const imageSettingsAttributes = {
    imageSettings: {
        type: 'string',
        default: '{"label":"Image Settings","size":"","imageSize":{"options":{},"widthUnit":"%","width":"","heightUnit":"%","height":""},"alt":"","alignment":"","captionType":"none","caption":"none","captionTypography":{"label":"Typography","font":"Roboto","options":{"100":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","300":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","400":"http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","500":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","700":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","900":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","100italic":"http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","italic":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":26,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}},"sizeSettings":{"maxWidthUnit":"%","maxWidth":"","widthUnit":"%","width":""},"normal":{"opacity":"","backgroundColor":"","backgroundGradient":"","backgroundGradientAboveBackground":false,"boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"borderSettings":{"borderColor":"","borderType":"solid","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}},"hover":{"opacity":"","backgroundColor":"","backgroundGradient":"","backgroundGradientAboveBackground":false,"boxShadow":{"label":"Box Shadow","shadowColor":"","shadowHorizontal":"0","shadowVertical":"0","shadowBlur":"0","shadowSpread":"0"},"borderSettings":{"borderColor":"","borderType":"solid","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}}}'
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
            mediaID,
            className = "gx-imagesettings-control",
            imageData,
            imageSettings = this.props.attributes.imageSettings,
            onChange,
            target = '',
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
                        value: size[0]
                    })
                })
            }
            response.push({
                label: 'Custom', value: 'custom'
            });
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
                response.general['max-widthUnit'] = value.sizeSettings.maxWidthUnit;
            }
            if (isNumber(value.sizeSettings.maxWidth)) {
                response.general['max-width'] = value.sizeSettings.maxWidth;
            }
            if (isNumber(value.sizeSettings.width)) {
                response.general['widthUnit'] = value.sizeSettings.widthUnit;
            }
            if (isNumber(value.sizeSettings.width)) {
                response.general['width'] = value.sizeSettings.width;
            }
            if (isNumber(value.normal.opacity)) {
                response.general['opacity'] = value.normal.opacity;
            }
            if (!isEmpty(value.normal.backgroundColor)) {
                response.general['background-color'] = value.normal.backgroundColor;
            }
            if (!isEmpty(value.normal.backgroundGradient)) {
                response.general['background'] = value.normal.backgroundGradient;
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
            if (!isEmpty(value.hover.backgroundGradient)) {
                response.general['background'] = value.hover.backgroundGradient;
            }
            if (!isEmpty(value.hover.borderSettings.borderType)) {
                response.general['border-style'] = value.hover.borderSettings.borderType;
            }
            return response;
        }

        /**
         * Creates a new object for being joined with the rest of the values on meta
         */
        const getImgStylesObject = () => {
            const response = {
                label: value.label,
                general: {}
            }
            if (isNumber(value.imageSize.width)) {
                response.general['width'] = value.imageSize.width + value.imageSize.widthUnit;
            }
            if (isNumber(value.imageSize.height)) {
                response.general['height'] = value.imageSize.height + value.imageSize.heightUnit;
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
                case 'img':
                    styleTarget = getTarget(' img');
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
                case 'img':
                    obj = getImgStylesObject();
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
            saveMeta('img');
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

        const getValues = () => {
            value.alt = imageData.alt_text;
            value.src = imageData.source_url;
            value.imageSize.options = imageData.media_details.sizes;
            save();
        }

        imageData && (
            value.alt != imageData.alt_text ||
            value.imageSize.options.full != imageData.source_url
        ) ?
            getValues() :
            null;

        return (
            <div className={className}>
                <SelectControl
                    label={__('Image Size', 'gutenberg-extra')}
                    value={value.imageSize.options[value.size] || value.size == 'custom' ? value.size : 'full'}
                    options={getSizeOptions()}
                    onChange={val => {
                        value.size = val;
                        saveAndSend()
                    }}
                />
                {value.size === 'custom' &&
                    <ImageCrop
                        mediaID={mediaID}
                        cropOptions={value.imageSize.cropOptions ? value.imageSize.cropOptions : {}}
                        onChange={cropOptions => {
                            value.imageSize.cropOptions = cropOptions;
                            saveAndSend();
                        }}
                    />
                }
                <AlignmentControl
                    value={value.alignment}
                    onChange={val => {
                        value.alignment = val;
                        saveAndSend()
                    }}
                    disableJustify
                />
                <SelectControl
                    label={__('Caption', 'gutenberg-extra')}
                    value={value.captionType}
                    options={getCaptionOptions()}
                    onChange={val => {
                        value.captionType = val;
                        val === 'attachment' ?
                            value.caption = imageData.caption.raw :
                            value.caption = '';
                        saveAndSend();
                    }}
                />
                {value.captionType === 'custom' &&
                    <TextControl
                        label={__('Custom Caption', 'gutenberg-extra')}
                        className="custom-caption"
                        value={value.caption}
                        onChange={val => {
                            value.caption = val;
                            saveAndSend();
                        }}
                    />
                }
                {value.captionType != 'none' &&
                    <Typography
                        fontOptions={value.captionTypography}
                        onChange={val => {
                            value.captionTypography = val;
                            saveAndSend();
                        }}
                        target={target + ' figcaption'}
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
                <NormalHover
                    selector={selector}
                    onChange={selector => {
                        this.setState({ selector });
                    }}
                />
                <RangeControl
                    label={__('Opacity', 'gutenberg-extra')}
                    value={value[selector].opacity}
                    min={0}
                    max={100}
                    onChange={val => {
                        value[selector].opacity = val;
                        saveAndSend()
                    }}
                />
                <ColorControl
                    label={__('Background Colour', 'gutenberg-extra')}
                    color={value[selector].backgroundColor}
                    onColorChange={val => {
                        value[selector].backgroundColor = val;
                        saveAndSend()
                    }}
                    gradient={value[selector].backgroundGradient}
                    onGradientChange={val => {
                        value[selector].backgroundGradient = val;
                        saveAndSend()
                    }}
                    gradientAboveBackground={value[selector].gradientAboveBackground}
                    onGradientAboveBackgroundChange={val => {
                        value[selector].gradientAboveBackground = val;
                        saveAndSend()
                    }}
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
                                            `${target} img` :
                                            `${target} img:hover`
                                    }
                                />
                            )
                        }
                    ]}
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

/**
 * Frontend block
 */
export const Image = props => {
    const {
        className = '',
        mediaID,
        imageSettings
    } = props;

    const value = typeof imageSettings === 'object' ? imageSettings : JSON.parse(imageSettings);
    const size = value.size;

    const getImage = () => {
        if (size === 'custom' && !isNil(value.imageSize.cropOptions))
            return value.imageSize.cropOptions.image;
        if (value.imageSize.options[size])
            return value.imageSize.options[size];
        else
            return value.imageSize.options.full;
    }

    const image = getImage();
    const src = image.source_url;
    const width = image.width;
    const height = image.height;

    return (
        <figure
            className={className}
        >
            <img
                className={"wp-image-" + mediaID}
                src={src}
                alt={value.alt}
                width={!isNil(width) ? width : ''}
                height={!isNil(height) ? height : ''}
            />
            {value.captionType !== 'none' &&
                <figcaption>
                    {value.caption}
                </figcaption>
            }
        </figure>
    )
}

/**
 * Backend upload block
 */
export class ImageUpload extends Component {

    componentDidUpdate() {
        const value = typeof this.props.imageSettings === 'object' ? this.props.imageSettings : JSON.parse(this.props.imageSettings);

        if(!isNil(value.imageSize.cropOptions) && this.state.url != value.imageSize.cropOptions.image.source_url)
            this.setState({
                url: value.imageSize.cropOptions.image.source_url
            })
    }

    state = {
        url: "",
    }

    render() {
        const {
            className = '',
            mediaID,
            onSelect,
            imageSettings
        } = this.props;

        const value = typeof imageSettings === 'object' ? imageSettings : JSON.parse(imageSettings);

        const onSelectValue = val => {
            if (!isEmpty(value.imageSize.cropOptions) && !isNil(value.imageSize.cropOptions.image.url)) {
                deleteImage(value.imageSize.cropOptions.image.url);
                delete value.imageSize.cropOptions;
            }
            onSelect(val, JSON.stringify(value));
        }

        const deleteImage = () => {
            let data = new FormData();
            data.append('old_media_src', this.state.url);

            fetch(
                window.location.origin + ajaxurl + '?action=gx_remove_custom_image_size',
                {
                    method: 'POST',
                    data: data,
                    body: data
                }
            )
                .catch(err => {
                    console.log(__('Error croping the image: ' + err, 'gutenberg-extra'));
                })
        }

        return (
            <MediaUpload
                onSelect={val => onSelectValue(val)}
                allowedTypes="image"
                value={mediaID}
                render={({ open }) => (
                    <IconButton
                        className='gx-imageupload-button'
                        showTooltip="true"
                        onClick={open}>
                        {mediaID && !isEmpty(value.imageSize.options) ?
                            <Image
                                className={className}
                                imageSettings={imageSettings}
                                mediaID={mediaID}
                            /> :
                            mediaID ?
                                (
                                    <Fragment>
                                        <Spinner />
                                        <p>
                                            {__('Loading...', 'gutenberg-extra')}
                                        </p>
                                    </Fragment>
                                ) :
                                iconsSettings.placeholderImage
                        }
                    </IconButton>
                )}
            />
        )
    }
}