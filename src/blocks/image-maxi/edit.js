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
            [`${this.props.attributes.uniqueID}>figcaption`]: this.getFigcaptionObject
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
            zIndex
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            padding: { ...JSON.parse(padding) },
            margin: { ...JSON.parse(margin) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            opacity: { ...JSON.parse(opacity) },
            zindex: { ...JSON.parse(zIndex) },
            alignment: { ...getAlignmentFlexObject(JSON.parse(alignment)) }
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
            border
        } = this.props.attributes;

        const response = {
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
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
                hoverAnimationDuration,
            },
            imageData,
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-image-block',
            blockStyle,
            extraClassName,
            'hover-animation-type-' + hoverAnimation,
            'hover-animation-duration-' + hoverAnimationDuration,
            uniqueID,
            className
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