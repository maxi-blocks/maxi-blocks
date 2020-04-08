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
        onOpen,
        onClose
    } = props;

    const onOpenImageModal = () => {
        typeof onOpenImageModal != 'undefined' ?
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
                    onClose={onClose}
                    render={({ open }) => (
                        <Button
                            className={!mediaID ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                            onClick={() => {
                                open();
                                onOpenImageModal();
                            }}>
                            {
                                !mediaID &&
                                (__('Set image', 'gutenberg-extra'))
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
                                    naturalWidth={imageData.media_details.width}
                                    naturalHeight={imageData.media_details.height}
                                >
                                    <img
                                        src={imageData.source_url}
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
                            >
                                {__('Replace image', 'gutenberg-extra')}
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
                    >
                        {__('Remove image', 'gutenberg-extra')}
                    </Button>
                </MediaUploadCheck>
            }
        </BaseControl>
    )
};

export default withSelect((select, props) => {
    const { getMedia } = select('core');
    const { mediaID } = props;

    return {
        imageData: mediaID ? getMedia(mediaID) : null,
    };
})(MediaUploader)