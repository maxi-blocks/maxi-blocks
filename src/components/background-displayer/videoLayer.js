/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';

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
const VideoLayer = props => {
	const { videoOptions, blockClassName, className } = props;

	const parentEl = document.querySelector(`.${blockClassName}`);

	let iframeHeight = '100%';

	if (parentEl) {
		iframeHeight = `${parentEl.offsetWidth / 1.77}px`; // Set the height of the iframe according to the aspect ratio 16:9
	}

	let videoUrl = videoOptions.mediaURL;

	const parsedVideo = parseVideo(videoUrl);

	if (videoUrl && parsedVideo.type === 'youtube') {
		videoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1`;

		if (parseInt(videoOptions.loop)) {
			videoUrl += `&loop=1&&playlist=${parsedVideo.id}`;
		}

		if (videoOptions.startTime) {
			videoUrl += `&start=${videoOptions.startTime}`;
		}

		if (videoOptions.endTime) {
			videoUrl += `&end=${videoOptions.endTime}`;
		}
	}

	if (videoUrl && parsedVideo.type === 'vimeo') {
		videoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?controls=0&autoplay=1&muted=1&autopause=0`;

		if (parseInt(videoOptions.loop)) {
			videoUrl += '&loop=1';
		}

		if (videoOptions.startTime) {
			videoUrl += `#t=${videoOptions.startTime}`;
		}
	}

	if (parsedVideo.type === 'direct') {
		if (videoOptions.startTime && !videoOptions.endTime) {
			videoUrl += `#t=${videoOptions.startTime}`;
		}

		if (videoOptions.endTime) {
			videoUrl += `#t=${videoOptions.startTime},${videoOptions.endTime}`;
		}
	}

	const videoPlayerClasses = classnames(
		'maxi-background-displayer__layer',
		'maxi-background-displayer__video-player',
		!videoOptions.playOnMobile &&
			'maxi-background-displayer__video-player--mobile-hidden',
		className
	);

	// Pasue vimeo at the endTime
	if (parsedVideo.type === 'vimeo' && videoOptions.endTime && parentEl) {
		const scriptsArray = Array.from(window.document.scripts);

		const vimeoIsMounted = scriptsArray.findIndex(
			script => script.getAttribute('id') === 'maxi-vimeo-sdk'
		);

		if (vimeoIsMounted === -1) {
			const script = document.createElement('script');
			script.src = 'https://player.vimeo.com/api/player.js';
			script.id = 'maxi-vimeo-sdk';
			script.async = true;
			script.onload = () => {
				// Cleanup onload handler
				script.onload = null;

				// Pause all vimeo videos on the page at the endTime
				const containerElems = document.querySelectorAll(
					'.maxi-container-block'
				);
				containerElems.forEach(elem => {
					const videoPlayerElement = elem.querySelector(
						'.maxi-background-displayer__video-player'
					);
					const videoEnd = videoPlayerElement.getAttribute(
						'data-end'
					);
					const videoType = videoPlayerElement.getAttribute(
						'data-type'
					);

					if (videoType === 'vimeo' && videoEnd) {
						// eslint-disable-next-line no-undef
						const player = new Vimeo.Player(
							videoPlayerElement.querySelector('iframe')
						);

						player.on('timeupdate', data => {
							if (data.seconds > videoEnd) {
								player.pause();
							}
						});
					}
				});
			};

			document.body.appendChild(script);
		}
	}

	return (
		<Fragment>
			{videoUrl && (
				<div
					className={videoPlayerClasses}
					data-start={videoOptions.startTime}
					data-end={videoOptions.endTime}
					data-type={parsedVideo.type}
				>
					{parsedVideo.type === 'direct' && (
						<video
							loop={!!parseInt(videoOptions.loop)}
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
		</Fragment>
	);
};

export default VideoLayer;
