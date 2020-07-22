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
    getBoxShadowObject,
    getAlignmentFlexObject
} from '../../extensions/styles/utils';
import {
    MaxiBlock,
    __experimentalToolbar,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    isObject
} from 'lodash';

/**
 * Icons
 */
import {
    toolbarReplaceImage,
    placeholderImage
} from '../../icons';

import Scripts from '../../extensions/styles/hoverAnimations.js';

/**
 * Content
 */
class edit extends MaxiBlock {
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
            [`${this.props.attributes.uniqueID}>figcaption`]: this.getFigcaptionObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
        }

        return response;
    }

    get getNormalObject() {
        const {
            alignment,
            opacity,
            background,
            boxShadow,
            padding,
            margin,
            zIndex,
            position,
            display,
            clipPath
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            opacity: { ...JSON.parse(opacity) },
            zindex: { ...JSON.parse(zIndex) },
            alignment: { ...getAlignmentFlexObject(JSON.parse(alignment)) },
            position: { ...JSON.parse(position) },
            positionOptions: { ...JSON.parse(position).options },
            display: { ...JSON.parse(display) },
        };

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
            opacityHover: { ...JSON.parse(opacityHover) }
        }

        return response;
    }

    get getImageFrontendObject() {
        const {
            size,
        } = this.props.attributes;

        const response = {
            imageSize: { ...JSON.parse(size) }
        };



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
            border,
            clipPath
        } = this.props.attributes;

        const response = {
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            image: {
                label: 'Image settings',
                general: {}
            }
        };

        if (!isNil(clipPath))
            response.image.general['clip-path'] = clipPath;

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


    get getHoverAnimationMainObject() {
        const {
            hoverOpacity,
            hoverBackground,
            hoverBorder,
            hoverPadding,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverBackground)) },
            border: { ...JSON.parse(hoverBorder) },
            borderWidth: { ...JSON.parse(hoverBorder).borderWidth },
            borderRadius: { ...JSON.parse(hoverBorder).borderRadius },
            padding: { ...JSON.parse(hoverPadding) },
            animationHover: {
                label: 'Animation Hover',
                general: {}
            }
        };

        if (hoverOpacity)
            response.animationHover.general['opacity'] = hoverOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityObject() {
        const {
            hoverAnimationTypeOpacity,
        } = this.props.attributes;

        const response = {
            animationTypeOpacityHover: {
                label: 'Animation Type Opacity Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacity)
            response.animationTypeOpacityHover.general['opacity'] = hoverAnimationTypeOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityColorObject() {
        const {
            hoverAnimationTypeOpacityColor,
            hoverAnimationTypeOpacityColorBackground,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverAnimationTypeOpacityColorBackground)) },
            animationTypeOpacityHoverColor: {
                label: 'Animation Type Opacity Color Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacityColor)
            response.animationTypeOpacityHoverColor.general['opacity'] = hoverAnimationTypeOpacityColor;

        return response
    }



    get getHoverAnimationTextTitleObject() {
        const {
            hoverAnimationTitleTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationTitleTypography: { ...JSON.parse(hoverAnimationTitleTypography) }
        };

        return response
    }

    get getHoverAnimationTextContentObject() {
        const {
            hoverAnimationContentTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationContentTypography: { ...JSON.parse(hoverAnimationContentTypography) }
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
                size,
                cropOptions,
                captionType,
                captionContent,
                imageSize,
                mediaID,
                mediaALT,
                mediaURL,
                mediaWidth,
                mediaHeight,
                hoverAnimation,
                hoverAnimationType,
                hoverAnimationTypeText,
                hoverAnimationDuration,
            },
            imageData,
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-image-block',
            blockStyle,
            extraClassName,
            'hover-animation-' + hoverAnimation,
            'hover-animation-type-' + hoverAnimationType,
            'hover-animation-type-text-' + hoverAnimationTypeText,
            'hover-animation-duration-' + hoverAnimationDuration,
            uniqueID,
            className,
            fullWidth === 'full' ?
                'alignfull' :
                '',
        );

        const cropOptionsValue = !isObject(cropOptions) ?
            JSON.parse(cropOptions) :
            cropOptions;

        const sizeValue = !isObject(size) ?
            JSON.parse(size) :
            size;

        const getImage = () => {
            if (imageSize === 'custom' && !isEmpty(cropOptionsValue.image.source_url))
                return cropOptionsValue.image;
            if (imageData && imageSize)
                return imageData.media_details.sizes[imageSize];
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
                                            width: `${sizeValue.general.width}%`,
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
                                            sizeValue.general.width = newScale
                                            setAttributes({
                                                size: JSON.stringify(sizeValue),
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
                {hoverAnimation === 'basic' &&
                    <Scripts
                        hover_animation={hoverAnimationType}
                        hover_animation_type={hoverAnimation}
                    >
                    </Scripts>
                }
                {hoverAnimation === 'text' &&
                    <Scripts
                        hover_animation={hoverAnimationTypeText}
                        hover_animation_type={hoverAnimation}
                    >
                    </Scripts>
                }
            </__experimentalBlock.figure>
        ];
    }
}

export default withSelect((select, ownProps) => {
    const { mediaID } = ownProps.attributes;

    const imageData = select('core').getMedia(mediaID);
    let deviceType = select('core/edit-post').__experimentalGetPreviewDeviceType();
    deviceType = deviceType === 'Desktop' ?
        'general' :
        deviceType;

    return {
        imageData,
        deviceType
    }
})(edit);