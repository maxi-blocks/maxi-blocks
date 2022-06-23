/**
 * Internal dependencies
 */
import parseVideo from './parseVideo';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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

	if (isEmpty(url)) return url;

	const parsedVideo = parseVideo(url);
	let parsedVideoUrl = url;

	switch (parsedVideo.type) {
		case 'youtube': {
			parsedVideoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?rel=0&enablejsapi=1`;

			let controls = '&controls=0';
			let autoplay = '&autoplay=0';

			if (showPlayerControls) controls = '&controls=1';
			if (isAutoplay) autoplay = '&autoplay=1';
			if (isMuted) parsedVideoUrl += '&mute=1';
			if (startTime) parsedVideoUrl += `&start=${startTime}`;
			if (endTime) parsedVideoUrl += `&end=${endTime}`;

			parsedVideoUrl += controls + autoplay;

			break;
		}
		case 'vimeo': {
			parsedVideoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?autopause=0`;

			let controls = '&controls=0';

			if (showPlayerControls) controls = '&controls=1';
			if (isLoop) parsedVideoUrl += '&loop=1';
			if (isAutoplay) parsedVideoUrl += '&autoplay=1';
			if (isMuted) parsedVideoUrl += '&muted=1';
			if (startTime) parsedVideoUrl += `#t=${startTime}`;

			parsedVideoUrl += controls;

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
