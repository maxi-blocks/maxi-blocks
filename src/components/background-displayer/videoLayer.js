/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';
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
	const { videoOptions, className, breakpoint } = props;

	let videoUrl = videoOptions['background-video-mediaURL'];

	if (isNil(videoUrl)) return null;

	const videoLoop = getLastBreakpointAttribute(
		'background-video-loop',
		breakpoint,
		videoOptions
	);
	const videoStartTime = getLastBreakpointAttribute(
		'background-video-startTime',
		breakpoint,
		videoOptions
	);
	const videoEndTime = getLastBreakpointAttribute(
		'background-video-endTime',
		breakpoint,
		videoOptions
	);

	const parsedVideo = parseVideo(videoUrl);

	switch (parsedVideo.type) {
		case 'youtube': {
			videoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1`;

			if (videoLoop) videoUrl += `&loop=1&playlist=${parsedVideo.id}`;
			if (videoStartTime) videoUrl += `&start=${videoStartTime}`;
			if (videoEndTime) videoUrl += `&end=${videoEndTime}`;

			break;
		}
		case 'vimeo': {
			videoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?controls=0&autoplay=1&muted=1&autopause=0`;

			if (videoLoop) videoUrl += '&loop=1';
			if (videoStartTime) videoUrl += `#t=${videoStartTime}`;

			break;
		}
		case 'direct': {
			if (videoStartTime && !videoEndTime)
				videoUrl += `#t=${videoStartTime}`;
			if (videoEndTime)
				videoUrl += `#t=${videoStartTime},${videoEndTime}`;
			break;
		}
		default:
			break;
	}

	const videoPlayerClasses = classnames(
		'maxi-background-displayer__layer',
		'maxi-background-displayer__video-player',
		className
	);

	// Pause vimeo at the endTime
	if (parsedVideo.type === 'vimeo' && videoEndTime) {
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
					const videoEnd =
						videoPlayerElement.getAttribute('data-end');
					const videoType =
						videoPlayerElement.getAttribute('data-type');

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

	const videoValidation = url =>
		url.match(
			/https?:\/\/.*\.(?:mp4|webm|ogg)|(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
		);

	return (
		<>
			{videoValidation(videoUrl) && (
				<div
					className={videoPlayerClasses}
					data-start={videoStartTime}
					data-end={videoEndTime}
					data-type={parsedVideo.type}
				>
					{parsedVideo.type === 'direct' && (
						<video
							loop={!!+videoLoop}
							src={videoUrl}
							autoPlay
							muted
						/>
					)}

					{(parsedVideo.type === 'youtube' ||
						parsedVideo.type === 'vimeo') && (
						<div className='maxi-background-displayer__iframe-wrapper'>
							<iframe
								title={`${parsedVideo.type} video`}
								src={videoUrl}
								frameBorder='0'
								allow='autoplay'
								allowFullScreen='allowfullscreen'
							/>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default VideoLayer;
