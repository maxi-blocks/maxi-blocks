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
    BaseControl
} = wp.components;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Block
 */
const MediaUploader = props => {

    const {
        label = '',
        className = 'gx-mediauploader-control',
        mediaID,
        onSelectImage,
        onRemoveImage,
        imageData,
        onOpen = undefined,
        onClose = undefined,
        placeholder = __('Set image', 'gutenberg-extra'),
        extendSelector,
        replaceButton = __('Replace image', 'gutenberg-extra'),
        removeButton = __('Remove image', 'gutenberg-extra'),
        alternativeImage
    } = props;

    const onOpenImageModal = () => {
        !isNil(onOpenImageModal) && !isNil(onOpen) ?
            onOpen() :
            null
    }

    return (
        <BaseControl
            className={className}
            label={label}
        >
            <MediaUploadCheck
                fallback={
                    <p>
                        {__('To edit this field, you need permission to upload media.', 'gutenberg-extra')}
                    </p>
                }
            >
                <MediaUpload
                    title={__('Background image', 'gutenberg-extra')}
                    onSelect={onSelectImage}
                    allowedTypes={['image']}
                    value={mediaID}
                    onClose={!isNil(onClose) ? onClose : null}
                    render={({ open }) => (
                        <Button
                            className={!mediaID ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
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
                                    naturalWidth={alternativeImage? alternativeImage.width : imageData.media_details.width}
                                    naturalHeight={alternativeImage? alternativeImage.height : imageData.media_details.height}
                                    className="gx-imageuploader-control-wrapper"
                                >
                                    <img
                                        src={!isNil(alternativeImage) ? alternativeImage.source_url : imageData.source_url}
                                        alt={__('Image', 'gutenberg-extra')}
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
                        title={__('Image', 'gutenberg-extra')}
                        onSelect={onSelectImage}
                        allowedTypes={['image']}
                        value={mediaID}
                        render={({ open }) => (
                            <Button
                                onClick={open}
                                isDefault
                                isLarge
                                className='gx-imageuploader-control-replace'
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
                        isLink
                        isDestructive
                        className='gx-imageuploader-control-remove'
                    >
                        {removeButton}
                    </Button>
                </MediaUploadCheck>
            }
            {
                extendSelector
            }
        </BaseControl>
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