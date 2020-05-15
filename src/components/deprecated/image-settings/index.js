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
import { GXComponent } from '../../index';
import AccordionControl from '../../accordion-control';
import AlignmentControl from '../../alignment-control';
import BorderControl from '../../border-control';
import BoxShadowControl from '../../box-shadow-control';
import ColorControl from '../../color-control';
import ImageCropControl from '../../image-crop-control';
import NormalHoverControl from '../../normal-hover-control';
import SizeControl from '../../size-control';
import TypographyControl from '../../typography-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    capitalize,
    isEmpty,
    isNil,
    isNumber,
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { placeholderImage } from '../../../icons';

/**
 * Component
 */
class ImageSettingsComponent extends GXComponent {

    target = this.props.target ? this.props.target : 'gx-image-box-image';

    state = {
        selector: 'normal',
    }

    componentDidMount() {
        const value = typeof this.props.imageSettings === 'object' ? this.props.imageSettings : JSON.parse(this.props.imageSettings);
        this.saveAndSend(value)
    }

    get getObject() {
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
            className,
            imageData,
            imageSettings,
            target = 'gx-image-box-image',
        } = this.props;

        const {
            selector,
        } = this.state;

        let value = typeof imageSettings === 'object' ? imageSettings : JSON.parse(imageSettings);
        const classes = classnames('gx-imagesettings-control', className);

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
            <div className={classes}>
                <AccordionControl
                    isSecondary
                    items={[
                        {
                            label: __("Image", "gutenberg-extra"),
                            classNameItem: 'gx-image-item"',
                            classNameHeading: "gx-image-tab",
                            content: (
                                <Fragment>
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
                                        <ImageCropControl
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
                                        <TypographyControl
                                            fontOptions={value.captionTypography}
                                            onChange={val => {
                                                value.captionTypography = val;
                                                this.saveAndSend(value);
                                            }}
                                            target={target + ' figcaption'}
                                        />
                                    }
                                    <SizeControl
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
                                    <SizeControl
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
                                </Fragment>
                            )
                        },
                        {
                            label: __("Background", "gutenberg-extra"),
                            classNameItem: 'gx-background-item',
                            classNameHeading: "gx-background-tab",
                            content: (
                                <Fragment>
                                    <NormalHoverControl
                                        selector={selector}
                                        onChange={selector => {
                                            this.setState({ selector });
                                        }}
                                    />
                                    <ColorControl
                                        label={__('Background Colour', 'gutenberg-extra')}
                                        color={value[selector].backgroundColor}
                                        defaultColor={value[selector].defaultBackgroundColor}
                                        onColorChange={val => {
                                            value[selector].backgroundColor = val;
                                            this.saveAndSend(value)
                                        }}
                                        gradient={value[selector].backgroundGradient}
                                        defaultGradient={value[selector].resetBackgroundGradient}
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
                                    <RangeControl
                                        label={__('Opacity', 'gutenberg-extra')}
                                        value={value[selector].opacity * 100}
                                        allowReset={true}
                                        min={0}
                                        max={100}
                                        onChange={val => {
                                            value[selector].opacity = val / 100;
                                            this.saveAndSend(value)
                                        }}
                                    />
                                    <BoxShadowControl
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
                                </Fragment>
                            )
                        },
                        {
                            label: __("Border", "gutenberg-extra"),
                            classNameItem: 'gx-border-item',
                            classNameHeading: "gx-border-tab",
                            content: (
                                <BorderControl
                                    borderOptions={value[selector].borderSettings}
                                    onChange={val => {
                                        value[selector].borderSettings = val;
                                        this.saveAndSend(value)
                                    }}
                                    target={
                                        selector != 'hover' ?
                                            target :
                                            `${target}:hover`
                                    }
                                />
                            )
                        }
                    ]}
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
})(ImageSettingsComponent)

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
                            placeholderImage
                    }
                </IconButton>
            )}
        />
    )
}