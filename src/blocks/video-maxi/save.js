/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { videoValidation } from '../../extensions/video';

/**
 * Save
 */
const save = props => {
	const {
		isLightbox,
		embedUrl,
		'close-icon-content': closeIcon,
		'play-icon-content': playIcon,
		videoType,
		isLoop,
		isAutoplay,
		isMuted,
		showPlayerControls,
	} = props.attributes;

	const name = 'maxi-blocks/video-maxi';

	return (
		<MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })}>
			{embedUrl &&
				videoValidation(embedUrl) &&
				(isLightbox ? (
					<>
						<div className='maxi-video-block__thumbnail'>
							{/* {!isNil(thumbnailId) || thumbnailUrl ? (
								<img
									className={`maxi-video-block__thumbnail-image wp-image-${thumbnailId}`}
									src={thumbnailUrl}
									alt=''
								/>
							) : (
								<Placeholder icon={placeholderImage} />
							)} */}
							<div className='maxi-video-block__play-button'>
								<RawHTML>{playIcon}</RawHTML>
							</div>
						</div>
						<div
							className='maxi-video-block__popup-wrapper'
							style={{ display: 'none' }}
						>
							<div className='maxi-video-block__close-button'>
								<RawHTML>{closeIcon}</RawHTML>
							</div>
							<div className='maxi-video-block__iframe-container'>
								{videoType === 'direct' ? (
									<video
										className='maxi-video-block__video-player'
										loop={isLoop}
										muted={isMuted}
										autoPlay={isAutoplay}
										controls={showPlayerControls}
									>
										<track kind='captions' />
									</video>
								) : (
									<iframe
										className='maxi-video-block__video-player'
										title='video player'
										allowFullScreen
										allow='autoplay'
									/>
								)}
							</div>
						</div>
					</>
				) : videoType === 'direct' ? (
					<video
						className='maxi-video-block__video-player'
						loop={isLoop}
						muted={isMuted}
						autoPlay={isAutoplay}
						controls={showPlayerControls}
						src={embedUrl}
					>
						<track kind='captions' />
					</video>
				) : (
					<iframe
						className='maxi-video-block__video-player'
						title='video player'
						allowFullScreen
						allow='autoplay'
						src={embedUrl}
					/>
				))}
		</MaxiBlock.save>
	);
};

export default save;
