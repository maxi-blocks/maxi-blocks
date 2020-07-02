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
const VideoUploader = props => {

    const {
        className,
        mediaID,
        onSelectImage,
        onRemoveImage,
        imageData,
        onOpen = undefined,
        onClose = undefined,
        placeholder = __('Set Video', 'maxi-blocks'),
        extendSelector,
        replaceButton = __('Replace Video', 'maxi-blocks'),
        removeButton = __('Remove Video', 'maxi-blocks'),
    } = props;

    const classes = classnames(
        'maxi-background-control__video__video-control',
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
                    allowedTypes={['video']}
                    value={mediaID}
                    onClose={!isNil(onClose) ? onClose : null}
                    render={({ open }) => (
                        <Button
                            className={
                                !mediaID ?
                                    'maxi-background-control__video__video-control__toggle' :
                                    'maxi-background-control__video__video-control__preview'
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
                        </Button>
                    )}
                />
            </MediaUploadCheck>
            {
                !!mediaID &&
                imageData &&
                <MediaUploadCheck>
                    <MediaUpload
                        title={__('Video', 'maxi-blocks')}
                        onSelect={onSelectImage}
                        allowedTypes={['video']}
                        value={mediaID}
                        render={({ open }) => (
                            <Button
                                onClick={open}
                                isDefault
                                isLarge
                                className='maxi-background-control__video__video-control__replace'
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
                        className='maxi-background-control__video__video-control__remove'
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

const VideoUploaderControl = withSelect((select, props) => {
    const { getMedia } = select('core');
    const { mediaID } = props;

    return {
        imageData: mediaID ? getMedia(mediaID) : null,
    };
})(VideoUploader)

export default VideoUploaderControl;