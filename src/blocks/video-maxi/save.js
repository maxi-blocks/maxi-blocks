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
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		playerType,
		embedUrl,
		'close-icon-content': closeIcon,
		'play-icon-content': playIcon,
		videoType,
		isLoop,
		isAutoplay,
		isMuted,
		showPlayerControls,
		'overlay-mediaID': overlayMediaId,
		'overlay-mediaURL': overlayMediaUrl,
		'overlay-mediaAlt': overlayMediaAlt,
		hideImage,
	} = props.attributes;

	const name = 'maxi-blocks/video-maxi';

	return (
		<MaxiBlock.save
			classes={`maxi-video-block--${videoType}`}
			{...getMaxiBlockAttributes({ ...props, name })}
		>
			{embedUrl &&
				videoValidation(embedUrl) &&
				(playerType === 'popup' ? (
					<>
						<div className='maxi-video-block__overlay'>
							{(!isNil(overlayMediaId) || overlayMediaUrl) &&
								!hideImage && (
									<img
										className={`maxi-video-block__overlay-image wp-image-${overlayMediaId}`}
										src={overlayMediaUrl}
										alt={overlayMediaAlt}
									/>
								)}
							<div className='maxi-video-block__overlay-background' />
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
							<div className='maxi-video-block__video-container'>
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
										frameBorder={0}
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
						frameBorder={0}
					/>
				))}
		</MaxiBlock.save>
	);
};

export default save;
