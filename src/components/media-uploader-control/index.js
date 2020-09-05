/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { Button, ResponsiveWrapper, Spinner } = wp.components;

/**
 * External dependencies
 */
import { isNil } from 'lodash';
import classnames from 'classnames';

/**
 * Styless
 */
import './editor.scss';

/**
 * Component
 */
const MediaUploader = props => {
	const {
		className,
		mediaType = 'image',
		mediaID,
		onSelectImage,
		onRemoveImage,
		imageData,
		onOpen = undefined,
		onClose = undefined,
		placeholder = __('Set image', 'maxi-blocks'),
		extendSelector,
		replaceButton = __('Replace', 'maxi-blocks'),
		removeButton = __('Remove', 'maxi-blocks'),
		alternativeImage,
		allowedTypes = ['image'],
	} = props;

	const classes = classnames(
		'maxi-mediauploader-control',
		`maxi-mediauploader-control__${mediaType}`,
		className
	);

	`editor-post-featured-image__${!mediaID ? 'toggle' : 'preview'}`;
	const mediaClasses = classnames(
		`maxi-mediauploader-control__${mediaID ? 'preview' : 'toggle'}`,
		`maxi-mediauploader-control__${mediaType}__${
			mediaID ? 'preview' : 'toggle'
		}`
	);

	const onOpenImageModal = () => {
		!isNil(onOpenImageModal) && !isNil(onOpen) ? onOpen() : null;
	};

	return (
		<div className={classes}>
			<MediaUploadCheck
				fallback={
					<p>
						{__(
							'To edit this field, you need permission to upload media.',
							'maxi-blocks'
						)}
					</p>
				}
			>
				<MediaUpload
					title={
						mediaType === 'image'
							? __('Background image', 'maxi-blocks')
							: __('Background Video', 'maxi-blocks')
					}
					onSelect={onSelectImage}
					allowedTypes={allowedTypes}
					value={mediaID}
					onClose={!isNil(onClose) ? onClose : null}
					render={({ open }) => (
						<Button
							className={mediaClasses}
							onClick={() => {
								open();
								onOpenImageModal();
							}}
						>
							{!mediaID && placeholder}
							{!!mediaID && !imageData && <Spinner />}
							{mediaType === 'image' && !!mediaID && imageData && (
								<ResponsiveWrapper
									naturalWidth={
										alternativeImage
											? alternativeImage.width
											: imageData.media_details.width
									}
									naturalHeight={
										alternativeImage
											? alternativeImage.height
											: imageData.media_details.height
									}
									className='maxi-imageuploader-control__responsive-wrapper'
								>
									<img
										src={
											!isNil(alternativeImage)
												? alternativeImage.source_url
												: imageData.source_url
										}
										alt={__('Image', 'maxi-blocks')}
									/>
								</ResponsiveWrapper>
							)}
							{mediaType === 'video' && !!mediaID && imageData && (
								<ResponsiveWrapper
									naturalWidth={
										alternativeImage
											? alternativeImage.width
											: imageData.media_details.width
									}
									naturalHeight={
										alternativeImage
											? alternativeImage.height
											: imageData.media_details.height
									}
									className='maxi-imageuploader-control__responsive-wrapper'
								>
									<video
										controls
										autoPlay={false}
										loop={false}
										muted
										preload
										src={
											!isNil(alternativeImage)
												? alternativeImage.source_url
												: imageData.source_url
										}
									/>
								</ResponsiveWrapper>
							)}
						</Button>
					)}
				/>
			</MediaUploadCheck>
			{!!mediaID && imageData && (
				<MediaUploadCheck>
					<MediaUpload
						title={
							mediaType === 'image'
								? __('Image', 'maxi-blocks')
								: __('Video', 'maxi-blocks')
						}
						onSelect={onSelectImage}
						allowedTypes={allowedTypes}
						value={mediaID}
						render={({ open }) => (
							<Button
								onClick={open}
								isDefault
								isLarge
								className={
									mediaType === 'image'
										? 'maxi-mediauploader-control__replace'
										: 'maxi-mediauploader-control__video__replace'
								}
							>
								{replaceButton}
							</Button>
						)}
					/>
				</MediaUploadCheck>
			)}
			{!!mediaID && (
				<MediaUploadCheck>
					<Button
						onClick={onRemoveImage}
						isDestructive
						className={
							mediaType === 'image'
								? 'maxi-mediauploader-control__remove'
								: 'maxi-mediauploader-control__video__remove'
						}
					>
						{removeButton}
					</Button>
				</MediaUploadCheck>
			)}
			{extendSelector}
		</div>
	);
};

const MediaUploaderControl = withSelect((select, props) => {
	const { getMedia } = select('core');
	const { mediaID } = props;

	return {
		imageData: mediaID ? getMedia(mediaID) : null,
	};
})(MediaUploader);

export default MediaUploaderControl;
