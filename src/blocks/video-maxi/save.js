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
import classNames from 'classnames';
import { placeholderImage } from '../../icons';

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
		'close-icon-position': closeIconPosition,
		popAnimation,
	} = props.attributes;

	const name = 'maxi-blocks/video-maxi';

	const videoContainerClassNames = classNames(
		'maxi-video-block__video-container',
		...(playerType === 'popup' && [
			'maxi-video-block__video-container--popup',
			popAnimation &&
				`maxi-video-block__video-container--popup--${popAnimation}`,
		])
	);

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
							{!hideImage &&
								(!isNil(overlayMediaId) || overlayMediaUrl ? (
									<img
										className={`maxi-video-block__overlay-image wp-image-${overlayMediaId}`}
										src={overlayMediaUrl}
										alt={overlayMediaAlt}
									/>
								) : (
									<div className='maxi-video-block__placeholder'>
										{placeholderImage}
									</div>
								))}
							<div className='maxi-video-block__overlay-background' />
							<div className='maxi-video-block__play-button'>
								<RawHTML>{playIcon}</RawHTML>
							</div>
						</div>
						<div
							className='maxi-video-block__popup-wrapper'
							style={{ display: 'none' }}
						>
							{closeIconPosition === 'top-screen-right' && (
								<div className='maxi-video-block__close-button'>
									<RawHTML>{closeIcon}</RawHTML>
								</div>
							)}
							<div className={videoContainerClassNames}>
								{closeIconPosition ===
									'top-right-above-video' && (
									<div className='maxi-video-block__close-button'>
										<RawHTML>{closeIcon}</RawHTML>
									</div>
								)}
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
					<div className={videoContainerClassNames}>
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
					</div>
				) : (
					<div className='maxi-video-block__video-container'>
						<iframe
							className='maxi-video-block__video-player'
							title='video player'
							allowFullScreen
							allow='autoplay'
							src={embedUrl}
							frameBorder={0}
						/>
					</div>
				))}
		</MaxiBlock.save>
	);
};

export default save;
