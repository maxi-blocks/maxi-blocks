/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

const VideoPlayer = props => {
	const {
		videoType,
		embedUrl,
		isLoop,
		isAutoplay,
		isMuted,
		showPlayerControls,
		isSelected,
		uniqueID,
		startTime,
		endTime,
	} = props;

	const playerID = `${uniqueID}-player`;
	let player;

	const handleStateChange = state => {
		if (state.data === 0 && isLoop) {
			player.seekTo(startTime || 0);
		}
	};

	const handleYoutubeVideo = () => {
		player = new window.YT.Player(playerID, {
			events: {
				onStateChange: handleStateChange,
			},
		});
	};

	const handleVimeoVideo = () => {
		const playerElement = document.getElementById(playerID);
		player = new window.Vimeo.Player(playerElement);
		player.on('timeupdate', data => {
			if (data.seconds > +endTime) {
				if (isLoop) player.setCurrentTime(startTime || '0');
				else player.pause();
			}
		});
	};

	useEffect(() => {
		if (videoType === 'youtube') {
			if (!window.YT) {
				const script = document.createElement('script');
				script.src = 'https://www.youtube.com/iframe_api';
				script.id = 'maxi-youtube-sdk';
				window.onYouTubeIframeAPIReady = handleYoutubeVideo; // This function will be called once the API is ready
				document.body.appendChild(script);
			} else if (window.YT && window.YT.Player) {
				// Make sure YT.Player is defined
				handleYoutubeVideo();
			}
		} else if (videoType === 'vimeo') {
			if (!window.Vimeo) {
				const script = document.createElement('script');
				script.src = 'https://player.vimeo.com/api/player.js';
				script.id = 'maxi-vimeo-sdk';
				script.async = true;
				script.onload = () => {
					script.onload = null;
					handleVimeoVideo();
				};
				document.body.appendChild(script);
			} else {
				handleVimeoVideo();
			}
		}
	}, [videoType, endTime, startTime, isLoop]);

	return (
		<div className='maxi-video-block__video-container'>
			{videoType === 'direct' ? (
				<video
					src={embedUrl}
					className='maxi-video-block__video-player'
					id={playerID}
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
					id={playerID}
					title='video player'
					allowFullScreen
					allow='autoplay'
					src={embedUrl}
				/>
			)}
			{!isSelected && (
				<div className='maxi-video-block__select-overlay' />
			)}
		</div>
	);
};

export default VideoPlayer;
