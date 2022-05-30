/**
 * Internal dependencies
 */
import parseVideo from './parseVideo';

const getParsedVideoUrl = props => {
	const {
		url,
		isLoop,
		startTime,
		endTime,
		isAutoplay,
		isMuted,
		showPlayerControls,
	} = props;

	const parsedVideo = parseVideo(url);
	let parsedVideoUrl = url;

	switch (parsedVideo.type) {
		case 'youtube': {
			parsedVideoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?rel=0`;

			let controls = '&controls=0';
			let autoplay = '&autoplay=0';

			if (showPlayerControls) controls = '&controls=1';
			if (isAutoplay) autoplay = '&autoplay=1';
			if (isMuted) parsedVideoUrl += '&mute=1';
			if (isLoop) parsedVideoUrl += `&loop=1&playlist=${parsedVideo.id}`;
			if (startTime) parsedVideoUrl += `&start=${startTime}`;
			if (endTime) parsedVideoUrl += `&end=${endTime}`;

			parsedVideoUrl += controls + autoplay;

			break;
		}
		case 'vimeo': {
			parsedVideoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?controls=0&autoplay=0&muted=1&autopause=0`;

			if (isLoop) parsedVideoUrl += '&loop=1';
			if (startTime) parsedVideoUrl += `#t=${startTime}`;

			break;
		}
		case 'direct': {
			if (startTime && !endTime) parsedVideoUrl += `#t=${startTime}`;
			if (endTime) parsedVideoUrl += `#t=${startTime},${endTime}`;
			break;
		}
		default:
			break;
	}

	return parsedVideoUrl;
};

export default getParsedVideoUrl;
