/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    Spinner,
    IconButton
} = wp.components;
const {
    __experimentalBlock,
    MediaUpload
} = wp.blockEditor;
const {
    dispatch,
    withSelect,
} = wp.data;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { BackEndResponsiveStyles } from '../../extensions/styles';
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
    }

    get getObject() {
        if (this.type === 'normal')
            return this.getNormalObject
        if (this.type === 'hover')
            return this.getHoverObject
    }

    get getNormalObject() {
        const {
            alignment,
            maxWidthUnit,
            maxWidth,
            widthUnit,
            width,
            opacity,
            backgroundColor,
            backgroundGradient,
            boxShadow,
            border,
            padding, 
            margin
        } = this.props.attributes;

        const response = {
            boxShadow,
            border,
            padding,
            margin,
            image: {
                label: 'Image',
                general: {}
            }
        };

        if (!isNil(alignment)) {
            switch (alignment) {
                case 'left':
                    response.image.general['text-align'] = 'left';
                    break;
                case 'center':
                case 'justify':
                    response.image.general['text-align'] = 'center';
                    break;
                case 'right':
                    response.image.general['text-align'] = 'right';
                    break;
            }
        }
        if (!!opacity)
            response.image.general['opacity'] = opacity;
        if (!!backgroundColor)
            response.image.general['background-color'] = backgroundColor;
        if (!!backgroundGradient)
            response.image.general['background'] = backgroundGradient;
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
            backgroundColorHover,
            backgroundGradientHover
        } = this.props.attributes;

        const response = {
            label: 'Image Hover',
            general: {}
        }
        if (opacityHover)
            response.general['opacity'] = opacityHover;
        if (!isEmpty(backgroundColorHover))
            response.general['background-color'] = backgroundColorHover;
        if (!isEmpty(backgroundGradientHover))
            response.general['background'] = backgroundGradientHover;
        return response;
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        this.saveMeta('normal');
        this.saveMeta('hover');

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
                                    <img
                                        className={"wp-image-" + mediaID}
                                        src={mediaURL}
                                        width={mediaWidth}
                                        height={mediaHeight}
                                        alt={mediaALT}
                                    />
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