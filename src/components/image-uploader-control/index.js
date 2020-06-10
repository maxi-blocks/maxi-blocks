/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const {
    MediaUpload,
    MediaUploadCheck
} = wp.blockEditor;
const {
    Button,
    ResponsiveWrapper,
    Spinner,
} = wp.components;

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const MediaUploader = props => {

    const {
        className,
        mediaID,
        onSelectImage,
        onRemoveImage,
        imageData,
        onOpen = undefined,
        onClose = undefined,
        placeholder = __('Set image', 'maxi-blocks'),
        extendSelector,
        replaceButton = __('Replace image', 'maxi-blocks'),
        removeButton = __('Remove image', 'maxi-blocks'),
        alternativeImage
    } = props;

    const classes = classnames(
        'maxi-mediauploader-control',
        className
    );

    const onOpenImageModal = () => {
        !isNil(onOpenImageModal) && !isNil(onOpen) ?
            onOpen() :
            null
    }

    return (
        <div
            className={classes}
        >
            <MediaUploadCheck
                fallback={
                    <p>
                        {__('To edit this field, you need permission to upload media.', 'maxi-blocks')}
                    </p>
                }
            >
                <MediaUpload
                    title={__('Background image', 'maxi-blocks')}
                    onSelect={onSelectImage}
                    allowedTypes={['image']}
                    value={mediaID}
                    onClose={!isNil(onClose) ? onClose : null}
                    render={({ open }) => (
                        <Button
                            className={
                                !mediaID ? 
                                    'editor-post-featured-image__toggle' : 
                                    'editor-post-featured-image__preview'
                            }
                            onClick={() => {
                                open();
                                onOpenImageModal();
                            }}>
                            {
                                !mediaID &&
                                placeholder
                            }
                            {
                                !!mediaID &&
                                !imageData &&
                                <Spinner />
                            }
                            {
                                !!mediaID &&
                                imageData &&
                                <ResponsiveWrapper
                                    naturalWidth={
                                        alternativeImage ?
                                            alternativeImage.width :
                                            imageData.media_details.width
                                    }
                                    naturalHeight={
                                        alternativeImage ?
                                            alternativeImage.height :
                                            imageData.media_details.height
                                    }
                                    className='maxi-imageuploader-control__responsive-wrapper'
                                >
                                    <img
                                        src={
                                            !isNil(alternativeImage) ?
                                                alternativeImage.source_url :
                                                imageData.source_url
                                        }
                                        alt={__('Image', 'maxi-blocks')}
                                    />
                                </ResponsiveWrapper>
                            }
                        </Button>
                    )}
                />
            </MediaUploadCheck>
            {
                !!mediaID &&
                imageData &&
                <MediaUploadCheck>
                    <MediaUpload
                        title={__('Image', 'maxi-blocks')}
                        onSelect={onSelectImage}
                        allowedTypes={['image']}
                        value={mediaID}
                        render={({ open }) => (
                            <Button
                                onClick={open}
                                isDefault
                                isLarge
                                className='maxi-mediauploader-control__replace'
                            >
                                {replaceButton}
                            </Button>
                        )}
                    />
                </MediaUploadCheck>
            }
            {
                !!mediaID &&
                <MediaUploadCheck>
                    <Button
                        onClick={onRemoveImage}
                        isDestructive
                        className='maxi-mediauploader-control__remove'
                    >
                        {removeButton}
                    </Button>
                </MediaUploadCheck>
            }
            {
                extendSelector
            }
        </div>
    )
};

const ImageUploaderControl = withSelect((select, props) => {
    const { getMedia } = select('core');
    const { mediaID } = props;

    return {
        imageData: mediaID ? getMedia(mediaID) : null,
    };
})(MediaUploader)

export default ImageUploaderControl;