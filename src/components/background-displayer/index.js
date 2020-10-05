/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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

	const getYoutubeVideoId = url => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

		const match = url.match(regExp);

		return match && match[2].length === 11 ? match[2] : null;
	};

	if (videoUrl && value.videoOptions.type === 'youtube') {
		const videoId = getYoutubeVideoId(videoUrl);

		videoUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&autoplay=1&mute=1`;

		if (parseInt(value.videoOptions.loop)) {
			videoUrl += '?loop=1';
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
					{(value.videoOptions.type === 'upload' ||
						value.videoOptions.type === 'direct') && (
						<video
							autoPlay={!!parseInt(value.videoOptions.autoplay)}
							loop={!!parseInt(value.videoOptions.loop)}
							muted={!!parseInt(value.videoOptions.muted)}
							preload={value.videoOptions.preload}
							src={videoUrl}
						/>
					)}

					{value.videoOptions.type === 'youtube' && (
						<iframe
							title='Youtube Video'
							src={videoUrl}
							frameBorder='0'
							allowFullScreen='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default BackgroundDisplayer;
