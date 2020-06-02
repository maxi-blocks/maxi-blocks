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
import { placeholderImage } from '../../icons';

/**
 * Content
 */
class edit extends GXBlock {

    state = {
        resizableWidth: this.props.attributes.mediaWidth,
        resizableHeight: this.props.attributes.mediaHeight,
    }

    componentDidUpdate() {
        this.displayStyles();
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        if (this.type === 'normal')
            return `${this.props.attributes.uniqueID}`;
        if (this.type === 'hover')
            return `${this.props.attributes.uniqueID}:hover`;
        if (this.type === 'figcaption')
            return `${this.props.attributes.uniqueID}>figcaption`;
    }

    get getObject() {
        if (this.type === 'normal')
            return this.getNormalObject
        if (this.type === 'hover')
            return this.getHoverObject
        if (this.type === 'figcaption')
            return this.getFigcaptionObject
    }

    get getNormalObject() {
        const {
            alignment,
            maxWidthUnit,
            maxWidth,
            widthUnit,
            width,
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
                general: {}
            }
        };

        if (!isNil(alignment)) {
            switch (alignment) {
                case 'left':
                    response.image.general['align-items'] = 'flex-start';
                    break;
                case 'center':
                case 'justify':
                    response.image.general['align-items'] = 'center';
                    break;
                case 'right':
                    response.image.general['align-items'] = 'flex-end';
                    break;
            }
        }
        if (!!opacity)
            response.image.general['opacity'] = opacity;
        if (!!maxWidth) {
            response.image.general['max-widthUnit'] = maxWidthUnit;
            response.image.general['max-width'] = maxWidth;
        }
        if (!!width) {
            response.image.general['widthUnit'] = widthUnit;
            response.image.general['width'] = width;
        }

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
                mediaHeight
            },
            imageData,
            setAttributes,
            clientId
        } = this.props;

        const {
            resizableWidth,
            resizableHeight
        } = this.state;

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
                                    <div
                                        className="maxi-image-block-settings"
                                    >
                                        <IconButton
                                            className='maxi-image-block-upload-button'
                                            showTooltip="true"
                                            onClick={open}
                                            icon={placeholderImage}
                                        />
                                    </div>
                                    <ResizableBox
                                        className="maxi-image-block-resizer"
                                        size={{
                                            width: resizableWidth
                                        }}
                                        maxWidth="100%"
                                        enable={{
                                            top: false,
                                            right: true,
                                            bottom: false,
                                            left: false,
                                            topRight: false,
                                            bottomRight: false,
                                            bottomLeft: false,
                                            topLeft: false,
                                        }}
                                        onResizeStart={() => {
                                            setAttributes({
                                                size: 'custom'
                                            })
                                        }}
                                        onResize={(event, direction, elt, delta) => {
                                            this.setState({
                                                resizableWidth: elt.getBoundingClientRect().width,
                                                resizableHeight: elt.getBoundingClientRect().height
                                            })
                                        }}
                                        onResizeStop={(event, direction, elt, delta) => {
                                            const originalWidth = document.getElementById(`block-${clientId}`).getBoundingClientRect().width;
                                            const newScale = (elt.getBoundingClientRect().width / originalWidth) * 100;
                                            cropOptions.crop.scale = Number(newScale).toFixed();

                                            setAttributes({
                                                cropOptions: JSON.stringify(cropOptions)
                                            });
                                        }}
                                    >
                                        <img
                                            className={"wp-image-" + mediaID}
                                            src={mediaURL}
                                            width={resizableWidth}
                                            height={resizableHeight}
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