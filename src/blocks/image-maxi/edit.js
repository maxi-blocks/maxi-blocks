/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { withSelect } = wp.data;
const {
    Spinner,
    IconButton,
    ResizableBox
} = wp.components;
const {
    __experimentalBlock,
    MediaUpload
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject
} from '../../extensions/styles/utils';
import {
    GXBlock,
    __experimentalToolbar
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    isNumber
} from 'lodash';

/**
 * Icons
 */
import {
    toolbarReplaceImage,
    placeholderImage
} from '../../icons';

/**
 * Content
 */
class edit extends GXBlock {
    get getWrapperWidth() {
        const target = document.getElementById(`block-${this.props.clientId}`);
        if (!target)
            return;

        return target.getBoundingClientRect().width;
    }

    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}>img`]: this.getImageFrontendObject,
            [`${this.props.attributes.uniqueID} img:hover`]: this.getImageHoverObject,
            [`${this.props.attributes.uniqueID} img`]: this.getImageBackendObject,
            [`${this.props.attributes.uniqueID}>figcaption`]: this.getFigcaptionObject
        }

        return response;
    }

    get getNormalObject() {
        const {
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
            opacity,
            background,
            boxShadow,
            padding,
            margin,
            zIndex
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            image: {
                label: 'Image',
                general: {},
                desktop: {},
                tablet: {},
                mobile: {}
            }
        };

        if (!isNil(alignmentDesktop)) {
            switch (alignmentDesktop) {
                case 'left':
                    response.image.desktop['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.desktop['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.desktop['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!isNil(alignmentTablet)) {
            switch (alignmentTablet) {
                case 'left':
                    response.image.tablet['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.tablet['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.tablet['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!isNil(alignmentMobile)) {
            switch (alignmentMobile) {
                case 'left':
                    response.image.mobile['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.mobile['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.mobile['align-items'] = 'flex-end';
                    break;
            }
        }
        if (isNumber(opacity))
            response.image.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.image.general['z-index'] = zIndex;

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            backgroundHover,
            boxShadowHover
        } = this.props.attributes;

        const response = {
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            imageHover: {
                label: 'Image Hover',
                general: {}
            }
        }
        if (opacityHover)
            response.imageHover.general['opacity'] = opacityHover;

        return response;
    }

    get getImageFrontendObject() {
        const {
            width,
        } = this.props.attributes;

        const response = {
            imageSize: {
                label: 'Image Size',
                general: {}
            }
        };

        if (!!width)
            response.imageSize.general['width'] = `${width}%`;

        return response
    }

    get getImageHoverObject() {
        const {
            borderHover
        } = this.props.attributes;

        const response = {
            borderHover: { ...JSON.parse(borderHover) },
            borderWidth: { ...JSON.parse(borderHover).borderWidth },
            borderRadius: { ...JSON.parse(borderHover).borderRadius },
        };

        return response
    }

    get getImageBackendObject() {
        const {
            border
        } = this.props.attributes;

        const response = {
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            imageSize: {
                label: 'Image Size',
                general: {}
            }
        };

        return response
    }

    get getFigcaptionObject() {
        const {
            captionTypography
        } = this.props.attributes;

        const response = {
            captionTypography: { ...JSON.parse(captionTypography) }
        };

        return response
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                extraClassName,
                fullWidth,
                captionType,
                captionContent,
                size,
                mediaID,
                mediaALT,
                mediaURL,
                mediaWidth,
                mediaHeight,
                width,
                hoverAnimation,
                hoverAnimationDuration,
            },
            imageData,
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-image-block',
            blockStyle,
            extraClassName,
            'hover-animation-type-'+hoverAnimation,
            'hover-animation-duration-'+hoverAnimationDuration,
            uniqueID,
            className
        );

        const cropOptions = typeof this.props.attributes.cropOptions === 'object' ?
            this.props.attributes.cropOptions :
            JSON.parse(this.props.attributes.cropOptions);

        const getImage = () => {
            if (size === 'custom' && !isEmpty(cropOptions.image.source_url))
                return cropOptions.image;
            if (imageData && size)
                return imageData.media_details.sizes[size];
            if (imageData)
                return imageData.media_details.sizes.full;
        }

        const image = getImage();
        if (image && imageData) {
            if (mediaALT != imageData.alt_text)
                setAttributes({ mediaALT: imageData.alt_text })
            if (mediaURL != image.source_url)
                setAttributes({ mediaURL: image.source_url })
            if (mediaWidth != image.width)
                setAttributes({ mediaWidth: image.width })
            if (mediaHeight != image.height)
                setAttributes({ mediaHeight: image.height })
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBlock.figure
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
                data-align={fullWidth}
            >
                <MediaUpload
                    onSelect={media => setAttributes({ mediaID: media.id })}
                    allowedTypes="image"
                    value={mediaID}
                    render={({ open }) => (
                        <Fragment>
                            {!isNil(mediaID) && imageData ?
                                <Fragment>
                                    <ResizableBox
                                        className='maxi-block__resizer maxi-image-block__resizer'
                                        size={{
                                            width: `${width}%`,
                                            height: '100%'
                                        }}
                                        maxWidth='100%'
                                        enable={{
                                            top: false,
                                            right: false,
                                            bottom: false,
                                            left: false,
                                            topRight: true,
                                            bottomRight: true,
                                            bottomLeft: true,
                                            topLeft: true,
                                        }}
                                        onResizeStop={(event, direction, elt, delta) => {
                                            const newScale = Number(((elt.getBoundingClientRect().width / this.getWrapperWidth) * 100).toFixed());
                                            setAttributes({
                                                width: Number(newScale.toFixed()),
                                            });
                                        }}
                                    >
                                        <div
                                            className="maxi-image-block__settings"
                                        >
                                            <IconButton
                                                className='maxi-image-block__settings__upload-button'
                                                showTooltip="true"
                                                onClick={open}
                                                icon={toolbarReplaceImage}
                                            />
                                        </div>
                                        <img
                                            className={`maxi-image-block__image wp-image-${mediaID}`}
                                            src={mediaURL}
                                            width={mediaWidth}
                                            height={mediaHeight}
                                            alt={mediaALT}
                                        />
                                    </ResizableBox>
                                    {captionType !== 'none' &&
                                        <figcaption
                                            className="maxi-image-block__caption"
                                        >
                                            {captionContent}
                                        </figcaption>
                                    }
                                </Fragment> :
                                mediaID ?
                                    <Fragment>
                                        <Spinner />
                                        <p>
                                            {__('Loading...', 'maxi-blocks')}
                                        </p>
                                    </Fragment> :
                                    <IconButton
                                        className='maxi-imageupload-button'
                                        showTooltip="true"
                                        onClick={open}
                                        icon={placeholderImage}
                                    >
                                    </IconButton>
                            }
                        </Fragment>
                    )}
                />
            </__experimentalBlock.figure>
        ];
    }
}

export default withSelect((select, ownProps) => {
    const {
        attributes: {
            mediaID
        }
    } = ownProps;

    const imageData = select('core').getMedia(mediaID);
    return {
        imageData
    }
})(edit);