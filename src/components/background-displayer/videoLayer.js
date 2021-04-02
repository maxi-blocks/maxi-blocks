/**
 * WordPress dependencies
 */
import { Fragment  } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import parseVideo from './utils';
import { isNil } from 'lodash';

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

	let videoUrl = videoOptions['background-video-mediaURL'];

	const parsedVideo = !isNil(videoUrl) && parseVideo(videoUrl);

	if (!isNil(videoUrl) && parsedVideo.type === 'youtube') {
		videoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1`;

		if (videoOptions['background-video-loop']) {
			videoUrl += `&loop=1&playlist=${parsedVideo.id}`;
		}

		if (videoOptions['background-video-startTime']) {
			videoUrl += `&start=${videoOptions['background-video-startTime']}`;
		}

		if (videoOptions['background-video-endTime']) {
			videoUrl += `&end=${videoOptions['background-video-endTime']}`;
		}
	}

	if (!isNil(videoUrl) && parsedVideo.type === 'vimeo') {
		videoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?controls=0&autoplay=1&muted=1&autopause=0`;

		if (videoOptions['background-video-loop']) {
			videoUrl += '&loop=1';
		}

		if (videoOptions['background-video-startTime']) {
			videoUrl += `#t=${videoOptions['background-video-startTime']}`;
		}
	}

	if (!isNil(videoUrl) && parsedVideo.type === 'direct') {
		if (
			videoOptions['background-video-startTime'] &&
			!videoOptions['background-video-endTime']
		) {
			videoUrl += `#t=${videoOptions['background-video-startTime']}`;
		}

		if (videoOptions['background-video-endTime']) {
			videoUrl += `#t=${videoOptions['background-video-startTime']},${videoOptions['background-video-endTime']}`;
		}
	}

	const videoPlayerClasses = classnames(
		'maxi-background-displayer__layer',
		'maxi-background-displayer__video-player',
		!videoOptions['background-video-playOnMobile'] &&
			'maxi-background-displayer__video-player--mobile-hidden',
		className
	);

	// Pasue vimeo at the endTime
	if (
		!isNil(videoUrl) &&
		parsedVideo.type === 'vimeo' &&
		videoOptions['background-video-endTime'] &&
		parentEl
	) {
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
			{!isNil(videoUrl) &&
				videoUrl.match(
					/https?:\/\/.*\.(?:mp4|webm|ogg)|(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
				) && (
					<div
						className={videoPlayerClasses}
						data-start={videoOptions['background-video-startTime']}
						data-end={videoOptions['background-video-endTime']}
						data-type={parsedVideo.type}
					>
						{parsedVideo.type === 'direct' && (
							<video
								loop={!!+videoOptions['background-video-loop']}
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
