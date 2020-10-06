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
	const { background, className } = props;

	const value = !isObject(background) ? JSON.parse(background) : background;

	const classes = classnames('maxi-background-displayer', className);

	let videoUrl = value.videoOptions.mediaURL;

	const parsedVideo = parseVideo(videoUrl);

	if (videoUrl && parsedVideo.type === 'youtube') {
		videoUrl = `https://www.youtube.com/embed/${parsedVideo.id}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1`;

		if (parseInt(value.videoOptions.loop)) {
			videoUrl += `&loop=1&&playlist=${parsedVideo.id}`;
		}
	}

	if (videoUrl && parsedVideo.type === 'vimeo') {
		videoUrl = `https://player.vimeo.com/video/${parsedVideo.id}?controls=0&autoplay=1&mute=1?autopause=0`;

		if (parseInt(value.videoOptions.loop)) {
			videoUrl += '&loop=1';
		}
	}

	return (
		<div className={classes}>
			<div className='maxi-background-displayer__overlay' />
			<div className='maxi-background-displayer__color' />
			{value.activeMedia === 'image' && (
				<div className='maxi-background-displayer__images' />
			)}
			{value.activeMedia === 'video' && videoUrl && (
				<div className='maxi-background-displayer__video-player'>
					{parsedVideo.type === 'direct' && (
						<video
							className='maxi-background-displayer__video-player__video'
							loop={!!parseInt(value.videoOptions.loop)}
							preload={value.videoOptions.preload}
							src={videoUrl}
							autoPlay
							muted
						/>
					)}

					{parsedVideo.type === 'youtube' && (
						<iframe
							className='maxi-background-displayer__video-player__video'
							title='Youtube Video'
							src={videoUrl}
							frameBorder='0'
							allow='autoplay'
						/>
					)}

					{parsedVideo.type === 'vimeo' && (
						<iframe
							className='maxi-background-displayer__video-player__video'
							title='Vimeo Video'
							src={videoUrl}
							frameBorder='0'
							allow='autoplay'
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default BackgroundDisplayer;
