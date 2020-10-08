/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Internal Dependencies
 */
import parseVideo from './utils';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const BackgroundDisplayer = props => {
	const { background, className, blockClassName } = props;

	const value = !isObject(background) ? JSON.parse(background) : background;

	const parentEl = document.querySelector(`.${blockClassName}`);

	let iframeHeight = '100%';

	if (parentEl) {
		iframeHeight = `${parentEl.offsetWidth / 1.77}px`; // set the height of the iframe according to the aspect ratio 16:9
	}

	const classes = classnames('maxi-background-displayer', className);

	let videoUrl = value.videoOptions.mediaURL;

	const parsedVideo = parseVideo(videoUrl);

	if (videoUrl && parsedVideo.type === 'youtube') {
		videoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1`;

		if (parseInt(value.videoOptions.loop)) {
			videoUrl += `&loop=1&&playlist=${parsedVideo.id}`;
		}

		if (value.videoOptions.startTime) {
			videoUrl += `&start=${value.videoOptions.startTime}`;
		}

		if (value.videoOptions.endTime) {
			videoUrl += `&end=${value.videoOptions.endTime}`;
		}
	}

	if (videoUrl && parsedVideo.type === 'vimeo') {
		videoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?controls=0&autoplay=1&muted=1`;

		if (parseInt(value.videoOptions.loop)) {
			videoUrl += '&loop=1';
		}

		if (value.videoOptions.startTime) {
			videoUrl += `#t=${value.videoOptions.startTime}`;
		}
	}

	if (parsedVideo.type === 'direct') {
		if (value.videoOptions.startTime && !value.videoOptions.endTime) {
			videoUrl += `#t=${value.videoOptions.startTime}`;
		}

		if (value.videoOptions.endTime) {
			videoUrl += `#t=${value.videoOptions.startTime},${value.videoOptions.endTime}`;
		}
	}

	const videoPlayerClasses = classnames(
		'maxi-background-displayer__video-player',
		!value.videoOptions.playOnMobile &&
			'maxi-background-displayer__video-player--mobile-hidden'
	);

	return (
		<div className={classes}>
			<div className='maxi-background-displayer__overlay' />
			<div className='maxi-background-displayer__color' />
			{value.activeMedia === 'image' && (
				<div className='maxi-background-displayer__images' />
			)}
			{value.activeMedia === 'video' && videoUrl && (
				<div
					className={videoPlayerClasses}
					data-start={value.videoOptions.startTime}
					data-end={value.videoOptions.endTime}
					data-type={parsedVideo.type}
				>
					{parsedVideo.type === 'direct' && (
						<video
							loop={!!parseInt(value.videoOptions.loop)}
							src={videoUrl}
							autoPlay
							muted
						/>
					)}

					{(parsedVideo.type === 'youtube' ||
						parsedVideo.type === 'vimeo') && (
						<div className='maxi-background-displayer__video-player__iframe-wrapper'>
							<iframe
								title={`${parsedVideo.type} video`}
								src={videoUrl}
								frameBorder='0'
								allow='autoplay'
								allowFullScreen='allowfullscreen'
								style={{ height: iframeHeight }}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default BackgroundDisplayer;
