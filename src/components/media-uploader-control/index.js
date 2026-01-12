/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { ResponsiveWrapper } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Spinner from '@components/spinner';

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
		mediaType = 'image',
		mediaID,
		isImageUrl,
		onSelectImage,
		onRemoveImage,
		imageData,
		onOpen = undefined,
		onClose = undefined,
		placeholder = __('Set image', 'maxi-blocks'),
		extendSelector,
		replaceButton = __('Replace', 'maxi-blocks'),
		removeButton = __('Remove', 'maxi-blocks'),
		showRemove = true,
		showPreview = true,
		alternativeImage,
		allowedTypes = ['image'],
	} = props;

	const classes = classnames(
		'maxi-mediauploader-control',
		`maxi-mediauploader-control__${mediaType}`,
		className
	);

	// `editor-post-featured-image__${!mediaID ? 'toggle' : 'preview'}`;	=> ????
	const mediaClasses = classnames(
		`maxi-mediauploader-control__${mediaID ? 'preview' : 'toggle'}`,
		`maxi-mediauploader-control__${mediaType}__${
			mediaID ? 'preview' : 'toggle'
		}`
	);

	const onOpenImageModal = () => {
		!isNil(onOpenImageModal) && !isNil(onOpen) && onOpen();
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
							{!mediaID &&
								`${placeholder}${
									isImageUrl
										? __(
												' from media library',
												'maxi-blocks'
										  )
										: ''
								}`}
							{!!mediaID && !imageData && <Spinner />}
								{mediaType === 'image' &&
									showPreview &&
									!!mediaID &&
									imageData && (
									<div className='maxi-mediauploader-control__responsive-wrapper'>
										<img
											src={
												alternativeImage
													? alternativeImage.source_url
													: imageData.source_url
											}
											alt={__('Image', 'maxi-blocks')}
										/>
									</div>
								)}
								{mediaType === 'video' &&
									showPreview &&
									!!mediaID &&
									imageData && (
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
									className='maxi-mediauploader-control__responsive-wrapper'
								>
									<video
										controls
										autoPlay={false}
										loop={false}
										muted
										preload
										src={
											alternativeImage
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
				{!!mediaID && showRemove && (
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
