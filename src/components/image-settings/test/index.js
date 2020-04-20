/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { MediaUpload } = wp.blockEditor;
const {
    SelectControl,
    RangeControl,
    TextControl,
    IconButton,
    Spinner,
} = wp.components;
const {
    withSelect,
    dispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import GXComponent from '../../../extensions/gx-component';
import { BlockBorder } from '../../block-border';
import AlignmentControl from '../../alignment-control';
import MiniSizeControl from '../../mini-size-control';
import { PopoverControl } from '../../popover';
import { BoxShadow } from '../../box-shadow';
import Typography from '../../typography';
import iconsSettings from '../../icons/icons-settings.js';
import ColorControl from '../../color-control';
import ImageCrop from '../../image-crop';
import NormalHover from '../../normal-hover';

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
import '../editor.scss';

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
class ImageSettingsOptions extends GXComponent {
    
    target = this.props.target ? this.props.target : 'gx-image-box-image';

    state = {
        selector: 'normal',
    }

    componentDidMount() {
        const value = typeof this.props.imageSettings === 'object' ? this.props.imageSettings : JSON.parse(this.props.imageSettings);
        this.saveAndSend(value)
    }

    get getObject(){
        if (this.type === 'normal')
            return this.getNormalStylesObject;
        if (this.type === 'hover')
            return this.getHoverStylesObject;
        if (this.type === 'img')
            return this.getImgStylesObject;
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getNormalStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isNil(this.object.alignment)) {
            switch (this.object.alignment) {
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
        if (isNumber(this.object.sizeSettings.maxWidth)) {
            response.general['max-widthUnit'] = this.object.sizeSettings.maxWidthUnit;
        }
        if (isNumber(this.object.sizeSettings.maxWidth)) {
            response.general['max-width'] = this.object.sizeSettings.maxWidth;
        }
        if (isNumber(this.object.sizeSettings.width)) {
            response.general['widthUnit'] = this.object.sizeSettings.widthUnit;
        }
        if (isNumber(this.object.sizeSettings.width)) {
            response.general['width'] = this.object.sizeSettings.width;
        }
        if (isNumber(this.object.normal.opacity)) {
            response.general['opacity'] = this.object.normal.opacity;
        }
        if (!isEmpty(this.object.normal.backgroundColor)) {
            response.general['background-color'] = this.object.normal.backgroundColor;
        }
        if (!isEmpty(this.object.normal.backgroundGradient)) {
            response.general['background'] = this.object.normal.backgroundGradient;
        }
        if (!isEmpty(this.object.normal.borderSettings.borderColor)) {
            response.general['border-color'] = this.object.normal.borderSettings.borderColor;
        }
        if (!isEmpty(this.object.normal.borderSettings.borderType)) {
            response.general['border-style'] = this.object.normal.borderSettings.borderType;
        }
        return response;
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getHoverStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (isNumber(this.object.hover.opacity)) {
            response.general['opacity'] = this.object.hover.opacity;
        }
        if (!isEmpty(this.object.hover.backgroundColor)) {
            response.general['background-color'] = this.object.hover.backgroundColor;
        }
        if (!isEmpty(this.object.hover.borderSettings.borderColor)) {
            response.general['border-color'] = this.object.hover.borderSettings.borderColor;
        }
        if (!isEmpty(this.object.hover.backgroundGradient)) {
            response.general['background'] = this.object.hover.backgroundGradient;
        }
        if (!isEmpty(this.object.hover.borderSettings.borderType)) {
            response.general['border-style'] = this.object.hover.borderSettings.borderType;
        }
        return response;
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getImgStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (isNumber(this.object.imageSize.width)) {
            response.general['width'] = this.object.imageSize.width + this.object.imageSize.widthUnit;
        }
        if (isNumber(this.object.imageSize.height)) {
            response.general['height'] = this.object.imageSize.height + this.object.imageSize.heightUnit;
        }

        return response;
    }

    /**
    * Saves and send the data. Also refresh the styles on Editor
    */
    saveAndSend(value) {
        this.save(value);

        this.target = this.props.target ? this.props.target : 'gx-image-box-image';
        this.saveMeta(value, 'normal');

        this.target = `${this.props.target ? this.props.target : 'gx-image-box-image'}:hover`;
        this.saveMeta(value, 'hover');

        this.target = `${this.props.target ? this.props.target : 'gx-image-box-image'} img`;
        this.saveMeta(value, 'img');

        new BackEndResponsiveStyles(this.getMeta);
    }

    save(value) {
        this.props.onChange(JSON.stringify(value));
    }

    saveMeta(value, type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(value, type),
            },
        });
    }

    render() {
        const {
            mediaID,
            className = "gx-imagesettings-control",
            imageData,
            imageSettings = this.props.attributes.imageSettings,
            target = 'gx-image-box-image',
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

        const getValues = () => {
            value.alt = imageData.alt_text;
            value.src = imageData.source_url;
            value.imageSize.options = imageData.media_details.sizes;
            this.save(value);
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
                        this.saveAndSend(value)
                    }}
                />
                {value.size === 'custom' &&
                    <ImageCrop
                        mediaID={mediaID}
                        cropOptions={value.imageSize.cropOptions ? value.imageSize.cropOptions : {}}
                        onChange={cropOptions => {
                            value.imageSize.cropOptions = cropOptions;
                            this.saveAndSend(value);
                        }}
                    />
                }
                <AlignmentControl
                    value={value.alignment}
                    onChange={val => {
                        value.alignment = val;
                        this.saveAndSend(value)
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
                        this.saveAndSend(value);
                    }}
                />
                {value.captionType === 'custom' &&
                    <TextControl
                        label={__('Custom Caption', 'gutenberg-extra')}
                        className="custom-caption"
                        value={value.caption}
                        onChange={val => {
                            value.caption = val;
                            this.saveAndSend(value);
                        }}
                    />
                }
                {value.captionType != 'none' &&
                    <Typography
                        fontOptions={value.captionTypography}
                        onChange={val => {
                            value.captionTypography = val;
                            this.saveAndSend(value);
                        }}
                        target={target + ' figcaption'}
                    />
                }
                <MiniSizeControl
                    label={__('Max Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.maxWidthUnit}
                    onChangeUnit={val => {
                        value.sizeSettings.maxWidthUnit = val;
                        this.saveAndSend(value);
                    }}
                    value={value.sizeSettings.maxWidth}
                    onChangeValue={val => {
                        value.sizeSettings.maxWidth = val;
                        this.saveAndSend(value);
                    }}
                />
                <MiniSizeControl
                    label={__('Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.widthUnit}
                    onChangeUnit={val => {
                        value.sizeSettings.widthUnit = val;
                        this.saveAndSend(value);
                    }}
                    value={value.sizeSettings.width}
                    onChangeValue={val => {
                        value.sizeSettings.width = val;
                        this.saveAndSend(value);
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
                    value={value[selector].opacity * 100}
                    min={0}
                    max={100}
                    onChange={val => {
                        value[selector].opacity = val / 100;
                        this.saveAndSend(value)
                    }}
                />
                <ColorControl
                    label={__('Background Colour', 'gutenberg-extra')}
                    color={value[selector].backgroundColor}
                    onColorChange={val => {
                        value[selector].backgroundColor = val;
                        this.saveAndSend(value)
                    }}
                    gradient={value[selector].backgroundGradient}
                    onGradientChange={val => {
                        value[selector].backgroundGradient = val;
                        this.saveAndSend(value)
                    }}
                    gradientAboveBackground={value[selector].gradientAboveBackground}
                    onGradientAboveBackgroundChange={val => {
                        value[selector].gradientAboveBackground = val;
                        this.saveAndSend(value)
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
                                        this.saveAndSend(value)
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
                        this.saveAndSend(value);
                    }}
                    borderType={value[selector].borderSettings.borderType}
                    onChangeBorderType={val => {
                        value[selector].borderSettings.borderType = val;
                        this.saveAndSend(value);
                    }}
                    borderRadius={value[selector].borderSettings.borderRadius}
                    onChangeBorderRadius={val => {
                        value[selector].borderSettings.borderRadius = val;
                        this.saveAndSend(value);
                    }}
                    borderWidth={value[selector].borderSettings.borderWidth}
                    onChangeBorderWidth={val => {
                        value[selector].borderSettings.borderWidth = val;
                        this.saveAndSend(value);
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

export const ImageSettingsTest = withSelect((select, ownProps) => {
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
        if (size === 'custom' && !isNil(value.imageSize.cropOptions) && !isEmpty(value.imageSize.cropOptions))
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
export const ImageUpload = props => {
    const {
        className = '',
        mediaID,
        onSelect,
        imageSettings
    } = props;

    const value = typeof imageSettings === 'object' ? imageSettings : JSON.parse(imageSettings);

    return (
        <MediaUpload
            // onSelect={val => onSelectValue(val)}
            onSelect={onSelect}
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