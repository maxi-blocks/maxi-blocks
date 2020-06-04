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
import { BackEndResponsiveStyles } from '../../extensions/styles';
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
    componentDidUpdate() {
        this.displayStyles();
    }

    get getWrapperWidth() {
        const target = document.getElementById(`block-${this.props.clientId}`);
        if(!target)
            return;

        return target.getBoundingClientRect().width;
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        if (this.type === 'normal')
            return `${this.props.attributes.uniqueID}`;
        if (this.type === 'hover')
            return `${this.props.attributes.uniqueID}:hover`;
        if (this.type === 'image')
            return `${this.props.attributes.uniqueID}>img`;
        if (this.type === 'figcaption')
            return `${this.props.attributes.uniqueID}>figcaption`;
    }

    get getObject() {
        if (this.type === 'normal')
            return this.getNormalObject
        if (this.type === 'hover')
            return this.getHoverObject
        if (this.type === 'image')
            return this.getImageObject
        if (this.type === 'figcaption')
            return this.getFigcaptionObject
    }

    get getNormalObject() {
        const {
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
            opacity,
            background,
            boxShadow,
            border,
            padding,
            margin
        } = this.props.attributes;

        const response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
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
        if (!!opacity)
            response.image.general['opacity'] = opacity;

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

    get getImageObject() {
        const {
            width
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

    get getFigcaptionObject() {
        const {
            captionTypography
        } = this.props.attributes;

        const response = {
            captionTypography: { ...JSON.parse(captionTypography) }
        };

        return response
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        this.saveMeta('normal');
        this.saveMeta('hover');
        this.saveMeta('image');
        this.saveMeta('figcaption')

        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                extraClassName,
                captionType,
                captionContent,
                size,
                mediaID,
                mediaALT,
                mediaURL,
                mediaWidth,
                mediaHeight,
                width,
            },
            imageData,
            setAttributes,
            isSelected
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-image-block',
            blockStyle,
            extraClassName,
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
            <__experimentalToolbar />,
            <__experimentalBlock.figure
                className={classes}
                data-gx_initial_block_class={defaultBlockStyle}
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
                                        className='maxi-image-block-resizer'
                                        size={{
                                            width: `${width}%`,
                                            height: 'auto'
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
                                        onResize={(event, direction, elt, delta) => {
                                            const newScale = Number(((elt.getBoundingClientRect().width / this.getWrapperWidth) * 100).toFixed());
                                            setAttributes({
                                                width: Number(newScale.toFixed()),
                                            });
                                        }}
                                    >
                                        <div
                                            className="maxi-image-block-settings"
                                        >
                                            <IconButton
                                                className='maxi-image-block-upload-button'
                                                showTooltip="true"
                                                onClick={open}
                                                icon={toolbarReplaceImage}
                                            />
                                        </div>
                                        <img
                                            className={"wp-image-" + mediaID}
                                            src={mediaURL}
                                            width={mediaWidth}
                                            height={mediaHeight}
                                            alt={mediaALT}
                                        />
                                    </ResizableBox>
                                    {captionType !== 'none' &&
                                        <figcaption>
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